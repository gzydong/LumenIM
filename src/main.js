import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import '@/assets/css/define/theme.less'
import '@/assets/css/define/global.less'
import './plugins/highlight.js'
import { setComponents } from './plugins/me-core.js'
import { setupNaive } from './plugins/naive-ui'
import { setMdEditor } from './plugins/md-editor'
import { setHljsVuePlugin } from './plugins/hljs'

async function bootstrap() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.directive('focus', {
    mounted(el) {
      setTimeout(() => {
        el.focus()
      }, 0)
    },
  })

  setHljsVuePlugin(app)
  setupNaive(app)
  setMdEditor(app)
  setComponents(app)

  app.mount('#app')
}

bootstrap()
