import {
  defineNuxtModule,
  addPlugin,
  addTemplate,
  extendWebpackConfig
} from '@nuxt/kit-edge' // TODO: '@nuxt/kit'
import { resolve } from 'upath'
import { readFile } from 'fs/promises'
import { isString } from '@intlify/shared'
import type { I18nOptions } from 'vue-i18n'

export interface IntlifyModuleOptions {
  vueI18n?: I18nOptions | string
}

const IntlifyModule = defineNuxtModule<IntlifyModuleOptions>({
  name: '@intlify/nuxt3',
  configKey: 'intlify',
  defaults: {},
  setup(options, nuxt) {
    console.log('Nuxt Module setup', options, nuxt)

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
            resolve(nuxt.options.srcDir, options.vueI18n),
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

    // TODO: should install @intlify/vite-plugin-vue-i18n
    //
  }
})

export default IntlifyModule
