import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  buildModules: ['@intlify/nuxt3'],
  // vite: false,
  // intlify: {
  //   vueI18n: 'vue-i18n.mjs'
  // }
  intlify: {
    localeDir: 'lang',
    vueI18n: {
      locale: 'ja',
      messages: {
        en: {
          hello: 'Hello, {name}!',
          language: 'Language',
          menu: {
            home: 'Home',
            about: 'About'
          },
          about: {
            description: 'This is about page'
          }
        },
        ja: {
          hello: 'こんにちは、{name}！',
          language: '言語',
          menu: {
            home: 'ホーム',
            about: 'アバウト'
          },
          about: {
            description:
              'このページのこのサイトの概要について書かれたページです。'
          }
        }
      }
    }
  }
})
