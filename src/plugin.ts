import { createI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: resolved with Nuxt
import messages from '#build/intlify.locale.messages.mjs'

function plugin(nuxt: any, arg2: any) {
  console.log('nuxt plugin', nuxt)
  console.log('messages', messages)

  const { app } = nuxt
  // TODO: more implementation !!
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages
  })
  app.use(i18n)
}

export default plugin
