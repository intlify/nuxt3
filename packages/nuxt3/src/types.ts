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
  /**
   * Define the directory where your locale messages files will be placed.
   *
   * If you don't specify this option, default value is `locales`
   */
  localeDir?: string
}
