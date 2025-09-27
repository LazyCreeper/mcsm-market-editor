import App from './App.vue'
import { registerPlugins } from './plugins'
import router from './router'
import { initI18n, LANGUAGE_KEY } from './utils/i18n'
;(async () => {
  await initI18n(localStorage.getItem(LANGUAGE_KEY) ?? 'zh-CN')

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)

  await registerPlugins()
  app.mount('#app')
})()

