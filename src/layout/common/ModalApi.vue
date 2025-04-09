<script lang="ts">
import { defineComponent } from 'vue'
import { useModal } from 'naive-ui'

export default defineComponent({
  setup() {
    window['$modal'] = useModal()
  },
  render() {
    return null
  }
})
</script>
