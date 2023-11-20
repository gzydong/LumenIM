<script>
import { defineComponent, h, ref, onUnmounted, watch } from 'vue'
import { beautifyTime } from '@/utils/datetime'

// 时间组件
export default defineComponent({
  name: 'Xtime',
  props: {
    time: {
      type: String,
      default: '2022-03-06 21:20:00'
    }
  },
  setup(props) {
    let timeout = null

    const inTime = new Date(props.time.replace(/-/g, '/')).getTime()

    const text = ref('')

    const format = () => {
      clearTimeout(timeout)

      text.value = beautifyTime(props.time)
      if (new Date().getTime() - inTime < 30 * 60 * 1000) {
        timeout = setTimeout(format, 60 * 1000)
      }
    }

    watch(props, format)

    onUnmounted(() => {
      clearTimeout(timeout)
    })

    format()

    return () => h('span', [text.value])
  }
})
</script>
