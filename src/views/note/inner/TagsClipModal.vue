<script lang="ts" setup>
import { computed } from 'vue'
import { useNoteStore } from '@/store'
import { ServeUpdateArticleTag } from '@/api/article'
import { Close } from '@icon-park/vue-next'
import { useUtil } from '@/hooks/useUtil'

const { useMessage } = useUtil()
const store = useNoteStore()

let loading = false

interface TagItem {
  id: number
  tag_name: string
  is_check: boolean
}

const tags = computed((): TagItem[] => {
  let ids = store.view.detail.tags.map((item) => item.id)

  return store.tags.map((tag) => {
    return {
      id: tag.id,
      tag_name: tag.tag_name,
      is_check: ids.includes(tag.id)
    }
  })
})

const onSave = (ids: number[] = []) => {
  loading = true

  ServeUpdateArticleTag({
    article_id: store.view.detail.id,
    tags: ids
  })
    .then((res) => {
      if (res.code == 200) {
        store.view.detail.tags = ids.map((id) => {
          return { id }
        })
      }
    })
    .finally(() => {
      loading = false
    })
}

const onActive = (item: TagItem) => {
  if (loading) return

  let items = tags.value.filter((val) => {
    if (item.id === val.id) {
      return !val.is_check
    }

    return val.is_check
  })

  if (!item.is_check && items.length > 5) {
    return useMessage.info('标签不能超过5个')
  }

  onSave(items.map((v) => v.id))
}
</script>

<template>
  <section class="tag-box">
    <div class="header">
      <span>标签管理</span>
      <!-- <n-button text type="primary">添加标签</n-button> -->
    </div>

    <div class="tag-groups">
      <div class="title">已选择:</div>
      <p
        v-for="tag in tags"
        :key="tag.id"
        class="tag-item"
        v-show="tag.is_check"
        @click="onActive(tag)"
      >
        <span>{{ tag.tag_name }}</span>
        <span class="icon flex-center"> &nbsp;<n-icon :size="13" :component="Close" /> </span>
      </p>
    </div>

    <div class="tag-groups">
      <div class="title">标签栏:</div>
      <p
        v-for="tag in tags"
        :key="tag.id"
        class="tag-item"
        :class="{ active: tag.is_check }"
        @click="onActive(tag)"
      >
        <span>{{ tag.tag_name }}</span>
      </p>
    </div>
  </section>
</template>

<style lang="less" scoped>
.tag-box {
  width: 300px;
  padding: 15px;
  background-color: #ffffff;

  .header {
    height: 30px;
    font-weight: 500;
    font-size: 15px;
    line-height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .tag-groups {
    padding: 8px 8px 8px 0;
    cursor: pointer;

    .title {
      color: #7d7373;
      margin-bottom: 10px;
      border-bottom: 1px dashed #e0e0e0;
      padding-bottom: 5px;
    }

    .tag-item {
      display: inline-flex;
      align-items: center;
      height: 25px;
      line-height: 25px;
      padding: 0 5px;
      font-size: 12px;
      box-sizing: border-box;
      white-space: nowrap;
      margin: 3px;
      color: #409eff;
      background: rgba(64, 158, 255, 0.1);
      border-radius: 3px;

      &.active {
        border: 1px solid #70b5fb;
      }
    }
  }
}
</style>
