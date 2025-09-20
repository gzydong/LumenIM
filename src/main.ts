import '@/assets/css/define/global.less'
import '@/assets/css/define/theme.less'
import '@/assets/css/dropsize.less'
import { createApp } from 'vue'
import App from './App.vue'
import * as plugins from './plugins'
import router from './router'

function bootstrap() {
  const app = createApp(App)

  app.use(router)

  plugins.setPinia(app)
  plugins.setHljsVuePlugin(app)
  plugins.setupNaive(app)
  plugins.setComponents(app)
  plugins.setupDirective(app)

  app.mount('#app')
}

bootstrap()
