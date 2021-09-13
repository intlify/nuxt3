# @intlify/nuxt3

Nuxt3 module for vue-i18n-next

> ⚠️ NOTE: This is a WIP module for Nuxt 3, It isn't available yet.

## ❓ What is defference from `@nuxtjs/i18n` ?

This nuxt module is intended to be a quick and easy way for people to use vue-i18n-next with Nuxt3.

It also has the purpose of finding issues on the vue-i18n-next so that `@nuxtjs/i18n` can support Nuxt3.

- setup `vue-i18n` for your Nuxt3 project
  - You do not need to entrypoint codes with `createI18n`.
- setup bundle tools
  - `@intlify/vue-i18n-loader` and `@intlify/vite-plugin-vue-i18n` are included
- setup `@intlify/vue-i18n-extendsions`

## 💿 Installation

First install

```sh
# for npm
npm install --save-dev @intlify/nuxt3

# for yarn
yarn add -D @intlify/nuxt3
```

After the installation in the previous section, you need to add `@intlify/nuxt3` module to `buildModules` options of `nuxt.confg.[ts|js]`

```js
// nuxt.config.js
export default {
  // ...
  buildModules: ['@intlify/nuxt3']
  // ...
}
```

## 🔧 Configurations

You can set the following types in nuxt.config with below options:

```ts
export interface IntlifyModuleOptions {
  /**
   * Options specified for `createI18n` in vue-i18n.
   *
   * If you want to specify not only objects but also functions such as messages functions and modifiers for the option, specify the path where the option is defined.
   * The path should be relative to the Nuxt project.
   */
  vueI18n?: I18nOptions | string
}
```

The above options can be specified in the `intlify` config of nuxt.config

nuxt.config below:

```js
export default {
  // ...
  buildModules: ['@intlify/nuxt3'],
  // config for `@intlify/nuxt3`
  intlify: {
    vueI18n: {
      // You can setting same `createI18n` options here !
      locale: 'en',
      messages: {
        en: {
          hello: 'Hello'
        },
        ja: {
          hello: 'こんにちは'
        }
      }
    }
  }
}
```

If you specify the path to `intlify.vueI18n`, you need to set it to a file in `mjs` format.

The following nuxt.confg:

```js
export default {
  // ...
  buildModules: ['@intlify/nuxt3'],
  // config for `@intlify/nuxt3`
  intlify: {
    vueI18n: 'vue-i18n.mjs'
  }
}
```

`vue-i18n.mjs` as follows:

```js
// The configuration must be returned with an **async function**.
export default async () => ({
  locale: 'en',
  messages: {
    en: {
      hello: ({ named }) => `HELLO, ${named('name')}!`
    },
    ja: {
      hello: 'こんにちは、{name}!'
    }
  }
})
```

## ©️ LICENSE

MIT
