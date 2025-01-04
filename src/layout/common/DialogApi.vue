<script lang="ts">
import { defineComponent } from 'vue'
import { useDialog } from 'naive-ui'

export default defineComponent({
  setup() {
    window['$dialog'] = useDialog()
  },
  render() {
    return null
  }
})
</script>
