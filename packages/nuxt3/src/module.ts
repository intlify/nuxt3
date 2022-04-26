import {
  defineNuxtModule,
  addTemplate,
  addPluginTemplate,
  extendWebpackConfig,
  extendViteConfig,
  addWebpackPlugin,
  addVitePlugin
} from '@nuxt/kit'
import { createRequire } from 'module'
import { resolve } from 'pathe'
import { isObject, isString } from '@intlify/shared'
import { vueI18n as VitePlugin } from '@intlify/vite-plugin-vue-i18n'
import { distDir } from './dirs'
import { exists, resolveLocales, setupAliasTranspileOptions } from './utils'
import { optionLoader } from './loader'
import {
  INTLIFY_VUEI18N_OPTIONS_VIRTUAL_FILENAME,
  INTLIFY_LOCALE_VIRTUAL_FILENAME
} from './constants'

import type { I18nOptions } from 'vue-i18n'
import type { IntlifyModuleOptions } from './types'
import type { LoaderOptions } from './loader'

export * from './types'

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
  meta: {
    name: '@intlify/nuxt3',
    configKey: 'intlify'
  },
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
    const hasLocaleFiles = await exists(localePath)
    const localeResources = (await resolveLocales(localePath)) || []

    // add vue-i18n options template
    addTemplate({
      filename: INTLIFY_VUEI18N_OPTIONS_VIRTUAL_FILENAME,
      getContents: () => {
        return `${nuxt.options.dev ? "// 'vueI18n' option loading ..." : ''}`
      }
    })

    // prettier-ignore
    const loaderOptions: LoaderOptions = {
      vueI18n: isObject(options.vueI18n)
        ? options.vueI18n
        : isString(options.vueI18n)
          ? resolve(nuxt.options.rootDir, options.vueI18n)
          : undefined
    }
    addWebpackPlugin(optionLoader.webpack(loaderOptions))
    addVitePlugin(optionLoader.vite(loaderOptions))

    // add plugin
    addPluginTemplate({
      filename: 'plugin.mjs',
      src: resolve(distDir, 'runtime/plugin.mjs')
    })

    // add locale messages template
    addTemplate({
      filename: INTLIFY_LOCALE_VIRTUAL_FILENAME,
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
          include: [resolve(localePath, './**')]
        })
      }
      config.module?.rules.push({
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@intlify/vue-i18n-loader'
      })

      if (!nuxt.options.dev) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      config.plugins?.push(VitePlugin(viteOptions))
    })
  }
})

export default IntlifyModule

declare module '@nuxt/schema' {
  interface NuxtConfig {
    intlify?: IntlifyModuleOptions
  }
}
