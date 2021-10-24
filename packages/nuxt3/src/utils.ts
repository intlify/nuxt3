import { resolveFiles } from '@nuxt/kit'
import { parse } from 'pathe'
import { isBoolean, isObject } from '@intlify/shared'

import type { NuxtOptions } from '@nuxt/kit'

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
