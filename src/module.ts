import {
  defineNuxtModule,
  addPlugin,
  addTemplate,
  extendWebpackConfig
} from '@nuxt/kit-edge' // TODO: '@nuxt/kit'
import path from 'path'
import type { I18nOptions } from 'vue-i18n'

const IntlifyModule = defineNuxtModule<I18nOptions>({
  name: '@intlify/nuxt3',
  configKey: 'intlify',
  setup(option, nuxt) {
    console.log('Nuxt Module setup', option, nuxt)

    // transpile vue-i18n
    // nuxt.options.build.transpile.push('vue-i18n')

    // TODO: should add template for `createI18n` options
    //

    // TODO: should add template for functionnable options (e.g. `modifiers` option)
    //

    // add locale message template
    addTemplate({
      filename: 'intlify.locale.messages.mjs',
      // TODO: should be generated for locale message with message-compiler
      getContents: () =>
        'export default ' + JSON.stringify(option.messages || {})
    })

    // add plugin
    addPlugin({
      src: path.resolve(__dirname, './plugin.mjs')
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
