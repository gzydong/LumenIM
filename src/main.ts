import '@/assets/css/define/theme.less'
import '@/assets/css/define/global.less'
import './plugins/highlight.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import { setComponents } from './plugins/me-core'
import { setupNaive } from './plugins/naive-ui'
import { setMdEditor } from './plugins/md-editor'
import { setHljsVuePlugin } from './plugins/hljs'
import { setupDirective } from './plugins/directive'
import { isElectronMode } from '@/utils/common'

async function bootstrap() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  setHljsVuePlugin(app)
  setupNaive(app)
  setMdEditor(app)
  setComponents(app)
  setupDirective(app)

  app.mount('#app')
}

bootstrap()

document.body.addEventListener('click', (event) => {
  let target = event.target

  if (target.nodeName.toLocaleLowerCase() === 'a') {
    // 判断是否匹配目标元素
    if (event.preventDefault) {
      // 对捕获到的 a 标签进行处理
      event.preventDefault()
    } else {
      window.event.returnValue = false
    }

    choosePush(target) // 处理完 a 标签的内容，重新触发跳转，根据原来 a 标签页 target 来判断是否需要新窗口打开
  }
})

function choosePush(el: any) {
  const href = el.getAttribute('href')

  if (href) {
    if (isElectronMode() || el.getAttribute('alt') === 'link') {
      return window.open(href)
    }

    window.location.href = href
  }
}
