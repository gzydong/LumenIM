<script lang="ts" setup>
interface Props {
  editor?: boolean
  aside?: boolean
  asideWidth?: number
}

const { editor = true, aside = false, asideWidth = 300 } = defineProps<Props>()
</script>

<template>
  <section class="el-container is-vertical">
    <header class="el-header border-bottom" style="height: 60px">
      <slot name="header"></slot>
    </header>

    <section class="el-container" style="height: 100%; overflow: hidden">
      <main class="el-main">
        <section class="el-container is-vertical" style="height: 100%">
          <main class="el-main">
            <slot name="main"></slot>
          </main>

          <footer
            v-if="editor"
            class="el-footer border-top"
            :style="{ height: 200 + 'px' }"
            v-dropsize="{ min: 100, max: 600, direction: 'top', key: 'editor' }"
          >
            <slot name="editor"></slot>
          </footer>
        </section>
      </main>

      <aside v-if="aside" class="el-aside border-left" :style="{ width: asideWidth + 'px' }">
        <slot name="aside"></slot>
      </aside>
    </section>
  </section>
</template>

<style scoped lang="less"></style>
