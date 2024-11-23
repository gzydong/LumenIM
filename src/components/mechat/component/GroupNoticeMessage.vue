<script lang="ts" setup>
defineProps<{
  title: string
  content: string
}>()
</script>

<template>
  <section class="immsg-group-notice">
    <h4>{{ title }}</h4>
    <p>{{ content }}</p>
  </section>
</template>

<style lang="less" scoped>
.immsg-group-notice {
  width: inherit;
  max-width: 300px;
  border-radius: 5px;
  padding: 10px;
  border: 1px solid var(--border-color);

  h4 {
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 10px;
  }

  p {
    font-size: 13px;
    margin: 10px 0;
  }
}

html[theme-mode='dark'] {
  .immsg-group-notice {
    border: unset;
    background: rgb(43 43 43);
  }
}
</style>
