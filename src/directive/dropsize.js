import { storage } from '@/utils/storage'

function getCacheKey(key, direction) {
  if (!key.length) return ''

  return `dropsize_${direction}_${key}`
}

export default {
  mounted: function (el, binding) {
    let { min, max, direction = 'right', key = '' } = binding.value

    el.style.position = 'relative'
    el.touch = { status: false, pageX: 0, pageY: 0, width: 0, height: 0 }

    const cacheKey = getCacheKey(key, direction)
    const cursor = ['left', 'right'].includes(direction) ? 'col-resize' : 'row-resize'

    const linedom = document.createElement('div')
    linedom.className = `dropsize-line dropsize-line-${direction}`

    el.linedomMouseup = function () {
      if (!el.touch.status) return

      el.touch.status = false

      linedom.classList.remove('dropsize-resizing')

      document.querySelector('body').classList.remove(`dropsize-${cursor}`)
    }

    el.linedomMousemove = function (e) {
      if (!el.touch.status) return

      let width,
        height = 0
      switch (direction) {
        case 'left':
        case 'right':
          if (direction == 'left') {
            width = el.touch.width + el.touch.pageX - e.pageX
          } else {
            width = el.touch.width + e.pageX - el.touch.pageX
          }

          if (width < min) width = min
          if (width > max) width = max

          el.style.width = `${width}px`

          cacheKey && storage.set(cacheKey, width)
          break
        case 'top':
        case 'bottom':
          if (direction == 'top') {
            height = el.touch.height + el.touch.pageY - e.pageY
          } else {
            height = el.touch.height + e.pageY - el.touch.pageY
          }

          if (height < min) height = min
          if (height > max) height = max

          el.style.height = `${height}px`

          cacheKey && storage.set(cacheKey, height)
          break
      }
    }

    linedom.addEventListener('mousedown', function (e) {
      el.touch = {
        status: true,
        pageX: e.pageX,
        pageY: e.pageY,
        width: el.offsetWidth,
        height: el.offsetHeight
      }

      this.classList.add('dropsize-resizing')

      document.querySelector('body').classList.add(`dropsize-${cursor}`)

      document.addEventListener('mouseup', el.linedomMouseup)
      document.addEventListener('mousemove', el.linedomMousemove)
    })

    if (cacheKey) {
      const value = storage.get(cacheKey)

      if (direction == 'left' || direction == 'right') {
        el.style.width = `${value}px`
      } else {
        el.style.height = `${value}px`
      }
    }

    el.appendChild(linedom)
  },
  unmounted: function (el) {
    document.removeEventListener('mousemove', el.linedomMouseup)
    document.removeEventListener('mouseup', el.linedomMousemove)
  }
}
