# @intlify/nuxt3

Nuxt3 module for vue-i18n-next

> ⚠️ NOTE: This is a WIP module for Nuxt 3, It isn't available yet.

## ❓ What is defference from `@nuxtjs/i18n` ?

This nuxt module is intended to be a quick and easy way for people to use vue-i18n-next with Nuxt3.

It also has the purpose of finding issues on the vue-i18n-next so that `@nuxtjs/i18n` can support Nuxt3.

- setup `vue-i18n` for your Nuxt3 project
  - You do not need to set up with `createI18n`.
- setup bundle tools
  - `@intlify/vue-i18n-loader` and `@intlify/vite-plugin-vue-i18n` are included
- setup `@intlify/vue-i18n-extendsions`

## 🚀 Usage

First install

```sh
# for npm
npm install --save-dev @intlify/nuxt3

# for yarn
yarn add -D @intlify/nuxt3
```

After installed, add `@intlify/nuxt3` module to `buildModules` options of `nuxt.confg.[ts|js]`

```js
export default {
  buildModules: [['@intlify/nuxt3']]
}
```

## ©️ LICENSE

MIT
