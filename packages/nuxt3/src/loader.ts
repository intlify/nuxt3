import createDebug from 'debug'
import { createUnplugin } from 'unplugin'
import { parseURL } from 'ufo'
import { promises as fs } from 'fs'
import { isObject, isString } from '@intlify/shared'
import { INTLIFY_VUEI18N_OPTIONS_VIRTUAL_FILENAME } from './constants'

import type { IntlifyModuleOptions } from './types'

export type LoaderOptions = Pick<IntlifyModuleOptions, 'vueI18n'>

const debug = createDebug('@intlify/nuxt3:loader')

export const optionLoader = createUnplugin((options: LoaderOptions = {}) => ({
  name: 'intlify-nuxt3-options-loader',
  enforce: 'post',

  transformInclude(id) {
    const { pathname } = parseURL(id)
    return pathname.endsWith(INTLIFY_VUEI18N_OPTIONS_VIRTUAL_FILENAME)
  },

  async transform(code) {
    debug('original code -> ', code)

    let loadingCode = `export default () => Promise.resolve({})`
    if (isObject(options.vueI18n)) {
      loadingCode = `export default () => Promise.resolve(${JSON.stringify(
        options.vueI18n || {}
      )})`
    } else if (isString(options.vueI18n)) {
      loadingCode = await fs.readFile(options.vueI18n, 'utf8')
    }

    debug('injecting code -> ', loadingCode)
    return `${code}\n${loadingCode}`
  }
}))
