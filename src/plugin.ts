import { createI18n } from 'vue-i18n'

function plugin(nuxt: any) {
  const { app } = nuxt
  // TODO:
  const i18n = createI18n({})
  app.use(i18n)
}

export default plugin
