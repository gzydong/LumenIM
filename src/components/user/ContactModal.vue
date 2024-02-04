<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { NModal, NInput, NCheckbox, NTabs, NTab, NVirtualList } from 'naive-ui'
import { Search } from '@icon-park/vue-next'
import { ServeGetContacts } from '@/api/contact'
import { ServeGetGroups } from '@/api/group'
import { toApi } from '@/api'

const emit = defineEmits(['close', 'on-submit'])

interface Item {
  id: number
  type: number
  name: string
  avatar: string
  remark: string
  checked: boolean
  keyword: string
}

const tabsIndex = ref<number>(1)
const isShowBox = ref(true)
const loading = ref(true)
const items = ref<Item[]>([])
const keywords = ref('')
const loadGroupStatus = ref(false)

const searchFilter = computed(() => {
  return items.value.filter((item: Item) => {
    return tabsIndex.value == item.type && item.keyword.match(keywords.value) != null
  })
})

const checkedFilter = computed(() => {
  return items.value.filter((item: Item) => item.checked)
})

const isCanSubmit = computed(() => {
  return !checkedFilter.value.length
})

const onLoad = () => {
  onLoadContact()
}

const onLoadContact = async () => {
  const { code, data } = await toApi(ServeGetContacts, {}, { loading })

  if (code != 200) return

  items.value = (data.items || []).map((item: any) => {
    return {
      id: item.user_id,
      avatar: item.avatar,
      type: 1,
      name: item.nickname,
      keyword: item.remark + item.nickname,
      remark: item.remark,
      checked: false
    }
  })
}

const onLoadGroup = async () => {
  if (loadGroupStatus.value) return

  const { code, data } = await toApi(ServeGetGroups, {}, { loading })

  if (code != 200) return

  const list = data.items.map((item: any) => {
    return {
      id: item.group_id,
      avatar: item.avatar,
      type: 2,
      name: item.group_name,
      keyword: item.group_name,
      remark: '',
      checked: false
    }
  })

  items.value.push(...list)

  loadGroupStatus.value = true
}

const onMaskClick = () => {
  emit('close')
}

const onTriggerContact = (item: any) => {
  let data = items.value.find((val: any) => val.id === item.id)

  if (data) {
    data.checked = !data.checked
  }
}

const onSubmit = () => {
  let data = checkedFilter.value.map((item: any) => {
    return {
      id: item.id,
      type: item.type
    }
  })

  emit('on-submit', data)
}

const onTabs = (value: number) => {
  tabsIndex.value = value
  if (value == 2) {
    onLoadGroup()
  }
}

onMounted(() => {
  onLoad()
})
</script>

<template>
  <n-modal
    v-model:show="isShowBox"
    preset="card"
    title="选择目标"
    class="modal-radius"
    style="max-width: 350px; height: 550px"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true,
      footer: true
    }"
    :content-style="{
      padding: 0
    }"
  >
    <section class="el-container is-vertical launch-box">
      <header class="el-header search">
        <n-input placeholder="搜索" v-model:value="keywords" clearable>
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
      </header>

      <header class="el-header tabs" style="padding: 3px 15px">
        <n-tabs
          type="segment"
          size="small"
          animated
          justify-content="space-around"
          @update:value="onTabs"
        >
          <n-tab name="1"> 好友 </n-tab>
          <n-tab name="2"> 群聊 </n-tab>
        </n-tabs>
      </header>

      <main class="el-main main" v-loading="loading" loading-text="加载中...">
        <n-virtual-list style="max-height: inherit" :item-size="42" :items="searchFilter">
          <template #default="{ item }">
            <div
              :key="item.id"
              class="item-box pointer"
              style="height: 42px"
              @click="onTriggerContact(item)"
            >
              <div class="avatar">
                <im-avatar :src="item.avatar" :size="25" :username="item.remark || item.name" />
              </div>

              <div class="content">
                <span class="text-ellipsis">
                  {{ item.name }} {{ item.remark ? ` (${item.remark})` : '' }}
                </span>
              </div>

              <div class="checkbox">
                <n-checkbox size="small" :checked="item.checked" />
              </div>
            </div>
          </template>
        </n-virtual-list>
      </main>
    </section>

    <template #footer>
      <div class="footer">
        <div>
          <span>已选择({{ checkedFilter.length }})</span>
        </div>

        <div>
          <n-button @click="isShowBox = false"> 取消 </n-button>
          <n-button
            type="primary"
            text-color="#ffffff"
            class="mt-l15"
            @click="onSubmit"
            :disabled="isCanSubmit"
          >
            确定
          </n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
.launch-box {
  height: 410px;
  width: 100%;
  overflow: hidden;

  .search {
    height: 50px;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .main {
    padding-top: 10px;

    .item-box {
      height: 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      margin: 5px 0;
      padding: 0px 15px;

      > div {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .avatar {
        width: 30px;
        justify-content: flex-start;
      }

      .content {
        flex: 1 auto;
        padding-left: 8px;
        overflow: hidden;
        font-size: 14px;
        font-weight: 400;
        justify-content: flex-start;
        &:hover {
          color: #409eff;
        }
      }

      .checkbox {
        flex-shrink: 0;
        width: 30px;
        justify-content: flex-end;
      }
    }
  }
}

.badge {
  &.group {
    color: #3370ff !important;
    background-color: #e1eaff !important;
  }
  margin: 0 3px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
