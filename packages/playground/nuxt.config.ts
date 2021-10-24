import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: ['@intlify/nuxt3'],
  vite: false,
  intlify: {
    vueI18n: {
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
})
