<template>
  <div class="panel">
    <el-container class="full-height">
      <el-header height="60px" class="header no-select border">
        <p>我的好友({{ friends.items.length }})</p>
      </el-header>
      <el-main class="panel-body no-padding lum-scrollbar">
        <template v-if="friends.status == 0">
          <Loading />
        </template>
        <template v-else-if="friends.status == 1 && friends.items.length == 0">
          <Empty text="暂无好友" />
        </template>

        <template v-if="friends.status == 1">
          <div
            v-for="item in friends.items"
            :key="item.id"
            class="data-item"
            @click="openUserDetail(item.id)"
          >
            <el-avatar
              class="avatar"
              shape="square"
              :size="35"
              :src="item.avatar"
            >
              {{ item.nickname.substr(0, 1) }}
            </el-avatar>
            <div class="card">
              <div class="title">
                <span class="name">
                  {{ item.friend_remark ? item.friend_remark : item.nickname }}
                </span>
                <div v-show="item.online == 1" class="larkc-tag agree">
                  在线
                </div>
              </div>
              <div class="content">
                [个性签名] 「{{ item.motto ? item.motto : '未设置' }}」
              </div>
            </div>

            <div class="apply-from" @click.prevent.stop>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-s-promotion"
                @click="toTalk(1, `1_${item.id}`)"
                >发送消息
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteFriend(item)"
                >删除好友
              </el-button>
            </div>
          </div>
        </template>
      </el-main>
    </el-container>

    <!-- 查看好友用户信息 -->
    <UserBusinessCard ref="userBusinessCard" />
  </div>
</template>

<script>
import { ServeGetContacts, ServeDeleteContact } from '@/api/contacts'
import UserBusinessCard from '@/components/user/UserBusinessCard'
import { ServeCreateTalkList } from '@/api/chat'
import Empty from '@/components/global/Empty'
import Loading from '@/components/global/Loading'

export default {
  components: {
    UserBusinessCard,
    Empty,
    Loading,
  },
  data() {
    return {
      // 我的好友列表
      friends: {
        items: [],
        status: 0,
      },
    }
  },
  created() {
    this.loadFriends()
  },
  methods: {
    // 加载好友列表
    loadFriends() {
      ServeGetContacts().then(res => {
        if (res.code == 200) {
          this.friends.status = 1
          this.friends.items = res.data
        }
      })
    },

    // 删除好友
    deleteFriend(item) {
      let name = item.friend_remark ? item.friend_remark : item.name
      this.$alert(`您确定要删除【${name}】好友吗？`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        customClass: 'border-radius0',
        closeOnClickModal: true,
        callback: action => {
          if (action == 'confirm') {
            let friend_id = item.id
            ServeDeleteContact({
              friend_id,
            }).then(res => {
              if (res.code == 200) {
                this.$delete(
                  this.friends.items,
                  this.friends.items.findIndex(item => item.id == friend_id)
                )

                this.$message({
                  message: `好友 【${name}】已删除 ...`,
                  type: 'success',
                })
              } else {
                this.$message({
                  message: `好友 【${name}】删除失败 ...`,
                  type: 'info',
                })
              }
            })
          }
        },
      })
    },

    // 查看用户名片
    openUserDetail(user_id) {
      this.$refs.userBusinessCard.open(user_id)
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
  },
}
</script>
<style scoped lang="less">
@import '~@/assets/css/page/contacts.less';
</style>
