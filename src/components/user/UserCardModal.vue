<script lang="ts" setup>
import {
  ServContactApplyCreate,
  ServContactDetail,
  ServContactEditRemark,
  ServContactGroupList,
  ServContactMoveGroup
} from '@/api/contact.ts'
import { ContactConst } from '@/constant/event-bus.ts'
import { useInject } from '@/hooks'
import { useTalkStore } from '@/store'
import { bus } from '@/utils'
import { formatPhone } from '@/utils/string'
import { CloseOne, Female, Male, SendOne } from '@icon-park/vue-next'

const { message } = useInject()
const router = useRouter()
const talkStore = useTalkStore()

const emit = defineEmits(['close'])

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
  relation: 1, // 关系 1陌生人 2好友 3企业同事 4本人
  contact_group_id: 0,
  contact_remark: ''
})

const genders = {
  0: '-',
  1: '男',
  2: '女',
  3: '未知'
}

const editCardPopover: any = ref(false)
const options = ref<any>([])
const groupName = computed(() => {
  const item = options.value.find((item: any) => {
    return item.key == userInfo.contact_group_id
  })

  return item?.label || '-'
})

const onLoadUser = async () => {
  const { code, data } = await ServContactDetail({ user_id: props.userId }, { loading })

  if (code != 200 || !data) return

  Object.assign(userInfo, {
    user_id: data.user_id,
    avatar: data.avatar,
    gender: data.gender,
    mobile: data.mobile,
    motto: data.motto,
    nickname: data.nickname,
    email: data.email,
    relation: data.relation,
    contact_group_id: data.contact_group_id,
    contact_remark: data.contact_remark
  })

  friendRemark.value = data.contact_remark
}

const onLoadUserGroup = async () => {
  const { code, data } = await ServContactGroupList()
  if (code != 200 || !data) return

  let items = data.items || []

  options.value = []
  for (const iter of items) {
    options.value.push({ label: iter.name, key: iter.id })
  }
}

const onToTalk = () => {
  talkStore.toTalk(1, props.userId, router)
  emit('close')
}

const onJoinContact = async () => {
  if (!applyRemark.value.length) {
    return message.info('备注信息不能为空')
  }

  await ServContactApplyCreate(
    {
      user_id: props.userId,
      remark: applyRemark.value
    },
    {
      successText: '申请发送成功',
      onSuccess: () => {
        isOpenFrom.value = false
      }
    }
  )
}

const onChangeRemark = async () => {
  const onSuccess = () => {
    editCardPopover.value.setShow(false)
    userInfo.contact_remark.remark = friendRemark.value

    const params = {
      user_id: props.userId,
      remark: friendRemark.value
    }

    talkStore.setRemark(params)
    bus.emit(ContactConst.UpdateRemark, params)
  }

  await ServContactEditRemark(
    {
      user_id: props.userId,
      remark: friendRemark.value
    },
    {
      successText: '备注修改成功',
      onSuccess
    }
  )
}

const handleSelectGroup = async (value: number) => {
  await ServContactMoveGroup(
    {
      user_id: props.userId,
      group_id: value
    },
    {
      successText: '分组修改成功',
      onSuccess: () => {
        userInfo.contact_group_id = value
      }
    }
  )
}

const onClose = () => {
  emit('close')
}

onLoadUser()
onLoadUserGroup()
</script>

<template>
  <div class="section">
    <section class="section el-container is-vertical h-full">
      <header class="el-header header">
        <im-avatar
          class="avatar"
          :size="60"
          :src="userInfo.avatar"
          :username="userInfo.contact_remark || userInfo.nickname"
          :font-size="30"
        />

        <div class="gender" v-show="userInfo.gender > 0">
          <n-icon v-if="userInfo.gender == 1" :component="Male" color="#ffffff" />
          <n-icon v-if="userInfo.gender == 2" :component="Female" color="#ffffff" />
        </div>

        <div class="close" @click="onClose">
          <close-one theme="outline" size="22" fill="#fff" :strokeWidth="2" />
        </div>

        <div class="nickname text-ellipsis">
          {{ userInfo.contact_remark || userInfo.nickname || '-' }}
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
            <span class="text">{{ formatPhone(userInfo.mobile) || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="name">昵称</span>
            <span class="text text-ellipsis">{{ userInfo.nickname || '-' }} </span>
          </div>
          <div class="info-item">
            <span class="name">性别</span>
            <span class="text">{{ genders[userInfo.gender] }}</span>
          </div>
          <div class="info-item" v-if="userInfo.relation === 2">
            <span class="name">备注</span>
            <n-popover trigger="click" placement="top-start" ref="editCardPopover">
              <template #trigger>
                <span class="text edit pointer text-ellipsis">
                  {{ userInfo.contact_remark || '-' }}&nbsp;&nbsp;
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
                <n-button type="primary" text-color="#ffffff" class="mt-l5" @click="onChangeRemark">
                  确定
                </n-button>
              </div>
            </n-popover>
          </div>
          <div class="info-item">
            <span class="name">邮箱</span>
            <span class="text">{{ userInfo.email || '-' }}</span>
          </div>
          <div class="info-item" v-if="userInfo.relation === 2">
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
        v-if="[2, 3].includes(userInfo.relation)"
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

      <footer v-else-if="userInfo.relation === 1" class="el-footer footer border-top flex-center">
        <template v-if="isOpenFrom">
          <n-input
            type="text"
            placeholder="请填写备注信息"
            v-model:value="applyRemark"
            @keydown.enter="onJoinContact"
          />

          <n-button
            type="primary"
            text-color="#ffffff"
            :disabled="!applyRemark.length"
            class="mt-l5"
            @click="onJoinContact"
          >
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
</template>

<style lang="less" scoped>
.section {
  position: relative;
  width: 330px;
  max-height: 540px;
  overflow: hidden;
  background-color: var(--im-bg-color);
  border-radius: 10px;

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
    max-height: 300px;
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
