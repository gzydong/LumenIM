<script setup>
import { ref, reactive, computed } from 'vue'
import { NIcon, NModal, NButton, NInput, NAvatar, NDropdown } from 'naive-ui'
import { CloseOne, SendEmail, Male, Female } from '@icon-park/vue-next'
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
      Object.assign(state, data)
      showModal.value = true
    } else {
      window['$message'].info('用户信息不存在！', { showIcon: false })
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
    return window['$message'].info('备注信息不能为空！')
  }

  ServeCreateContact({
    friend_id: parseInt(props.uid),
    remark: state.text,
  }).then(res => {
    if (res.code == 200) {
      isOpenFrom.value = false
      window['$message'].success('申请发送成功！')
    } else {
      window['$message'].error(res.message)
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
      window['$message'].success('分组修改成功！')
    } else {
      window['$message'].error(message)
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
  >
    <div class="section">
      <section class="el-container container is-vertical height100">
        <header class="el-header header">
          <n-avatar
            round
            class="avatar"
            :size="100"
            :src="state.avatar || defAvatar"
            :fallback-src="defAvatar"
          />

          <div class="gender" v-show="state.gender > 0">
            <male
              v-if="state.gender == 1"
              theme="outline"
              size="16"
              fill="#ffffff"
              :strokeWidth="2"
            />
            <female
              v-else
              theme="outline"
              size="16"
              fill="#ffffff"
              :strokeWidth="2"
            />
          </div>

          <div
            class="close"
            @click="
              () => {
                remove()
              }
            "
          >
            <close-one theme="outline" size="22" fill="#fff" :strokeWidth="2" />
          </div>

          <div class="nickname text-ellipsis">
            {{ state.remark || state.nickname || '未设置昵称' }}
          </div>
        </header>

        <main class="el-main main me-scrollbar">
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
              <span class="text text-ellipsis"
                >{{ state.nickname || '-' }}
              </span>
            </div>
            <div class="info-item">
              <span class="name">性别 :</span>
              <span class="text">{{
                state.gender == 1 ? '男' : state.gender == 2 ? '女' : '未知'
              }}</span>
            </div>
            <div class="info-item" v-if="state.friend_status == 2">
              <span class="name">备注 :</span>
              <span class="text edit pointer">
                {{ state.remark || '未设置' }}&nbsp;&nbsp;
              </span>
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

        <footer
          v-if="state.friend_status == 2"
          class="el-footer footer bdr-t flex-center"
        >
          <n-button
            round
            type="primary"
            color="#1890ff"
            block
            @click="onToTalk"
            style="width: 91%"
          >
            <template #icon>
              <n-icon :component="SendEmail" />
            </template>
            发送消息
          </n-button>
        </footer>

        <footer
          v-else-if="state.friend_status == 1"
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
              round
              style="width: 91%"
              @click="isOpenFrom = true"
            >
              + 添加好友
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

  .header {
    width: 100%;
    height: 230px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom right, #247ec6, #73c1ff);

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
      &:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }
  }

  .main {
    padding: 20px 30px;
    background-color: #ffffff;

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
    }
  }

  .footer {
    height: 60px;
    padding: 0 15px;
    background-color: #ffffff;
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
