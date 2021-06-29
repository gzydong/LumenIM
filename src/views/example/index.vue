<template>
  <div class="messaege">
    <NotePreview />
  </div>
</template>

<script>
import NotePreview from '@/views/note/NotePreview'

export default {
  components: { NotePreview },
  data() {
    return {}
  },
  methods: {},
  created() {},
}
</script>
<style lang="less" scoped>
.messaege {
  height: 100vh;
  width: 800px;
  margin: 0 auto;
  border: 1px solid red;
}
</style>
