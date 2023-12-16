<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'
import { useNotification } from 'naive-ui'

export default defineComponent({
  setup() {
    const ctx = getCurrentInstance()
    if (ctx) {
      const notification = useNotification()

      window['$notification'] = notification

      ctx.appContext.config.globalProperties.$notification = notification
    }
  },
  render() {
    return null
  }
})
</script>
