import '@/assets/css/define/theme.less'
import '@/assets/css/define/global.less'
import './plugins/highlight.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from '@/router'
import App from '@/App.vue'
import * as plugins from '@/plugins'

async function bootstrap() {
  const app = createApp(App)

  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  app.use(pinia)

  app.use(router)

  plugins.setHljsVuePlugin(app)
  plugins.setupNaive(app)
  plugins.setMdEditor(app)
  plugins.setComponents(app)
  plugins.setupDirective(app)

  app.mount('#app')
}

bootstrap()