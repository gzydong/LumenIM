<script lang="ts" setup>
import { ref, computed, h, onMounted } from 'vue'
import { NSpace, NInput } from 'naive-ui'
import { Search, CheckSmall, Close, Redo } from '@icon-park/vue-next'
import { ServeGetGroupApplyList, ServeDeleteGroupApply, ServeAgreeGroupApply } from '@/api/group'
import { throttle } from '@/utils/common'
import { useInject } from '@/hooks'

interface Item {
  id: number
  user_id: number
  group_id: number
  avatar: string
  nickname: string
  remark: string
  created_at: string
}

const emit = defineEmits(['close'])

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const keywords = ref('')
const batchDelete = ref(false)
const items = ref<Item[]>([])
const { showUserInfoModal } = useInject()

const filterSearch = computed(() => {
  if (!keywords.value.length) {
    return items.value
  }

  return items.value.filter((item) => {
    return item.nickname.match(keywords.value) != null
  })
})

const onLoadData = () => {
  ServeGetGroupApplyList({
    group_id: props.id
  }).then((res) => {
    if (res.code == 200) {
      let data = res.data.items || []
      items.value = data
    }
  })
}

const onUserInfo = (item: Item) => {
  showUserInfoModal(item.user_id)
}

const onRowClick = (item: Item) => {
  if (batchDelete.value == true) {
    console.log(item)
  }
}

const onAgree = throttle((item: Item) => {
  let loading = window['$message'].loading('请稍等，正在处理')

  ServeAgreeGroupApply({
    apply_id: item.id
  }).then((res) => {
    loading.destroy()
    if (res.code == 200) {
      window['$message'].success('已同意')
    } else {
      window['$message'].info(res.message)
    }

    onLoadData()
  })
}, 1000)

const onDelete = (item: Item) => {
  let remark = ''
  let dialog = window['$dialog'].create({
    title: '拒绝入群申请',
    content: () => {
      return h(NInput, {
        defaultValue: '',
        placeholder: '请填写拒绝原因',
        style: { marginTop: '20px' },
        onInput: (value) => (remark = value),
        autofocus: true
      })
    },
    negativeText: '取消',
    positiveText: '提交',
    onPositiveClick: () => {
      if (!remark.length) return false

      dialog.loading = true

      ServeDeleteGroupApply({
        apply_id: item.id,
        remark: remark
      }).then((res) => {
        dialog.destroy()

        if (res.code == 200) {
          window['$message'].success('已拒绝')
        } else {
          window['$message'].info(res.message)
        }

        onLoadData()
      })

      return false
    }
  })
}

onMounted(() => {
  onLoadData()
})
</script>
<template>
  <section class="section el-container is-vertical height100">
    <header class="el-header header bdr-b">
      <p>申请管理({{ filterSearch.length }})</p>
      <div>
        <n-space>
          <n-input
            placeholder="搜索"
            v-model:value.trim="keywords"
            clearable
            style="width: 200px"
            round
          >
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>

          <n-button circle @click="onLoadData">
            <template #icon> <n-icon :component="Redo" /> </template>
          </n-button>
        </n-space>
      </div>
    </header>

    <main v-if="filterSearch.length === 0" class="el-main main flex-center">
      <n-empty size="200" description="暂无相关数据">
        <template #icon>
          <img src="@/assets/image/no-data.svg" alt="" />
        </template>
      </n-empty>
    </main>

    <main v-else class="el-main main me-scrollbar me-scrollbar-thumb">
      <div
        class="member-item"
        v-for="item in filterSearch"
        :key="item.id"
        @click="onRowClick(item)"
      >
        <div class="avatar pointer" @click="onUserInfo(item)">
          <im-avatar :size="40" :src="item.avatar" :username="item.nickname" />
        </div>
        <div class="content pointer o-hidden">
          <div class="item-title">
            <p class="nickname text-ellipsis">
              <span>{{ item.nickname }}</span>
              <span class="date mt-l15">{{ item.created_at }}</span>
            </p>
          </div>
          <div class="item-text text-ellipsis">备注: {{ item.remark }}</div>
        </div>

        <div class="tool flex-center">
          <n-space>
            <n-button @click="onAgree(item)" strong secondary circle type="primary" size="small">
              <template #icon>
                <n-icon :component="CheckSmall" />
              </template>
            </n-button>

            <n-button @click="onDelete(item)" strong secondary circle type="tertiary" size="small">
              <template #icon>
                <n-icon :component="Close" />
              </template>
            </n-button>
          </n-space>
        </div>
      </div>
    </main>
  </section>
</template>
<style lang="less" scoped>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.main {
  padding: 0 5px;
  box-sizing: border-box;
}

.member-item {
  height: 58px;
  display: flex;
  align-items: center;
  margin: 8px;
  user-select: none;
  border-radius: 3px;
  border-bottom: 1px solid var(--border-color);
  box-sizing: content-box;

  > div {
    height: inherit;
  }

  .avatar {
    width: 40px;
    flex-shrink: 0;
    user-select: none;
    display: flex;
    padding-top: 8px;
  }

  .content {
    width: 100%;
    margin-left: 10px;

    .item-title {
      height: 28px;
      width: inherit;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 400;

      .nickname {
        margin-right: 5px;
      }
    }

    .item-text {
      width: inherit;
      height: 20px;
      color: rgb(255 255 255 / 52%);
      font-size: 12px;
    }
  }

  .tool {
    width: 100px;
    height: inherit;
    flex-shrink: 0;
    margin-left: 15px;
  }
}

.footer {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background-color: #fdf9f9;
  border-bottom-right-radius: 15px;

  .tips {
    font-size: 16px;
  }
}
</style>
