import '@/assets/css/define/theme.less'
import '@/assets/css/define/global.less'
import './plugins/highlight.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import * as plugins from '@/plugins'

async function bootstrap() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  plugins.setHljsVuePlugin(app)
  plugins.setupNaive(app)
  plugins.setMdEditor(app)
  plugins.setComponents(app)
  plugins.setupDirective(app)

  app.mount('#app')
}

bootstrap()