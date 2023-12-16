<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { NIcon, NModal, NButton, NInput, NDropdown, NPopover } from 'naive-ui'
import { CloseOne, Male, Female, SendOne } from '@icon-park/vue-next'
import { ServeSearchUser } from '@/api/contact'
import { ServeCreateContact } from '@/api/contact'
import { ServeContactGroupList, ServeContactMoveGroup, ServeEditContactRemark } from '@/api/contact'
import { useTalkStore } from '@/store'
import { useRouter } from 'vue-router'

const router = useRouter()
const talkStore = useTalkStore()

const emit = defineEmits(['update:show', 'update:uid', 'updateRemark'])

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  uid: {
    type: Number,
    default: 0
  }
})

const loading = ref(true)
const isOpenFrom = ref(false)
const state: any = reactive({
  id: 0,
  avatar: '',
  gender: 0,
  mobile: '',
  motto: '',
  nickname: '',
  remark: '',
  email: '',
  status: 1,
  text: ''
})

const editCardPopover: any = ref(false)
const modelRemark = ref('')

const options = ref<any>([])
const groupName = computed(() => {
  const item = options.value.find((item: any) => {
    return item.key == state.group_id
  })

  if (item) {
    return item.label
  }

  return '未设置分组'
})

const onLoadData = () => {
  ServeSearchUser({
    user_id: props.uid
  }).then(({ code, data }) => {
    if (code == 200) {
      Object.assign(state, data)

      modelRemark.value = state.remark

      loading.value = false
    } else {
      window['$message'].info('用户信息不存在', { showIcon: false })
    }
  })

  ServeContactGroupList().then((res) => {
    if (res.code == 200) {
      let items = res.data.items || []
      options.value = []
      for (const iter of items) {
        options.value.push({ label: iter.name, key: iter.id })
      }
    }
  })
}

const onToTalk = () => {
  talkStore.toTalk(1, props.uid, router)
  emit('update:show', false)
}

const onJoinContact = () => {
  if (!state.text.length) {
    return window['$message'].info('备注信息不能为空')
  }

  ServeCreateContact({
    friend_id: props.uid,
    remark: state.text
  }).then((res) => {
    if (res.code == 200) {
      isOpenFrom.value = false
      window['$message'].success('申请发送成功')
    } else {
      window['$message'].error(res.message)
    }
  })
}

const onChangeRemark = () => {
  ServeEditContactRemark({
    friend_id: props.uid,
    remark: modelRemark.value
  }).then(({ code, message }) => {
    if (code == 200) {
      editCardPopover.value.setShow(false)
      window['$message'].success('备注成功')
      state.remark = modelRemark.value

      emit('updateRemark', {
        user_id: props.uid,
        remark: modelRemark.value
      })
    } else {
      window['$message'].error(message)
    }
  })
}

const handleSelectGroup = (value) => {
  ServeContactMoveGroup({
    user_id: props.uid,
    group_id: value
  }).then(({ code, message }) => {
    if (code == 200) {
      state.group_id = value
      window['$message'].success('分组修改成功')
    } else {
      window['$message'].error(message)
    }
  })
}

const reset = () => {
  loading.value = true

  Object.assign(state, {
    id: 0,
    avatar: '',
    gender: 0,
    mobile: '',
    motto: '',
    nickname: '',
    remark: '',
    email: '',
    status: 1,
    text: ''
  })

  isOpenFrom.value = false
}

const onUpdate = (value) => {
  if (!value) {
    setTimeout(reset, 100)
  }

  emit('update:show', value)
}

const onAfterEnter = () => {
  onLoadData()
}
</script>

<template>
  <n-modal :show="show" :on-update:show="onUpdate" :on-after-enter="onAfterEnter">
    <div class="section" v-loading="loading">
      <section class="el-container container is-vertical">
        <header class="el-header header">
          <im-avatar
            class="avatar"
            :size="100"
            :src="state.avatar"
            :username="state.remark || state.nickname"
            :font-size="30"
          />

          <div class="gender" v-show="state.gender > 0">
            <n-icon v-if="state.gender == 1" :component="Male" color="#508afe" />
            <n-icon v-if="state.gender == 2" :component="Female" color="#ff5722" />
          </div>

          <div class="close" @click="onUpdate(false)">
            <close-one theme="outline" size="22" fill="#fff" :strokeWidth="2" />
          </div>

          <div class="nickname text-ellipsis">
            {{ state.remark || state.nickname || '未设置昵称' }}
          </div>
        </header>

        <main class="el-main main me-scrollbar me-scrollbar-thumb">
          <div class="motto">
            {{ state.motto || '编辑个签，展示我的独特态度。' }}
          </div>

          <div class="infos">
            <div class="info-item">
              <span class="name">手机 :</span>
              <span class="text">{{ state.mobile }}</span>
            </div>
            <div class="info-item">
              <span class="name">昵称 :</span>
              <span class="text text-ellipsis">{{ state.nickname || '-' }} </span>
            </div>
            <div class="info-item">
              <span class="name">性别 :</span>
              <span class="text">{{
                state.gender == 1 ? '男' : state.gender == 2 ? '女' : '未知'
              }}</span>
            </div>
            <div class="info-item" v-if="state.friend_status == 2">
              <span class="name">备注 :</span>
              <n-popover trigger="click" placement="top-start" ref="editCardPopover">
                <template #trigger>
                  <span class="text edit pointer text-ellipsis">
                    {{ state.remark || '未设置' }}&nbsp;&nbsp;
                  </span>
                </template>

                <template #header> 设置备注 </template>

                <div style="display: flex">
                  <n-input
                    type="text"
                    placeholder="请填写备注"
                    :autofocus="true"
                    maxlength="10"
                    v-model:value="modelRemark"
                    @keydown.enter="onChangeRemark"
                  />
                  <n-button
                    type="primary"
                    text-color="#ffffff"
                    class="mt-l5"
                    @click="onChangeRemark"
                  >
                    确定
                  </n-button>
                </div>
              </n-popover>
            </div>
            <div class="info-item">
              <span class="name">邮箱 :</span>
              <span class="text">{{ state.email || '-' }}</span>
            </div>
            <div class="info-item" v-if="state.friend_status == 2">
              <span class="name">分组 :</span>
              <n-dropdown
                trigger="click"
                placement="top-start"
                :show-arrow="true"
                :options="options"
                @select="handleSelectGroup"
              >
                <span class="text edit pointer">{{ groupName }}</span>
              </n-dropdown>
            </div>
          </div>
        </main>

        <footer v-if="state.friend_status == 2" class="el-footer footer bdr-t flex-center">
          <n-button
            round
            block
            type="primary"
            text-color="#ffffff"
            @click="onToTalk"
            style="width: 91%"
          >
            <template #icon>
              <n-icon :component="SendOne" />
            </template>
            发送消息
          </n-button>
        </footer>

        <footer v-else-if="state.friend_status == 1" class="el-footer footer bdr-t flex-center">
          <template v-if="isOpenFrom">
            <n-input
              type="text"
              placeholder="请填写申请备注"
              v-model:value="state.text"
              @keydown.enter="onJoinContact"
            />

            <n-button type="primary" text-color="#ffffff" class="mt-l5" @click="onJoinContact">
              确定
            </n-button>
          </template>
          <template v-else>
            <n-button
              type="primary"
              text-color="#ffffff"
              block
              round
              style="width: 91%"
              @click="isOpenFrom = true"
            >
              添加好友
            </n-button>
          </template>
        </footer>
      </section>
    </div>
  </n-modal>
</template>

<style lang="less" scoped>
.section {
  position: relative;
  width: 360px;
  height: 600px;
  border-radius: 10px;
  overflow: hidden;
  background-color: var(--im-bg-color);

  .header {
    width: 100%;
    height: 230px;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, rgb(137, 104, 255), rgb(175, 152, 255));
    display: flex;
    padding: 20px;
    position: relative;
    overflow: hidden;

    &::before {
      width: 150px;
      height: 150px;
      content: '';
      background: linear-gradient(to right, rgb(142, 110, 255), rgb(208, 195, 255));
      position: absolute;
      z-index: 1;
      border-radius: 50%;
      right: -25%;
      top: -25%;
    }

    .nickname {
      position: absolute;
      bottom: 20px;
      width: 80%;
      height: 30px;
      font-size: 16px;
      line-height: 30px;
      text-align: center;
      color: #ffffff;
    }

    .gender {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 122px;
      bottom: 65px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .close {
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 1;
      &:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }
  }

  .main {
    padding: 20px 30px;
    max-height: 300px;
    .motto {
      min-height: 26px;
      border-radius: 5px;
      padding: 5px 8px;
      line-height: 25px;
      background: #f3f5f7;
      color: var(--im-text-color);
      font-size: 12px;
      margin-bottom: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      position: relative;
    }
  }

  .footer {
    height: 60px;
    padding: 0 15px;
  }
}

.infos {
  .info-item {
    height: 30px;
    width: 100%;
    margin: 3px 0;
    display: flex;
    align-items: center;

    .name {
      width: 45px;
      flex-shrink: 0;
      color: #625f5f;
    }

    .text {
      flex: 1 auto;
      margin-left: 5px;
    }

    .edit {
      text-decoration: underline;
      text-decoration-style: solid;
      text-underline-offset: 3px;
    }
  }
}

html[theme-mode='dark'] {
  .section {
    .header {
      background: #2c2c32;
    }

    .motto {
      background-color: rgb(44, 44, 50);
    }
  }

  .infos {
    .info-item {
      .name {
        color: #afabab;
      }
    }
  }
}
</style>
