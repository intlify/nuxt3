import {
  defineNuxtModule,
  addPlugin,
  addTemplate,
  extendWebpackConfig,
  extendViteConfig
} from '@nuxt/kit-edge' // TODO: '@nuxt/kit'
import { resolve } from 'upath'
import { readFile } from 'fs/promises'
import { isString } from '@intlify/shared'
import VitePlugin from '@intlify/vite-plugin-vue-i18n'
import type { I18nOptions } from 'vue-i18n'

/**
 * `@intlify/nuxt3` module options definition
 */
export interface IntlifyModuleOptions {
  /**
   * Options specified for `createI18n` in vue-i18n.
   *
   * If you want to specify not only objects but also functions such as messages functions and modifiers for the option, specify the path where the option is defined.
   * The path should be relative to the Nuxt project.
   */
  vueI18n?: I18nOptions | string
}

export function defineVueI18n(options: I18nOptions): I18nOptions {
  return options
}

const IntlifyModule = defineNuxtModule<IntlifyModuleOptions>({
  name: '@intlify/nuxt3',
  configKey: 'intlify',
  defaults: {},
  setup(options, nuxt) {
    // transpile vue-i18n
    // nuxt.options.build.transpile.push('vue-i18n')

    // TODO: should add locale loader from i18n resources
    //

    // add locale message template
    if (!isString(options.vueI18n)) {
      addTemplate({
        filename: 'intlify.options.mjs',
        getContents: ({ utils }) => {
          const name = utils.importName(`vueI18n_options_obj`)
          // prettier-ignore
          return `
const ${name} = () => Promise.resolve(${JSON.stringify(options.vueI18n || {})})\n
export default ${name}
`
        }
      })
    } else {
      addTemplate({
        filename: 'intlify.options.mjs',
        async getContents() {
          const file = await readFile(
            resolve(nuxt.options.rootDir, options.vueI18n),
            'utf-8'
          )
          // TODO: check file content, whether it's valid async syntax
          return `${file}`
        }
      })
    }

    // add plugin
    addPlugin({
      src: resolve(__dirname, './plugin.mjs')
    })

    // install @intlify/vue-i18n-loader
    extendWebpackConfig(config => {
      config.module?.rules.push({
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@intlify/vue-i18n-loader'
      })
    })

    // install @intlify/vite-plugin-vue-i18n
    extendViteConfig(config => {
      config.plugins.push(
        VitePlugin({
          compositionOnly: false
        })
      )
    })
  }
})

export default IntlifyModule
