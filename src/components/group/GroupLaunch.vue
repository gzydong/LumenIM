<script setup>
import { ref, reactive, computed } from 'vue'
import { NModal, NInput, NScrollbar, NDivider, NCheckbox } from 'naive-ui'
import { Search, DeleteMode } from '@icon-park/vue-next'
import { defAvatar } from '@/constant/default.js'
import {
  ServeCreateGroup,
  ServeInviteGroup,
  ServeGetInviteFriends,
} from '@/api/group'

const emit = defineEmits(['close', 'on-submit'])
const props = defineProps({
  gid: {
    type: Number,
    default: 0,
  },
})

const items = ref([])
const model = reactive({
  keywords: '',
  name: '',
})

const isShowBox = ref(true)

const searchFilter = computed(() => {
  if (model.keywords) {
    return items.value.filter(item => {
      return item.nickname.match(model.keywords) != null
    })
  }

  return items.value
})

const checkedFilter = computed(() => {
  return items.value.filter(item => item.checked)
})

const isCanSubmit = computed(() => {
  if (props.gid > 0) {
    return !checkedFilter.value.length
  }

  return !(model.name.trim() && checkedFilter.value.length)
})

const onReset = () => {
  model.name = ''
  items.value.forEach(item => {
    item.checked = false
  })
}

const onLoad = () => {
  ServeGetInviteFriends({
    group_id: props.gid,
  }).then(res => {
    if (res.code == 200 && res.data) {
      let list = res.data || []

      items.value = list.map(item => {
        return Object.assign(item, {
          nickname: item.friend_remark ? item.friend_remark : item.nickname,
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
  let data = items.value.find(val => {
    return val.id === item.id
  })

  data && (data.checked = !data.checked)
}

const onCreateSubmit = ids => {
  ServeCreateGroup({
    avatar: '',
    name: model.name,
    profile: '',
    ids: ids.join(','),
  }).then(res => {
    if (res.code == 200) {
      onReset()
      emit('on-submit', res.data)
      window['$message'].success('创建成功！')
      isShowBox.value = false
    }
  })
}

const onInviteSubmit = ids => {
  ServeInviteGroup({
    group_id: props.gid,
    ids: ids.join(','),
  }).then(res => {
    if (res.code == 200) {
      emit('on-invite')
      window['$message'].success('邀请成功！')
      isShowBox.value = false
    }
  })
}

const onSubmit = () => {
  let ids = checkedFilter.value.map(item => item.id)

  if (props.gid == 0) {
    onCreateSubmit(ids)
  } else {
    onInviteSubmit(ids)
  }
}

onLoad()
</script>

<template>
  <n-modal
    v-model:show="isShowBox"
    preset="card"
    :title="gid == 0 ? '创建群组' : '请选择需要邀请的好友'"
    style="max-width: 650px; height: 550px; border-radius: 10px"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true,
      footer: true,
    }"
    :content-style="{
      padding: 0,
    }"
    transform-origin="center"
  >
    <section class="el-container launch-box">
      <aside class="el-aside bdr-r" style="width: 280px">
        <section class="el-container is-vertical height100">
          <header class="el-header" style="height: 50px; padding: 10px">
            <n-input
              placeholder="搜索好友"
              v-model:value="model.keywords"
              clearable
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
                    <span class="text-ellipsis">{{ item.nickname }}</span>
                  </div>

                  <div class="checkbox">
                    <n-checkbox
                      size="small"
                      :checked="item.checked"
                      @update:checked="item.checked = !item.checked"
                    />
                  </div>
                </div>
              </div>
            </n-scrollbar>
          </main>
        </section>
      </aside>

      <main class="el-main">
        <section class="el-container is-vertical height100">
          <header
            v-if="props.gid === 0"
            class="el-header"
            style="height: 90px; padding: 10px"
          >
            <p style="margin: 8px 0px 10px; font-weight: 500">群名称(必填)：</p>
            <n-input
              v-model:value="model.name"
              placeholder="请填写群名称"
              maxlength="20"
              show-count
            />
          </header>

          <header class="el-header" style="height: 50px">
            <n-divider
              title-placement="left"
              style="margin-top: 15px; margin-bottom: 0; font-weight: 300"
            >
              邀请成员({{ checkedFilter.length }})
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
          提交
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
