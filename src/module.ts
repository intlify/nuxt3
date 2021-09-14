import {
  defineNuxtModule,
  addPlugin,
  addTemplate,
  extendWebpackConfig,
  extendViteConfig
} from '@nuxt/kit-edge' // TODO: '@nuxt/kit'
import { resolve } from 'upath'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { isString } from '@intlify/shared'
import VitePlugin from '@intlify/vite-plugin-vue-i18n'
import { resolveLocales } from './utils'
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

export function defineVueI18n(options: I18nOptions): I18nOptions {
  return options
}

const IntlifyModule = defineNuxtModule<IntlifyModuleOptions>({
  name: '@intlify/nuxt3',
  configKey: 'intlify',
  defaults: {},
  async setup(options, nuxt) {
    // transpile vue-i18n
    // nuxt.options.build.transpile.push('vue-i18n')

    const localeDir = options.localeDir || 'locales'
    const localePath = resolve(nuxt.options.srcDir, localeDir)
    const hasLocaleFiles = existsSync(localePath)
    const localeResources = (await resolveLocales(localePath)) || []

    // add vue-i18n options template
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

    // add locale messages template
    addTemplate({
      filename: 'intlify.locales.mjs',
      getContents: ({ utils }) => {
        const importMapper = new Map<string, string>()
        localeResources.forEach(({ locale }) => {
          importMapper.set(locale, utils.importName(`locale_${locale}`))
        })
        // prettier-ignore
        return `
${localeResources.map(l => `import ${importMapper.get(l.locale)} from '${l.path}'`).join('\n')}
export default { ${[...importMapper].map(i => `${JSON.stringify(i[0])}:${i[1]}`).join(',')} }
`
      }
    })

    // install @intlify/vue-i18n-loader
    extendWebpackConfig(config => {
      if (hasLocaleFiles) {
        config.module?.rules.push({
          test: /\.(json5?|ya?ml)$/,
          type: 'javascript/auto',
          loader: '@intlify/vue-i18n-loader',
          include: [localePath]
        })
      }
      config.module?.rules.push({
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@intlify/vue-i18n-loader'
      })
    })

    // install @intlify/vite-plugin-vue-i18n
    extendViteConfig(config => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const viteOptions: any = {
        compositionOnly: false
      }
      if (hasLocaleFiles) {
        viteOptions['include'] = resolve(localePath, './**')
      }
      config.plugins.push(VitePlugin(viteOptions))
    })
  }
})

export default IntlifyModule
