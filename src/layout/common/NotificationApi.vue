<script lang="ts">
import { defineComponent } from 'vue'
import { useNotification } from 'naive-ui'

export default defineComponent({
  setup() {
    window['$notification'] = useNotification()
  },
  render() {
    return null
  }
})
</script>
