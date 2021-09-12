import { createI18n } from 'vue-i18n'

function plugin(nuxt: any, arg2: any) {
  console.log('nuxt plugin', nuxt)
  const { app } = nuxt
  // TODO: more implementation !!
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: {
      en: {
        hello: 'Hello {name}!'
      },
      ja: {
        hello: 'こんにちは {name}！'
      }
    }
  })
  app.use(i18n)
}

export default plugin
