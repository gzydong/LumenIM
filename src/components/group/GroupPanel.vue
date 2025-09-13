<script lang="ts" setup>
import {
  fetchGroupDetail,
  fetchGroupMemberList,
  fetchGroupRemarkUpdate,
  fetchGroupSecede
} from '@/apis/api'
import { fetchApi } from '@/apis/request'
import { useInject } from '@/hooks'
import { useUserStore } from '@/store'
import { Close, Comment, More, Plus } from '@icon-park/vue-next'
import GroupLaunch from './GroupLaunch.vue'
import GroupManage from './manage/index.vue'
import MemberDrawer from './MemberDrawer.vue'

const userStore = useUserStore()
const { toShowUserInfo } = useInject()

const emit = defineEmits(['close', 'to-talk'])
const props = defineProps({
  groupId: {
    type: Number,
    default: 0
  }
})

watch(props, () => {
  loadDetail()
  loadMembers()
})

const editCardPopover = ref(false)
const isShowGroup = ref(false)
const isShowManage = ref(false)
const isShowMemberList = ref(false)
const remark = ref('')
const loading = ref(false)
const detail = reactive({
  avatar: '',
  name: '',
  profile: '',
  visit_card: '',
  notice: ''
})

const members = ref<any[]>([])

const isLeader = computed(() => {
  return members.value.some((item: any) => {
    return item.user_id == userStore.uid && item.leader == 2
  })
})

const isAdmin = computed(() => {
  return members.value.some((item: any) => {
    return item.user_id == userStore.uid && item.leader == 1
  })
})

const onShowManage = (vallue: any) => {
  isShowManage.value = vallue
}

const onGroupCallBack = () => {}

const onToInfo = (item: any) => {
  toShowUserInfo(item.user_id)
}

/**
 * 加载群信息
 */
async function loadDetail() {
  const [err, data] = await fetchApi(
    fetchGroupDetail,
    { group_id: props.groupId },
    { error: false, loading }
  )

  if (err) return

  remark.value = data.visit_card
  detail.avatar = data.avatar
  detail.name = data.group_name
  detail.profile = data.profile
  detail.visit_card = data.visit_card
  detail.notice = data.notice?.content || ''
}

/**
 * 加载成员列表
 */
async function loadMembers() {
  const [err, data] = await fetchApi(
    fetchGroupMemberList,
    { group_id: props.groupId },
    { error: false }
  )

  if (err) return

  members.value = data.items || []
}

const onClose = () => {
  emit('close')
}

const onSignOut = async () => {
  await fetchApi(
    fetchGroupSecede,
    { group_id: props.groupId },
    {
      successText: '已退出群聊',
      onSuccess: onClose
    }
  )
}

const onChangeRemark = async () => {
  const [err] = await fetchApi(
    fetchGroupRemarkUpdate,
    {
      group_id: props.groupId,
      remark: remark.value
    },
    {
      successText: '已更新群名片'
    }
  )

  if (err) return

  // @ts-expect-error
  editCardPopover.value.setShow(false)
  detail.visit_card = remark.value
  loadMembers()
}

onMounted(() => {
  loadDetail()
  loadMembers()
})
</script>
<template>
  <section id="group-panel" class="el-container is-vertical section">
    <header class="el-header header border-bottom flex-center">
      <div class="left-icon flex-center" @click="emit('to-talk')">
        <n-icon size="20" :component="Comment" />
      </div>
      <div class="center-text flex-center">
        <span>群信息</span>
      </div>
      <div class="right-icon flex-center">
        <n-icon size="20" :component="Close" @click="onClose" />
      </div>
    </header>

    <main class="el-main main me-scrollbar me-scrollbar-thumb">
      <div class="info-box">
        <div class="b-box">
          <div class="block">
            <div class="title">群名称</div>
          </div>
          <div class="describe">{{ detail.name }}</div>
        </div>

        <div class="b-box">
          <div class="block">
            <div class="title">群简介</div>
          </div>
          <div class="describe">
            {{ detail.profile ? detail.profile : '暂无群简介' }}
          </div>
        </div>

        <div class="b-box">
          <div class="block">
            <div class="title">群名片</div>
            <div class="text">
              <n-popover trigger="click" placement="left" ref="editCardPopover">
                <template #trigger>
                  <n-button type="primary" text> 设置 </n-button>
                </template>

                <template #header> 设置我的群名片 </template>

                <div style="display: flex">
                  <n-input
                    type="text"
                    placeholder="设置我的群名片"
                    maxlength="10"
                    v-model:value="remark"
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
          </div>
          <div class="describe">{{ detail.visit_card || '未设置' }}</div>
        </div>

        <div class="b-box">
          <div class="block">
            <div class="title">群成员</div>
            <div class="text">{{ members.length }}人</div>
          </div>
          <div class="describe">群主已开启“新成员入群可查看所有聊天记录</div>
        </div>
      </div>

      <div class="member-box2">
        <div class="member-item" @click="isShowGroup = true">
          <div class="avatar flex-center">
            <n-button circle>
              <template #icon>
                <n-icon :component="Plus" />
              </template>
            </n-button>
          </div>
          <p class="text-ellipsis">添加成员</p>
        </div>

        <div
          class="member-item"
          v-for="item in members.slice(0, 10)"
          :key="item.id"
          @click="onToInfo(item)"
        >
          <div class="avatar flex-center">
            <im-avatar :size="35" :src="item.avatar" :username="item.nickname" />
          </div>
          <p class="text-ellipsis">{{ item.nickname }}</p>
        </div>

        <div class="member-item" @click="isShowMemberList = true">
          <div class="avatar flex-center">
            <n-button circle>
              <template #icon>
                <n-icon :component="More" />
              </template>
            </n-button>
          </div>
          <p class="text-ellipsis">查看更多</p>
        </div>
      </div>
    </main>

    <footer v-show="loading == false" class="el-footer footer border-top">
      <template v-if="isAdmin">
        <n-button block type="primary" text-color="#ffffff" @click="onShowManage(true)">
          群聊管理
        </n-button>
      </template>

      <template v-if="!isAdmin && !isLeader">
        <n-popconfirm
          negative-text="取消"
          positive-text="确定"
          :positive-button-props="{
            textColor: '#ffffff'
          }"
          @positive-click="onSignOut"
        >
          <template #trigger>
            <n-button block ghost> 退出群聊 </n-button>
          </template>
          确定要退出群吗？ 退出后不再接收此群消息！
        </n-popconfirm>
      </template>

      <template v-if="isLeader">
        <n-button
          style="width: 49%"
          type="primary"
          text-color="#ffffff"
          @click="onShowManage(true)"
        >
          群聊管理
        </n-button>

        <n-popconfirm
          negative-text="取消"
          positive-text="确定"
          :positive-button-props="{
            textColor: '#ffffff'
          }"
          @positive-click="onSignOut"
        >
          <template #trigger>
            <n-button style="width: 49%" type="error" ghost> 退出群聊 </n-button>
          </template>
          确定要退出群吗？ 退出后不再接收此群消息！
        </n-popconfirm>
      </template>
    </footer>
  </section>

  <MemberDrawer v-model="isShowMemberList" :items="members" @on-to-info="onToInfo" />

  <GroupLaunch
    v-if="isShowGroup"
    :group-id="groupId"
    @close="isShowGroup = false"
    @on-submit="onGroupCallBack"
  />

  <GroupManage v-if="isShowManage" :group-id="groupId" @close="onShowManage(false)" />
</template>
<style lang="less" scoped>
:deep(.md-editor-preview-wrapper) {
  padding: 0;
}

.section {
  width: 100%;
  height: 100%;

  .header {
    width: 100%;
    height: 60px;

    .center-text {
      flex: auto;
      font-weight: 500;
      font-size: 15px;
    }

    .left-icon,
    .right-icon {
      width: 50px;
      height: 100%;
      flex-shrink: 0;
      cursor: pointer;
    }
  }

  .main {
    padding: 15px;

    .info-box {
      .b-box {
        display: flex;
        align-items: center;
        min-height: 30px;
        margin: 12px 0;
        flex-direction: column;

        &:first-child {
          margin-top: 0;
        }

        .block {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .title {
            height: 100%;
            line-height: 30px;
            flex: auto;
          }

          .text {
            height: 100%;
            line-height: 30px;
            width: 30%;
            text-align: right;
          }
        }

        .describe {
          width: 100%;
          min-height: 24px;
          line-height: 24px;
          font-size: 13px;
          color: #b1b1b1;
          font-weight: 300;
          overflow: hidden;
          word-break: break-word;
        }
      }
    }

    .member-box2 {
      width: 100%;
      display: grid;
      gap: 5px;
      grid-template-columns: repeat(6, 50px);
      grid-auto-rows: min-content;
      justify-content: space-between;

      .member-item {
        width: 50px;
        height: 70px;
        cursor: pointer;

        &:hover {
          border-radius: 3px;
          p {
            color: #1890ff;
          }
        }

        .avatar {
          width: 100%;
          height: 50px;
        }

        p {
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 10px;
        }
      }
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 60px;
    padding: 15px;
  }
}
</style>
