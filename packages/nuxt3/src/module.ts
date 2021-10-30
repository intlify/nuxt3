import {
  defineNuxtModule,
  addTemplate,
  addPluginTemplate,
  extendWebpackConfig,
  extendViteConfig
} from '@nuxt/kit'
import { createRequire } from 'module'
import { resolve } from 'pathe'
import { promises as fs, existsSync } from 'fs'
import { isString } from '@intlify/shared'
import VitePlugin from '@intlify/vite-plugin-vue-i18n'
import { distDir } from './dirs'
import { resolveLocales, isViteMode, setupAliasTranspileOptions } from './utils'

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

const MODULE_DEV_ENTRIES = {
  '@intlify/shared': '@intlify/shared/dist/shared.esm-bundler.js',
  '@intlify/core-base': '@intlify/core-base/dist/core-base.esm-bundler.js',
  '@vue/devtools-api': '@vue/devtools-api/lib/esm/index.js',
  '@intlify/devtools-if':
    '@intlify/devtools-if/dist/devtools-if.esm-bundler.js',
  'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js'
}

const MODULE_PROD_ENTRIES = {
  '@intlify/shared': '@intlify/shared/dist/shared.esm-bundler.js',
  '@intlify/core-base': '@intlify/core-base/dist/core-base.esm-bundler.js',
  '@vue/devtools-api': '@vue/devtools-api/lib/esm/index.js',
  '@intlify/devtools-if':
    '@intlify/devtools-if/dist/devtools-if.esm-bundler.js',
  'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
}

const IntlifyModule = defineNuxtModule<IntlifyModuleOptions>({
  name: '@intlify/nuxt3',
  configKey: 'intlify',
  defaults: {},
  async setup(options, nuxt) {
    const _require = createRequire(import.meta.url)

    for (const [name, entry] of Object.entries(
      nuxt.options.dev ? MODULE_DEV_ENTRIES : MODULE_PROD_ENTRIES
    )) {
      setupAliasTranspileOptions(nuxt, name, _require.resolve(entry))
    }

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
          const file = await fs.readFile(
            resolve(nuxt.options.rootDir, options.vueI18n as string),
            'utf-8'
          )
          // TODO: check file content, whether it's valid async syntax
          return `${file}`
        }
      })
    }

    // add plugin
    addPluginTemplate({
      filename: 'plugin.mjs',
      src: resolve(distDir, 'runtime/plugin.mjs')
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
        // @ts-ignore TODO
        config.module?.rules.push({
          test: /\.(json5?|ya?ml)$/,
          type: 'javascript/auto',
          loader: '@intlify/vue-i18n-loader',
          include: [localePath]
        })
      }
      // @ts-ignore TODO
      config.module?.rules.push({
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@intlify/vue-i18n-loader'
      })

      if (!nuxt.options.dev) {
        // @ts-ignore TODO
        ;(config.resolve?.alias as any)['vue-i18n'] =
          'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
      }

      // TODO: unplugin implementation
      // config.plugins?.push(webpack.DefinePlugin, [
      //   {
      //     __VUE_I18N_LEGACY_API__: legacyApiFlag,
      //     __VUE_I18N_FULL_INSTALL__: installFlag,
      //     __VUE_I18N_PROD_DEVTOOLS__: 'false'
      //   }
      // ])
    })

    // install @intlify/vite-plugin-vue-i18n
    extendViteConfig(config => {
      // TODO: unplugin implementation
      if (!nuxt.options.dev) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(config.resolve?.alias as any)['vue-i18n'] =
          'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const viteOptions: any = {
        compositionOnly: false
      }
      if (hasLocaleFiles) {
        viteOptions['include'] = resolve(localePath, './**')
      }
      // @ts-ignore TODO
      config.plugins.push(VitePlugin(viteOptions))
    })
  }
})

export default IntlifyModule
