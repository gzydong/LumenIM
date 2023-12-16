<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Up, Down, Close } from '@icon-park/vue-next'
import Loading from '@/components/base/Loading.vue'
import { ServeGetGroupNotices } from '@/api/group'

const emit = defineEmits(['close'])
const props = defineProps({
  groupId: {
    type: Number,
    default: 0
  }
})

const title = ref('群公告')
const loading = ref(false)
const items = ref<any[]>([])

const onClose = () => {
  emit('close')
}

const onLoadData = () => {
  loading.value = true
  ServeGetGroupNotices({
    group_id: props.groupId
  }).then((res) => {
    if (res.code == 200) {
      let list = res.data.items || []

      list.forEach((item: any) => {
        item.is_show = false
      })

      items.value = list
      title.value = `群公告(${items.value.length})`
    }

    loading.value = false
  })
}

onMounted(() => {
  onLoadData()
})
</script>

<template>
  <section class="el-container is-vertical">
    <header class="el-header bdr-b">
      <div class="center-text">
        <span>{{ title }}</span>
      </div>

      <div class="right-icon">
        <n-icon size="21" :component="Close" @click="onClose" />
      </div>
    </header>

    <main class="el-main me-scrollbar me-scrollbar-thumb">
      <div v-if="loading" class="flex-box flex-center">
        <Loading />
      </div>

      <div v-else-if="items.length === 0" class="flex-box flex-center">
        <n-empty size="200" description="暂无相关数据">
          <template #icon>
            <img src="@/assets/image/no-data.svg" alt="" />
          </template>
        </n-empty>
      </div>

      <div v-for="item in items" :key="item.id" class="items">
        <div class="title text-ellipsis">
          {{ item.title }}
        </div>

        <div class="describe">
          <n-avatar round :size="15" :src="item.avatar" />
          <span class="nickname text-ellipsis">{{ item.nickname }}</span>
          <span class="datetime">发表于 {{ item.created_at }}</span>
          <span class="btn" @click="item.is_show = !item.is_show">
            <n-icon :size="18" :component="item.is_show ? Up : Down" />
            {{ item.is_show ? '收起' : '展开' }}
          </span>
        </div>

        <div class="detail" v-show="item.is_show">
          {{ item.content }}
        </div>
      </div>
    </main>
  </section>
</template>

<style lang="less" scoped>
.el-header {
  width: 100%;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 15px;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .center-text {
    flex: auto;
    font-weight: 500;
    font-size: 16px;
    justify-content: flex-start;
  }

  .left-icon,
  .right-icon {
    width: 50px;
    height: 100%;
    flex-shrink: 0;
    cursor: pointer;
  }
}

.el-main {
  padding: 0 15px;

  .flex-box {
    height: 100%;
  }
}

.items {
  width: 100%;
  border-bottom: 1px solid var(--border-color);
  box-sizing: border-box;
  margin: 10px 0;

  .title {
    height: 30px;
    line-height: 30px;
    font-size: 15px;
  }

  .describe {
    height: 30px;
    line-height: 30px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    position: relative;

    .datetime {
      margin-left: 10px;
      font-size: 12px;
      color: #a59696;
      font-weight: 300;
    }

    .btn {
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      font-size: 13px;
    }
  }

  .detail {
    min-height: 30px;
    width: 100%;
    margin: 15px 0;
    font-size: 13px;

    span {
      color: #887f7f;
    }
  }
}
</style>
