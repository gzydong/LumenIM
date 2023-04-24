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
import { isElectronMode } from '@/utils/common'

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
  app.directive('paste', {
    created(el, binding, vnode) {
      el.addEventListener('paste', function (event) {
        //这里直接监听元素的粘贴事件
        binding.value(event)
      })
    },
  })
  app.directive('drag', {
    created(el, binding, vnode) {
      // 因为拖拽还包括拖动时的经过事件，离开事件，和进入事件，放下事件，
      // 浏览器对于拖拽的默认事件的处理是打开拖进来的资源，
      // 所以要先对这三个事件进行默认事件的禁止
      el.addEventListener('dragenter', function (event) {
        event.stopPropagation()
        event.preventDefault()
      })
      el.addEventListener('dragover', function (event) {
        event.stopPropagation()
        event.preventDefault()
      })
      el.addEventListener('dragleave', function (event) {
        event.stopPropagation()
        event.preventDefault()
      })
      el.addEventListener('drop', function (event) {
        // 这里阻止默认事件，并绑定事件的对象，用来在组件上返回事件对象
        event.stopPropagation()
        event.preventDefault()
        binding.value(event)
      })
    },
  })

  setHljsVuePlugin(app)
  setupNaive(app)
  setMdEditor(app)
  setComponents(app)

  app.mount('#app')
}

bootstrap()

document.body.addEventListener('click', event => {
  var target = event.target || event.srcElement // 兼容处理
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

function choosePush(el) {
  const href = el.getAttribute('href')

  if (isElectronMode() || el.getAttribute('alt') === 'link') {
    return window.open(href)
  }

  window.location.href = href
}
