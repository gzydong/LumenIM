<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'
import { useMessage } from 'naive-ui'

export default defineComponent({
  setup() {
    const ctx = getCurrentInstance()
    if (ctx) {
      const message = useMessage()
      window['$message'] = message

      ctx.appContext.config.globalProperties.$message = message
    }
  },
  render() {
    return null
  }
})
</script>
