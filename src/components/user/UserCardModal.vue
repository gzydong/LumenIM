<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { NIcon, NModal, NButton, NInput, NDropdown, NPopover } from 'naive-ui'
import { CloseOne, Male, Female, SendOne } from '@icon-park/vue-next'
import { toApi } from '@/api'
import {
  ServeSearchUser,
  ServeCreateContact,
  ServeContactGroupList,
  ServeContactMoveGroup,
  ServeEditContactRemark
} from '@/api/contact'
import { useTalkStore } from '@/store'
import { useRouter } from 'vue-router'
import { useInject } from '@/hooks'

const { message } = useInject()
const router = useRouter()
const talkStore = useTalkStore()

const model = defineModel({ default: false })
const emit = defineEmits(['update-remark'])

const props = defineProps({
  userId: {
    type: Number,
    default: 0
  },
  loginUserId: {
    type: Number,
    default: 0
  }
})

const loading = ref(true)
const isOpenFrom = ref(false)
const applyRemark = ref('')
const friendRemark = ref('')
const userInfo: any = reactive({
  user_id: 0,
  avatar: '',
  gender: 0,
  mobile: '',
  motto: '',
  nickname: '',
  email: '',
  friend_info: {
    group_id: 0,
    is_friend: 'Y',
    remark: ''
  }
})

const editCardPopover: any = ref(false)
const options = ref<any>([])
const groupName = computed(() => {
  const item = options.value.find((item: any) => {
    return item.key == userInfo.friend_info.group_id
  })

  return item?.label || '未设置分组'
})

const onLoadUser = async () => {
  const { code, data } = await toApi(ServeSearchUser, { user_id: props.userId }, { loading })

  if (code != 200) return

  Object.assign(userInfo, {
    user_id: data.user_id,
    avatar: data.avatar,
    gender: data.gender,
    mobile: data.mobile,
    motto: data.motto,
    nickname: data.nickname,
    email: data.email,
    friend_info: data.friend_info
  })

  friendRemark.value = data.friend_info.remark
}

const onLoadUserGroup = async () => {
  const { code, data } = await toApi(ServeContactGroupList)
  if (code != 200) return

  let items = data.items || []

  options.value = []
  for (const iter of items) {
    options.value.push({ label: iter.name, key: iter.id })
  }
}

const onToTalk = () => {
  talkStore.toTalk(1, props.userId, router)
  model.value = false
}

const onJoinContact = async () => {
  if (!applyRemark.value.length) {
    return message.info('备注信息不能为空')
  }

  await toApi(
    ServeCreateContact,
    {
      user_id: props.userId,
      remark: applyRemark.value
    },
    {
      showMessageText: '申请发送成功',
      onSuccess: () => {
        isOpenFrom.value = false
      }
    }
  )
}

const onChangeRemark = async () => {
  const onSuccess = () => {
    editCardPopover.value.setShow(false)
    userInfo.friend_info.remark = friendRemark.value

    emit('update-remark', {
      user_id: props.userId,
      remark: friendRemark.value
    })
  }

  await toApi(
    ServeEditContactRemark,
    {
      user_id: props.userId,
      remark: friendRemark.value
    },
    {
      showMessageText: '备注成功',
      onSuccess
    }
  )
}

const handleSelectGroup = async (value: Number) => {
  await toApi(
    ServeContactMoveGroup,
    {
      user_id: props.userId,
      group_id: value
    },
    {
      showMessageText: '分组修改成功',
      onSuccess: () => {
        userInfo.friend_info.group_id = value
      }
    }
  )
}

const reset = () => {
  loading.value = true

  Object.assign(userInfo, {
    user_id: 0,
    avatar: '',
    gender: 0,
    mobile: '',
    motto: '',
    nickname: '',
    email: '',
    friend_info: {
      group_id: 0,
      is_friend: 'Y',
      remark: ''
    }
  })

  isOpenFrom.value = false
}

const onUpdate = (value: boolean) => {
  if (!value) {
    setTimeout(reset, 100)
  }

  model.value = value
}

const onAfterEnter = () => {
  onLoadUser()
  onLoadUserGroup()
}
</script>

<template>
  <n-modal
    :show="model"
    transform-origin="mouse"
    :on-update:show="onUpdate"
    :on-after-enter="onAfterEnter"
  >
    <div class="section">
      <section class="section el-container is-vertical height100">
        <header class="el-header header">
          <im-avatar
            class="avatar"
            :size="60"
            :src="userInfo.avatar"
            :username="userInfo.friend_info.remark || userInfo.nickname"
            :font-size="30"
          />

          <div class="gender" v-show="userInfo.gender > 0">
            <n-icon v-if="userInfo.gender == 1" :component="Male" color="#ffffff" />
            <n-icon v-if="userInfo.gender == 2" :component="Female" color="#ffffff" />
          </div>

          <div class="close" @click="onUpdate(false)">
            <close-one theme="outline" size="22" fill="#fff" :strokeWidth="2" />
          </div>

          <div class="nickname text-ellipsis">
            {{ userInfo.friend_info.remark || userInfo.nickname || '--' }}
          </div>
        </header>

        <main class="el-main main me-scrollbar me-scrollbar-thumb">
          <div class="motto">
            <span style="font-weight: 600">个性签名：</span
            >{{ userInfo.motto || '编辑个签，展示我的独特态度。' }}
          </div>

          <div class="infos">
            <div class="info-item">
              <span class="name">手机</span>
              <span class="text">{{ userInfo.mobile }}</span>
            </div>
            <div class="info-item">
              <span class="name">昵称</span>
              <span class="text text-ellipsis">{{ userInfo.nickname || '-' }} </span>
            </div>
            <div class="info-item">
              <span class="name">性别</span>
              <span class="text">{{
                userInfo.gender == 1 ? '男' : userInfo.gender == 2 ? '女' : '未知'
              }}</span>
            </div>
            <div class="info-item" v-if="userInfo.friend_info.is_friend == 'Y'">
              <span class="name">备注</span>
              <n-popover trigger="click" placement="top-start" ref="editCardPopover">
                <template #trigger>
                  <span class="text edit pointer text-ellipsis">
                    {{ userInfo.friend_info.remark || '--' }}&nbsp;&nbsp;
                  </span>
                </template>

                <template #header> 设置备注 </template>

                <div style="display: flex">
                  <n-input
                    type="text"
                    placeholder="请填写备注"
                    :autofocus="true"
                    maxlength="10"
                    v-model:value="friendRemark"
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
              <span class="name">邮箱</span>
              <span class="text">{{ userInfo.email || '--' }}</span>
            </div>
            <div class="info-item" v-if="userInfo.friend_info.is_friend == 'Y'">
              <span class="name">分组</span>
              <n-dropdown
                trigger="click"
                placement="top-start"
                show-arrow
                :options
                @select="handleSelectGroup"
              >
                <span class="text edit pointer">{{ groupName }}</span>
              </n-dropdown>
            </div>
          </div>
        </main>

        <footer
          v-if="userInfo.friend_info.is_friend == 'Y'"
          class="el-footer footer border-top flex-center"
        >
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

        <footer v-else-if="userId != loginUserId" class="el-footer footer border-top flex-center">
          <template v-if="isOpenFrom">
            <n-input
              type="text"
              placeholder="请填写申请备注"
              v-model:value="applyRemark"
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
  width: 330px;
  height: 540px;
  border-radius: 10px;
  overflow: hidden;
  background-color: var(--im-bg-color);

  .header {
    width: 100%;
    height: 160px;
    align-items: center;
    justify-content: center;
    background: #0084ff;
    display: flex;
    padding: 20px;
    position: relative;
    overflow: hidden;

    &::before {
      width: 150px;
      height: 150px;
      content: '';
      background: linear-gradient(to right, #1890ff, #0084ff);
      position: absolute;
      z-index: 1;
      border-radius: 50%;
      right: -25%;
      top: -25%;
    }

    &::after {
      width: 150px;
      height: 150px;
      content: '';
      background: linear-gradient(to left, #1890ff, #0084ff);
      position: absolute;
      z-index: 1;
      border-radius: 50%;
      left: -25%;
      bottom: -20%;
    }

    .nickname {
      position: absolute;
      bottom: 12px;
      width: 80%;
      height: 30px;
      font-size: 15px;
      line-height: 30px;
      text-align: center;
      color: #ffffff;
      font-weight: 600;
    }

    .gender {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 125px;
      bottom: 45px;
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
    height: 300px;
    overflow-y: auto;

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
      -webkit-line-clamp: 2;
      position: relative;
      overflow: hidden;
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
      font-size: 14px;
    }

    .text {
      flex: 1 auto;
      margin-left: 5px;
      font-size: 13px;
    }
  }
}

html[theme-mode='dark'] {
  .section {
    .header {
      background: #2c2c32;

      &::before {
        background: rgb(254 254 254 / 4%) !important;
      }

      &::after {
        background: rgb(254 254 254 / 4%) !important;
      }
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
