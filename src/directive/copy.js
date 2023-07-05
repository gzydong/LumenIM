export default {
    created(el, binding, vnode) {
      el.addEventListener('copy', function (event) {
        //这里直接监听元素的粘贴事件
        binding.value(event)
      })
    },
  }
  