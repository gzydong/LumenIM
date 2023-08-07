<script setup>
import { ref, reactive } from 'vue'
import { NModal } from 'naive-ui'
import { Up, Down } from '@icon-park/vue-next'
import Loading from '@/components/base/Loading.vue'
import { ServeGetGroupNotices } from '@/api/group'

const emit = defineEmits(['close'])
const props = defineProps({
  groupId: {
    type: Number,
    default: 0,
  },
})

const isShow = ref(true)
const title = ref('群公告')

const state = reactive({
  loading: false,
  items: [],
})

const onMaskClick = () => {
  emit('close')
}

const onLoadData = () => {
  state.loading = true
  ServeGetGroupNotices({
    group_id: props.groupId,
  }).then(res => {
    if (res.code == 200) {
      let items = res.data.items || []

      items.forEach(item => {
        item.isShow = false
      })

      state.items = items
      title.value = `群公告(${state.items.length})`
    }

    state.loading = false
  })
}

onLoadData()
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    :title="title"
    :bordered="false"
    style="max-width: 500px"
    class="modal-radius o-hidden"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true,
    }"
    :header-style="{
      padding: '20px 15px',
    }"
    :content-style="{
      padding: 0,
    }"
  >
    <div v-if="state.loading" class="main-box flex-center">
      <Loading />
    </div>

    <div v-else-if="state.items.length === 0" class="main-box flex-center">
      <n-empty size="200" description="暂无相关数据">
        <template #icon>
          <img src="@/assets/image/no-data.svg" alt="" />
        </template>
      </n-empty>
    </div>

    <div v-else class="main-box me-scrollbar me-scrollbar-thumb">
      <div v-for="item in state.items" :key="item.id" class="items">
        <div class="title text-ellipsis">
          {{ item.title }}
        </div>

        <div class="describe">
          <n-avatar round :size="18" :src="item.avatar" />
          <span class="nickname text-ellipsis">{{ item.nickname }}</span>
          <span class="datetime">发表于 {{ item.created_at }}</span>
          <span class="btn" @click="item.isShow = !item.isShow">
            <n-icon :size="18" :component="item.isShow ? Up : Down" />
            {{ item.isShow ? '收起' : '展开' }}
          </span>
        </div>

        <div class="detail" v-show="item.isShow">
          {{ item.content }}
        </div>
      </div>
    </div>
  </n-modal>
</template>

<style lang="less" scoped>
.main-box {
  height: 500px;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  overflow-y: auto;

  .items {
    min-height: 80px;
    width: 100%;
    margin-bottom: 15px;
    border-bottom: 1px solid var(--border-color);

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
}
</style>
