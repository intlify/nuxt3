import {
  defineNuxtModule,
  addPlugin,
  extendWebpackConfig
} from '@nuxt/kit-edge' // TODO: '@nuxt/kit'
import path from 'path'
import type { I18nOptions } from 'vue-i18n'

const IntlifyModule = defineNuxtModule<I18nOptions>({
  name: '@intlify/nuxt3',
  configKey: 'intlify',
  setup(option, nuxt) {
    console.log('Nuxt Module setup', option, nuxt)

    // TODO: should add template option rendering for plugin
    //

    // add plugin
    addPlugin({
      src: path.resolve(__dirname, './plugin.mjs')
      // fileName: path.join('@intlify/nuxt3', 'plugin.mjs')
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
