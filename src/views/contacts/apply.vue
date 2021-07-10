<template>
  <div class="panel">
    <el-container class="full-height">
      <el-header height="60px" class="header no-select border">
        <p>好友申请({{ items.length }})</p>
      </el-header>
      <el-main class="panel-body no-padding lum-scrollbar">
        <template v-if="status == 0">
          <Loading />
        </template>
        <template v-else-if="status == 1 && items.length == 0">
          <Empty text="暂无联系人申请" />
        </template>

        <template v-if="status == 1">
          <div
            v-for="(item, index) in items"
            :key="item.id"
            class="data-item"
            @click="$user(item.user_id)"
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
                <div class="larkc-tag wait">待处理</div>
              </div>
              <div class="content">
                [申请时间] {{ item.created_at }} / [备注说明]
                {{ item.remark }}
              </div>
            </div>
            <div class="apply-from" @click.prevent.stop>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-check"
                @click="handleFrom(item, 1, index)"
                >同意
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-close"
                @click="handleFrom(item, 2, index)"
                >拒绝
              </el-button>
            </div>
          </div>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Empty from '@/components/global/Empty'
import Loading from '@/components/global/Loading'
import {
  ServeGetContactApplyRecords,
  ServeApplyAccept,
  ServeApplyDecline,
} from '@/api/contacts'

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
  beforeRouteUpdate(to, from, next) {
    this.loadFriendApply()
    next()
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
          this.status = 1
          this.items = res.data.rows
        }
      })
    },

    // 处理好友申请信息
    handleFrom(item, type, index) {
      let title = '同意申请'
      let notice = `请设置好友备注【${item.nickname}】`
      let value = item.remark
      let commit = ServeApplyAccept
      if (type == 2) {
        title = '拒绝申请'
        notice = '请填写拒绝的原因！'
        value = '无理由拒绝！'
        commit = ServeApplyDecline
      }

      this.$prompt(notice, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: value,
        inputValidator(val) {
          return val == null || val == '' ? '备注信息不能为空' : true
        },
      })
        .then(data => {
          commit({
            apply_id: item.id,
            remark: data.value,
          }).then(res => {
            if (res.code == 200) {
              this.$delete(this.items, index)

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
  },
}
</script>
<style scoped lang="less">
@import '~@/assets/css/page/contacts.less';
</style>
