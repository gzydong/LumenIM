<script setup>
import { ref, reactive, computed } from 'vue'
import { NIcon, NModal, NButton, NInput, NAvatar, NDropdown } from 'naive-ui'
import { PaperPlaneOutline, Add, CloseCircleSharp } from '@vicons/ionicons5'
import { ServeSearchUser } from '@/api/contacts'
import { toTalk } from '@/utils/talk'
import { ServeCreateContact } from '@/api/contacts'
import { defAvatar } from '@/constant/default'
import { ServeContactGroupList, ServeContactMoveGroup } from '@/api/contacts'

const props = defineProps({
  uid: {
    type: Number,
    default: 0,
  },
  remove: {
    type: Function,
    default: () => {},
  },
})

const isOpenFrom = ref(false)
const showModal = ref(false)
const state = reactive({
  id: 0,
  avatar: '',
  gender: 0,
  mobile: '',
  motto: '',
  nickname: '',
  remark: '',
  email: '',
  status: 1,
  text: '',
})

const options = reactive([])
const groupName = computed(() => {
  const item = options.find(item => {
    return item.key == state.group_id
  })

  if (item) {
    return item.label
  }

  return '未设置分组'
})

const onLoadData = () => {
  ServeSearchUser({
    user_id: props.uid,
  }).then(({ code, data }) => {
    if (code == 200) {
      state.avatar = data.avatar
      state.nickname = data.nickname
      state.mobile = data.mobile
      state.motto = data.motto
      state.gender = data.gender
      state.remark = data.nickname_remark
      state.email = data.email || ''
      state.status = data.friend_status
      state.group_id = data.group_id
      showModal.value = true
    } else {
      window.$message.info('用户信息不存在！', { showIcon: false })
    }
  })

  ServeContactGroupList().then(res => {
    if (res.code == 200) {
      let items = res.data.items || []
      for (const iter of items) {
        options.push({ label: iter.name, key: iter.id })
      }
    }
  })
}

const onToTalk = () => {
  toTalk(1, props.uid)
  props.remove()
}

const onJoinContact = () => {
  if (!state.text.length) {
    return window.$message.info('备注信息不能为空！')
  }

  ServeCreateContact({
    friend_id: props.uid,
    remark: state.text,
  }).then(res => {
    if (res.code == 200) {
      isOpenFrom.value = false
      window.$message.success('申请发送成功！')
    } else {
      window.$message.error(res.message)
    }
  })
}

const handleSelectGroup = value => {
  ServeContactMoveGroup({
    user_id: props.uid,
    group_id: value,
  }).then(({ code, message }) => {
    if (code == 200) {
      state.group_id = value
      $message.success('分组修改成功！')
    } else {
      $message.error(message)
    }
  })
}

onLoadData()
</script>

<template>
  <n-modal
    v-model:show="showModal"
    :on-mask-click="
      () => {
        props.remove()
      }
    "
    transform-origin="center"
  >
    <div class="section">
      <section class="el-container container is-vertical height100">
        <header class="el-header header">
          <div class="img-banner">
            <img src="@/assets/image/banners.webp" class="img-banner" />
            <div class="close-box" @click="remove">
              <n-icon :component="CloseCircleSharp" :size="22" />
            </div>
          </div>

          <div class="user-header">
            <div class="avatar">
              <div class="avatar-box">
                <n-avatar
                  round
                  :size="70"
                  :src="state.avatar"
                  :fallback-src="defAvatar"
                />
              </div>
            </div>
            <div class="nickname">
              <span>{{ state.nickname || '未设置' }}</span>
              <div class="share">
                <span>分享</span>
              </div>
            </div>
          </div>
        </header>

        <main class="el-main main">
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
              <span class="text">{{ state.nickname || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="name">性别 :</span>
              <span class="text">{{
                state.gender == 1 ? '男' : state.gender == 2 ? '女' : '未知'
              }}</span>
            </div>
            <div class="info-item" v-if="state.status == 2">
              <span class="name">备注 :</span>
              <span class="text edit pointer">
                {{ state.remark || '未设置' }}&nbsp;&nbsp;
              </span>
            </div>
            <div class="info-item">
              <span class="name">邮箱 :</span>
              <span class="text">{{ state.email || '-' }}</span>
            </div>
            <div class="info-item" v-if="state.status == 2">
              <span class="name">分组 :</span>
              <n-dropdown
                trigger="click"
                placement="bottom-start"
                :show-arrow="true"
                :options="options"
                @select="handleSelectGroup"
              >
                <span class="text edit pointer">{{ groupName }}</span>
              </n-dropdown>
            </div>
          </div>
        </main>

        <footer
          v-if="state.status == 2"
          class="el-footer footer bdr-t flex-center"
        >
          <n-button type="primary" color="#1890ff" block @click="onToTalk">
            <template #icon>
              <n-icon :component="PaperPlaneOutline" />
            </template>
            发送消息
          </n-button>
        </footer>

        <footer
          v-else-if="state.status == 1"
          class="el-footer footer bdr-t flex-center"
        >
          <template v-if="isOpenFrom">
            <n-input
              type="text"
              placeholder="设置添加好友备注 (按 Enter 键提交)"
              v-model:value="state.text"
              @keydown.enter.native="onJoinContact"
            />

            <n-button
              type="primary"
              color="#1890ff"
              class="mt-l5"
              @click="isOpenFrom = false"
            >
              取消
            </n-button>
          </template>
          <template v-else>
            <n-button
              type="primary"
              color="#1890ff"
              block
              @click="isOpenFrom = true"
            >
              <template #icon>
                <n-icon :component="Add" />
              </template>
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
  background-color: #ffffff;
  border-radius: 5px;

  .header {
    height: 180px;
    position: relative;

    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      color: white;
      transition: all 1s;
      z-index: 1;
      font-size: 20px;
    }

    .img-banner {
      width: 100%;
      height: 100%;
      background-size: 100%;
      overflow: hidden;
      object-fit: cover;
      border-radius: 5px 5px 0 0;

      .close-box {
        position: absolute;
        top: 15px;
        right: 15px;
        color: #ffffff;
        height: 20px;
        width: 20px;
        cursor: pointer;
      }
    }
  }

  .main {
    padding: 60px 30px 0 30px;

    .motto {
      min-height: 26px;
      border-radius: 5px;
      padding: 5px 8px;
      line-height: 25px;
      background: #f3f5f7;
      color: #7d7d7d;
      font-size: 12px;
      margin-bottom: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      position: relative;

      &::before {
        content: ' ';
        position: absolute;
        width: 0;
        height: 0;
        font-size: 0;
        border: 5px solid hsla(0, 0%, 96.9%, 0);
        border-bottom-color: #f3f5f7;
        left: 15px;
        top: -9px;
      }
    }
  }

  .footer {
    height: 60px;
    padding: 0 15px;
  }
}

.user-header {
  width: 100%;
  height: 80px;
  position: absolute;
  bottom: -40px;
  display: flex;
  flex-direction: row;

  .avatar {
    width: 100px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;

    .avatar-box {
      width: 80px;
      height: 80px;
      background-color: white;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;

      img {
        height: 70px;
        width: 70px;
        border-radius: 50%;
      }
    }
  }

  .nickname {
    flex: auto;
    padding-top: 50px;
    font-size: 16px;
    font-weight: 400;
    display: flex;
    align-items: center;

    span {
      margin-left: 5px;
    }

    .share {
      display: inline-flex;
      width: 50px;
      height: 22px;
      background: #ff5722;
      color: white;
      align-items: center;
      justify-content: center;
      padding: 3px 8px;
      border-radius: 20px;
      transform: scale(0.7);
      cursor: pointer;
      i {
        margin-top: 2px;
      }
      span {
        font-size: 14px;
        margin-left: 4px;
      }
    }
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
      width: 50px;
      flex-shrink: 0;
      color: #cbc5c5;
    }

    .text {
      flex: 1 auto;
      margin-left: 5px;
      color: #736f6f;
    }

    .edit {
      text-decoration: underline;
      text-decoration-style: dashed;
      text-underline-offset: 3px;
    }
  }
}
</style>
