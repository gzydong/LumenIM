<template>
  <div class="panel">
    <el-container class="full-height">
      <el-header height="60px" class="header no-select border">
        <p>好友申请({{ apply.items.length }})</p>
      </el-header>
      <el-main class="panel-body no-padding lum-scrollbar">
        <template v-if="apply.status == 0">
          <Loading />
        </template>
        <template v-else-if="apply.status == 1 && apply.items.length == 0">
          <Empty text="暂无联系人申请" />
        </template>

        <template v-if="apply.status == 1">
          <div
            v-for="item in apply.items"
            :key="item.id"
            class="data-item"
            @click="openUserDetail(item.user_id)"
          >
            <el-avatar
              shape="square"
              class="avatar"
              :src="item.avatar"
              :size="35"
            >
              {{ item.nickname.substr(0, 1) }}
            </el-avatar>
            <div class="card">
              <div class="title">
                <span class="name">{{ item.nickname }}</span>
                <div class="larkc-tag wait" v-show="item.status == 0">
                  待处理
                </div>
                <div class="larkc-tag agree" v-show="item.status == 1">
                  已同意
                </div>
              </div>
              <div class="content">
                [申请时间] {{ item.created_at }} ~ [备注说明]
                {{ item.remarks }}
              </div>
            </div>
            <div class="apply-from" @click.prevent.stop>
              <el-button
                v-show="item.status == 0"
                size="mini"
                type="primary"
                icon="el-icon-check"
                @click="handleFrom(item)"
                >同意申请
              </el-button>
              <el-button
                v-show="item.status == 1"
                size="mini"
                type="primary"
                icon="el-icon-s-promotion"
                @click="toTalk(1, `1_${item.user_id}`)"
                >发送消息
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteFriendApply(item)"
                >删除记录
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
import UserBusinessCard from '@/components/user/UserBusinessCard'
import Empty from '@/components/global/Empty'
import Loading from '@/components/global/Loading'
import { ServeCreateTalkList } from '@/api/chat'
import {
  ServeGetContactApplyRecords,
  ServeHandleFriendApply,
  ServeDeleteContactApply,
} from '@/api/contacts'

export default {
  components: {
    UserBusinessCard,
    Empty,
    Loading,
  },
  data() {
    return {
      tabIndex: 0,
      // 好友申请列表
      apply: {
        items: [],
        status: 0,
      },
    }
  },
  created() {
    this.loadFriendApply()
  },
  methods: {
    // 查看好友申请列表
    loadFriendApply() {
      ServeGetContactApplyRecords({
        page: 1,
        page_size: 10000,
      }).then(res => {
        if (res.code == 200) {
          this.apply.status = 1
          this.apply.items = res.data.rows
        }
      })
    },

    // 处理好友申请信息
    handleFrom(item) {
      this.$prompt(`请设置好友备注【${item.nickname}】`, '好友备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'border-radius0',
        inputValue: item.remarks,
        inputValidator(val) {
          return val == null || val == '' ? '好友备注不能为空' : true
        },
      })
        .then(data => {
          ServeHandleFriendApply({
            apply_id: item.id,
            remarks: data.value,
          }).then(res => {
            if (res.code == 200) {
              let apply_id = item.id
              let idx = this.apply.items.findIndex(item => item.id == apply_id)

              this.apply.items[idx].status = 1
              this.$message({
                message: '处理成功...',
                type: 'success',
              })
            } else {
              this.$message({
                type: 'info',
                message: '提交失败',
              })
            }
          })
        })
        .catch(action => {})
    },

    // 查看用户名片
    openUserDetail(user_id) {
      this.$refs.userBusinessCard.open(user_id)
    },

    // 删除好友申请记录
    deleteFriendApply(item) {
      let apply_id = item.id
      ServeDeleteContactApply({
        apply_id,
      }).then(res => {
        if (res.code == 200) {
          this.$delete(
            this.apply.items,
            this.apply.items.findIndex(item => item.id == apply_id)
          )
        }
      })
    },

    // 跳转聊天页面
    toTalk(type, index_name) {
      let receive_id = index_name.split('_')[1]
      ServeCreateTalkList({
        type,
        receive_id,
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
