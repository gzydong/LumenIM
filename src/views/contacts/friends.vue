<template>
  <div class="panel">
    <el-container class="full-height">
      <el-header height="60px" class="header no-select border">
        <p>我的好友({{ items.length }})</p>
      </el-header>
      <el-main class="panel-body no-padding lum-scrollbar">
        <template v-if="status == 0">
          <Loading />
        </template>
        <template v-else-if="status == 1 && items.length == 0">
          <Empty text="暂无好友" />
        </template>

        <template v-if="status == 1">
          <div
            v-for="(item, index) in items"
            :key="item.id"
            class="data-item"
            @click="touser(item, index)"
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
                @click="toTalk(1, item.id)"
                >发送消息
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteFriend(item, index)"
                >删除好友
              </el-button>
            </div>
          </div>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ServeGetContacts, ServeDeleteContact } from '@/api/contacts'
import Empty from '@/components/global/Empty'
import Loading from '@/components/global/Loading'
import { toTalk } from '@/utils/talk'

export default {
  components: {
    Empty,
    Loading,
  },
  data() {
    return {
      items: [],
      status: 0,
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
          this.status = 1
          this.items = res.data
        }
      })
    },

    // 删除好友
    deleteFriend(item, index) {
      let nickname = item.friend_remark || item.nickname
      this.$alert(`您确定要删除【${nickname}】好友吗？`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        closeOnClickModal: true,
        callback: action => {
          if (action != 'confirm') {
            return false
          }

          let friend_id = item.id
          ServeDeleteContact({
            friend_id,
          }).then(res => {
            if (res.code == 200) {
              this.$delete(this.items, index)
              this.$message({
                message: `好友 【${nickname}】已删除 ...`,
                type: 'success',
              })
            } else {
              this.$message({
                message: `好友 【${nickname}】删除失败 ...`,
                type: 'info',
              })
            }
          })
        },
      })
    },

    // 查看用户名片
    touser(item, index) {
      this.$user(item.id, {
        editRemarkCallbak: data => {
          this.items[index].friend_remark = data.remarks
        },
      })
    },

    // 跳转聊天页面
    toTalk(talk_type, receiver_id) {
      toTalk(talk_type, receiver_id)
    },
  },
}
</script>
<style scoped lang="less">
@import '~@/assets/css/page/contacts.less';
</style>
