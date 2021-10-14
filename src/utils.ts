import { resolveFiles } from '@nuxt/kit'
import { parse } from 'upath'

export type LocaleInfo = {
  locale: string
  filename: string
  path: string
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
