<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue'
import { useDialog } from 'naive-ui'

export default defineComponent({
  setup() {
    const ctx = getCurrentInstance()
    if (ctx) {
      const dialog = useDialog()

      window['$dialog'] = dialog

      ctx.appContext.config.globalProperties.$dialog = dialog
    }
  },
  render() {
    return null
  }
})
</script>
