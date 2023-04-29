<script setup>
import { ref, reactive, computed } from 'vue'
import {
  NModal,
  NInput,
  NScrollbar,
  NCheckbox,
  NDivider,
  NDropdown,
} from 'naive-ui'
import { Search, DeleteMode, SettingConfig } from '@icon-park/vue-next'

import { defAvatar } from '@/constant/default.js'
import { ServeGetContacts } from '@/api/contacts'

const emit = defineEmits(['close', 'on-submit'])
const props = defineProps({})

const isShowBox = ref(true)
const items = ref([])
const keywords = ref('')
const options = reactive([
  {
    label: '好友',
    key: 'friend',
  },
  {
    label: '群组',
    key: 'group',
  },
  {
    label: '组织',
    key: 'qiye',
  },
])

const searchFilter = computed(() => {
  return items.value.filter(item => {
    return item.nickname.match(keywords.value) != null
  })
})

const checkedFilter = computed(() => {
  return items.value.filter(item => item.checked)
})

const isCanSubmit = computed(() => {
  return !checkedFilter.value.length
})

const onLoad = () => {
  ServeGetContacts().then(res => {
    if (res.code == 200 && res.data) {
      let list = res.data.items || []

      items.value = list.map(item => {
        return Object.assign(item, {
          id: item.id,
          type: 1,
          index_name: `1_${item.id}`,
          nickname: item.friend_remark || item.nickname,
          checked: false,
        })
      })
    }
  })
}

const onMaskClick = () => {
  emit('close')
}

const onTriggerContact = item => {
  let data = items.value.find(val => val.id === item.id)

  if (data) {
    data.checked = !data.checked
  }
}

const onSubmit = () => {
  let data = checkedFilter.value.map(item => {
    return {
      id: item.id,
      type: item.type,
    }
  })

  emit('on-submit', data)
}

onLoad()
</script>

<template>
  <n-modal
    v-model:show="isShowBox"
    preset="card"
    title="选择联系人"
    style="max-width: 650px; height: 550px; border-radius: 10px"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true,
      footer: true,
    }"
    :content-style="{
      padding: 0,
    }"
  >
    <section class="el-container launch-box">
      <aside class="el-aside bdr-r" style="width: 280px">
        <section class="el-container is-vertical height100">
          <header class="el-header sub-header">
            <n-dropdown
              trigger="hover"
              :options="options"
              placement="bottom-start"
            >
              <n-icon :size="26" class="pointer" :component="SettingConfig" />
            </n-dropdown>

            <n-input
              placeholder="搜索好友"
              v-model:value="keywords"
              clearable
              style="width: 222px"
              size="small"
            >
              <template #prefix>
                <n-icon :component="Search" />
              </template>
            </n-input>
          </header>

          <main class="el-main o-hidden">
            <n-scrollbar>
              <div class="friend-items">
                <div
                  class="friend-item pointer"
                  v-for="item in searchFilter"
                  @click="onTriggerContact(item)"
                >
                  <div class="avatar">
                    <n-avatar
                      :size="25"
                      :src="item.avatar"
                      :fallback-src="defAvatar"
                    />
                  </div>

                  <div class="content">
                    <span class="text-ellipsis">{{
                      item.remark || item.nickname
                    }}</span>
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
          <header class="el-header" style="height: 50px">
            <n-divider
              title-placement="left"
              style="margin-top: 15px; margin-bottom: 0; font-weight: 300"
            >
              已选择({{ checkedFilter.length }})
            </n-divider>
          </header>

          <main class="el-main o-hidden">
            <n-scrollbar>
              <div class="friend-items">
                <div
                  class="friend-item pointer"
                  v-for="item in checkedFilter"
                  @click="onTriggerContact(item)"
                >
                  <div class="avatar">
                    <n-avatar
                      :size="25"
                      :src="item.avatar"
                      :fallback-src="defAvatar"
                    />
                  </div>

                  <div class="content">
                    <span class="text-ellipsis">{{ item.nickname }}</span>
                  </div>
                  <div class="checkbox">
                    <n-icon :size="16" color="red" :component="DeleteMode" />
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
        <n-button type="tertiary" @click="isShowBox = false"> 取消 </n-button>
        <n-button
          type="primary"
          class="mt-l15"
          @click="onSubmit"
          :disabled="isCanSubmit"
        >
          确定
        </n-button>
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
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .friend-items {
    height: 100%;
    overflow-y: auto;
    padding: 0 10px;

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

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
