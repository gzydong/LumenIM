<script setup>
import { ref } from 'vue'


</script>

<template>
  <div></div>
</template>

<style lang="less">
.mention {
  color: #428be5;
}
</style>
<style lang="less" scoped>
.me-editor {
  width: 500px;
  height: 300px;
  border: 1px solid red;
  margin: 200px auto;
  overflow: auto;
}
.mention {
  color: #428be5;
}

.me-editor[contenteditable]:empty:before {
  content: attr(placeholder);
  color: #cccccc;
}
.me-editor[contenteditable]:focus {
  content: none;
}
</style>
