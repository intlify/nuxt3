import { defineNuxtModule, addPlugin } from '@nuxt/kit'
import path from 'path'
import type { I18nOptions } from 'vue-i18n'

const VueI18nModule = defineNuxtModule<I18nOptions>({
  name: 'vue-i18n',
  configKey: 'vue-i18n',
  setup(option, nuxt) {
    addPlugin({ src: path.resolve(__dirname, './plugin.js') })
    // TODO:
  }
})

export default VueI18nModule
