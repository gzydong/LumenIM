<script lang="ts" setup>
import { ref, computed } from 'vue'
import { NModal, NInput, NScrollbar, NCheckbox, NTabs, NTab } from 'naive-ui'
import { Search, Delete } from '@icon-park/vue-next'
import { ServeGetContacts } from '@/api/contact'
import { ServeGetGroups } from '@/api/group'

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

const onLoadContact = () => {
  loading.value = true
  ServeGetContacts()
    .then((res) => {
      if (res.code == 200) {
        let list = res.data.items || []

        items.value = list.map((item: any) => {
          return {
            id: item.id,
            avatar: item.avatar,
            type: 1,
            name: item.remark || item.nickname,
            keyword: item.remark + item.nickname,
            remark: item.remark,
            checked: false
          }
        })
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const onLoadGroup = async () => {
  if (loadGroupStatus.value) {
    return
  }

  loading.value = true
  let { code, data } = await ServeGetGroups()
  if (code != 200) {
    return
  }

  let list = data.items.map((item: any) => {
    return {
      id: item.id,
      avatar: item.avatar,
      type: 2,
      name: item.group_name,
      keyword: item.group_name,
      remark: '',
      checked: false
    }
  })

  items.value.push(...list)

  loading.value = false
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

onLoad()
</script>

<template>
  <n-modal
    v-model:show="isShowBox"
    preset="card"
    title="选择联系人"
    class="modal-radius"
    style="max-width: 650px; height: 550px"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true,
      footer: true
    }"
    :content-style="{
      padding: 0
    }"
  >
    <section class="el-container launch-box">
      <aside class="el-aside bdr-r" style="width: 240px">
        <section class="el-container is-vertical height100">
          <header class="el-header tabs">
            <n-tabs type="line" justify-content="space-around" @update:value="onTabs">
              <n-tab name="1"> 好友 </n-tab>
              <n-tab name="2"> 群聊 </n-tab>
              <!-- <n-tab name="企业"> 企业 </n-tab> -->
            </n-tabs>
          </header>

          <header class="el-header sub-header">
            <n-input placeholder="搜索" v-model:value="keywords" clearable size="small">
              <template #prefix>
                <n-icon :component="Search" />
              </template>
            </n-input>
          </header>

          <main class="el-main" v-loading="loading" loading-text="加载中...">
            <n-scrollbar>
              <div class="friend-items">
                <div
                  class="friend-item pointer"
                  v-for="item in searchFilter"
                  :key="item.id"
                  @click="onTriggerContact(item)"
                >
                  <div class="avatar">
                    <im-avatar
                      class="pointer"
                      :src="item.avatar"
                      :size="25"
                      :username="item.remark || item.name"
                    />
                  </div>

                  <div class="content">
                    <span class="text-ellipsis">{{ item.remark || item.name }}</span>
                  </div>

                  <div class="checkbox">
                    <n-checkbox size="small" :checked="item.checked" />
                  </div>
                </div>
              </div>
            </n-scrollbar>
          </main>
        </section>
      </aside>

      <main class="el-main">
        <section class="el-container is-vertical height100">
          <main class="el-main o-hidden">
            <n-scrollbar class="friend-items">
              <div class="friend-items">
                <div v-show="!checkedFilter.length" style="padding-top: 100px">
                  <n-empty size="200" description="暂无数据">
                    <template #icon>
                      <img src="@/assets/image/no-data.svg" alt="" />
                    </template>
                  </n-empty>
                </div>

                <div
                  class="friend-item pointer"
                  v-for="item in checkedFilter"
                  :key="item.id"
                  @click="onTriggerContact(item)"
                >
                  <div class="avatar">
                    <im-avatar
                      class="pointer"
                      :src="item.avatar"
                      :size="25"
                      :username="item.remark || item.name"
                    />
                  </div>

                  <div class="content">
                    <span class="text-ellipsis">
                      {{ item.remark || item.name }}
                    </span>
                    <span v-if="item.type == 2" class="badge group">群</span>
                  </div>

                  <div class="checkbox">
                    <n-icon :size="16" :component="Delete" />
                  </div>
                </div>
              </div>
            </n-scrollbar>
          </main>
        </section>
      </main>
    </section>

    <template #footer>
      <div class="footer">
        <div>
          <span>已选择({{ checkedFilter.length }})</span>
        </div>

        <div>
          <n-button type="tertiary" @click="isShowBox = false"> 取消 </n-button>
          <n-button type="primary" class="mt-l15" @click="onSubmit" :disabled="isCanSubmit">
            确定
          </n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
:deep(.n-divider__title) {
  font-weight: unset;
}

.launch-box {
  height: 410px;
  width: 100%;
  overflow: hidden;

  .sub-header {
    height: 50px;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .friend-items {
    height: 100%;
    overflow-y: auto;
    padding: 0 15px;

    .friend-item {
      height: 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      margin: 5px 0;

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
