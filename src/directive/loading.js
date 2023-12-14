import { createApp } from 'vue'
import Loading from './inner/loading.vue'

export default {
  mounted(el, binding) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    el.instance = instance

    if (binding.value) {
      if (el.style.position == '') {
        el.dataset['position'] = true
      }

      if (el.style.overflow == '') {
        el.dataset['overflow'] = true
      }

      appendEl(el)
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? appendEl(el) : removeEl(el)
    }
  }
}

// 插入元素
const appendEl = (el) => {
  // 给父元素加个定位，让loading元素定位
  el.style.position = 'relative'
  el.style.overflow = 'hidden'

  el?.appendChild(el.instance.$el)
}

// 移除元素
const removeEl = (el) => {
  if (el.dataset['position']) {
    el.style.position = ''
  }

  if (el.dataset['overflow']) {
    el.style.overflow = ''
  }

  delete el.dataset['position']
  delete el.dataset['overflow']

  let $el = el.instance.$el
  if (el?.contains($el)) {
    el?.removeChild($el)
  }
}
