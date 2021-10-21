import { createI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: resolved with Nuxt
import { defineNuxtPlugin } from '#app'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: resolved with Nuxt
import optionsLoader from '#build/intlify.options.mjs'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: resolved with Nuxt
import messages from '#build/intlify.locales.mjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEmpty = (obj: any) => Object.keys(obj).length === 0

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default defineNuxtPlugin(async (nuxt: any) => {
  const { vueApp: app } = nuxt

  const loadedOptions = await optionsLoader()
  if (!isEmpty(messages)) {
    loadedOptions.messages = messages
  }

  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    ...loadedOptions
  })
  app.use(i18n)
})
