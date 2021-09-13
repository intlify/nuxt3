import { createI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: resolved with Nuxt
import { defineNuxtPlugin } from '#app'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: resolved with Nuxt
import optionsLoader from '#build/intlify.options.mjs'

// async function plugin(nuxt: any, arg2: any) {
export default defineNuxtPlugin(async (nuxt: any) => {
  console.log('nuxt plugin', nuxt)
  const { app } = nuxt

  const loadedOptions = await optionsLoader()
  console.log('loadedOptions', loadedOptions)

  // TODO: more implementation !!
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    ...loadedOptions
  })
  app.use(i18n)
})

// export default plugin
