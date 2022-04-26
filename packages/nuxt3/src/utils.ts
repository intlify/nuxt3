import { resolveFiles } from '@nuxt/kit'
import { parse } from 'pathe'
import { promises as fs } from 'fs'
import { isBoolean, isObject } from '@intlify/shared'

import type { NuxtOptions, Nuxt } from '@nuxt/schema'

export type LocaleInfo = {
  locale: string
  filename: string
  path: string
}

export function isViteMode(options: NuxtOptions): boolean {
  return options.vite != null
    ? isBoolean(options.vite)
      ? options.vite
      : isObject(options.vite)
    : true
}

export function setupAliasTranspileOptions(
  nuxt: Nuxt,
  name: string,
  entry: string
): void {
  nuxt.options.alias[name] = entry
  isViteMode(nuxt.options) && nuxt.options.build.transpile.push(name)
}

export async function resolveLocales(path: string): Promise<LocaleInfo[]> {
  const files = await resolveFiles(path, '**/*{json,json5,yaml,yml}')
  return files.map(file => {
    const parsed = parse(file)
    return {
      path: file,
      filename: parsed.base,
      locale: parsed.name
    }
  })
}

export async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch (e) {
    return false
  }
}
