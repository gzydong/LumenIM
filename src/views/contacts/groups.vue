<template>
  <div class="panel">
    <el-container class="full-height">
      <el-header height="60px" class="header no-select">
        <p>我的群组</p>
      </el-header>
      <el-header height="40px" class="no-select subheader">
        <p :class="{ active: tabIndex == 0 }" @click="tabIndex = 0">
          全部群组({{ groups.items.length }})
        </p>
        <el-divider direction="vertical" />
        <p :class="{ active: tabIndex == 1 }" @click="tabIndex = 1">
          我的创建({{ counts[1] }})
        </p>
        <el-divider direction="vertical" />
        <p :class="{ active: tabIndex == 2 }" @click="tabIndex = 2">
          我的管理({{ counts[2] }})
        </p>
        <el-divider direction="vertical" />
        <p :class="{ active: tabIndex == 3 }" @click="tabIndex = 3">
          我的加入({{ counts[3] }})
        </p>
      </el-header>
      <el-main class="panel-body no-padding lum-scrollbar">
        <template v-if="groups.status == 0">
          <Loading />
        </template>
        <template v-else-if="groups.status == 1 && groups.items.length == 0">
          <Empty text="暂未加入群聊" />
        </template>

        <template v-if="groups.status == 1">
          <div
            v-for="item in filterGroups"
            :key="item.id"
            class="data-item"
            @click="groupDetailId = item.id"
          >
            <el-avatar
              class="avatar"
              shape="square"
              :size="35"
              :src="item.avatar"
            >
              {{ item.group_name.substr(0, 1) }}
            </el-avatar>
            <div class="card">
              <div class="title">
                <span class="name">{{ item.group_name }}</span>
                <div v-show="item.is_disturb == 1" class="larkc-tag">
                  <i
                    class="iconfont icon-xiaoximiandarao"
                    style="font-size: 10px; color: #7d7a7a"
                  />
                </div>
                <div v-show="item.leader == 2" class="larkc-tag wait">
                  群主
                </div>
              </div>
              <div class="content">
                [群介绍] ~ 「{{
                  item.group_profile ? item.group_profile : '未设置'
                }}」
              </div>
            </div>
            <div class="apply-from" @click.prevent.stop>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-s-promotion"
                @click="toTalk(2, `2_${item.id}`)"
                >发送消息
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteGroup(item)"
                >退出群聊
              </el-button>
            </div>
          </div>
        </template>
      </el-main>
    </el-container>

    <div class="broadside-box" v-show="groupDetailId">
      <group-panel
        :group-id="groupDetailId"
        @close="groupDetailId = 0"
        @send-group="sendMessage"
        @disturb-change="disturbChange"
        @quit-group="quitGroupSuccess"
      />
    </div>
  </div>
</template>

<script>
import GroupPanel from '@/components/group/GroupPanel'
import { ServeGetGroups, ServeSecedeGroup } from '@/api/group'
import { ServeCreateTalkList } from '@/api/chat'

import Empty from '@/components/global/Empty'
import Loading from '@/components/global/Loading'

export default {
  components: { GroupPanel, Empty, Loading },
  data() {
    return {
      tabIndex: 0,

      // 我的群组
      groups: {
        items: [],
        status: 0,
      },

      counts: {
        1: 0,
        2: 0,
        3: 0,
      },

      groupDetailId: 0,
    }
  },
  watch: {
    'groups.items'() {
      this.groups.items.forEach(item => {
        if (item.leader == 0) {
          this.counts[3]++
        } else if (item.leader == 1) {
          this.counts[2]++
        } else if (item.leader == 2) {
          this.counts[1]++
        }
      })
    },
  },
  computed: {
    filterGroups() {
      return this.groups.items.filter(item => {
        if (this.tabIndex == 1) {
          return item.leader == 2
        } else if (this.tabIndex == 2) {
          return item.leader == 1
        } else if (this.tabIndex == 3) {
          return item.leader == 0
        }

        return true
      })
    },
  },
  created() {
    this.loadUserGroups()
  },
  methods: {
    // 加载群聊列表接口
    loadUserGroups() {
      ServeGetGroups().then(res => {
        if (res.code == 200) {
          this.groups.status = 1
          this.groups.items = res.data
        }
      })
    },

    // 根据用户对话索引获取对话数组对应的key
    getGroupIndex(group_id) {
      return this.groups.items.findIndex(item => item.id == group_id)
    },

    // 退出群聊
    deleteGroup(item) {
      this.$alert(`您确定要退出【${item.group_name}】群聊吗？`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        customClass: 'border-radius0',
        closeOnClickModal: true,
        callback: action => {
          if (action == 'confirm') {
            let group_id = item.id
            ServeSecedeGroup({
              group_id,
            }).then(res => {
              if (res.code == 200) {
                this.$delete(
                  this.groups.items,
                  this.groups.items.findIndex(item => item.id == group_id)
                )

                this.$message({
                  message: `您已成功退出【${item.group_name}】群聊 ...`,
                  type: 'success',
                })
              } else {
                this.$message({
                  message: `退出 【${item.group_name}】】群聊失败 ...`,
                  type: 'info',
                })
              }
            })
          }
        },
      })
    },

    // 跳转聊天页面
    toTalk(talk_type, index_name) {
      let receiver_id = index_name.split('_')[1]
      ServeCreateTalkList({
        talk_type,
        receiver_id,
      }).then(res => {
        if (res.code !== 200) return
        this.$root.dumpTalkPage(index_name)
      })
    },

    // 群聊窗口点击发送群聊信息按钮回调事件
    sendMessage(groupId) {
      this.toTalk(2, `2_${groupId}`)
    },

    // 用户退出群聊回调事件
    quitGroupSuccess() {
      this.$delete(this.groups.items, this.getGroupIndex(this.groupDetailId))
      this.groupDetailId = 0
    },

    // 发起群聊成功后回调方法
    groupChatSuccess(data) {
      this.launchGroupShow = false
      this.loadUserGroups()
    },

    // 修改群聊免打扰状态
    disturbChange(detail) {
      let idx = this.getGroupIndex(detail.group_id)
      this.groups.items[idx].is_disturb = detail.status
    },
  },
}
</script>
<style scoped lang="less">
@import '~@/assets/css/page/contacts.less';
</style>
