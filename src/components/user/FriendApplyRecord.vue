<template>
  <div class="base-mask">
    <div class="container-box" v-outside="close">
      <div class="im-header">
        <i class="iconfont icon-guanbi11" style="font-size: 22px;" @click="close"></i>
        <span style="font-size: 14px;">好友申请</span>
      </div>
      <div class="im-body">
        <div class="tool-groups">
          <span :class="{'bg-color':type == 1}" @click="changType(1)">好友申请</span>
          <span :class="{'bg-color':type == 2}" @click="changType(2)">我的申请</span>
        </div>

        <div class="apply-container animated fadeIn" v-for="(record,ridx) in records">
          <img :src="record.avatar" :onerror="$store.state.user.detaultAvatar" @click="catFriendDetail(record)" />
          <div class="name">
            <p>{{ record.nickname }}</p>
            <p>
              <span class="apply-refuse-reason" :title="record.reason" v-show="record.reason">[拒绝原因]</span>
              <span>{{ record.remarks }}</span>
            </p>
          </div>

          <div class="message" v-if="record.status == 0 && record.user_id == $store.state.user.uid">
            <span>等待对方处理 ...</span>
          </div>

          <div class="message" v-else-if="record.status == 0">
            <el-button type="text" @click="selectHandleFriend(ridx,1,record)">接受</el-button>
            <el-button type="text" @click="selectHandleFriend(ridx,2,record)" style="color: #999999;">拒绝</el-button>
          </div>

          <div class="message" v-else>
            <span v-if="record.status == 1">已同意</span>
            <span v-else>已拒绝</span>
          </div>
        </div>

        <div class="im-page" v-if="records.length > 0">
          <el-pagination background layout="prev, pager, next" :current-page="page" :total="total"
            :page-size="page_size" @current-change="currentChange">
          </el-pagination>
        </div>
      </div>
    </div>

    <div class="confirm-box" v-show="showConfirmBox">
      <div class="confirm-header">
        <span class="confirm-title" v-if="from.type == 1">设置好友备注</span>
        <span class="confirm-title" v-else>设置拒绝原因</span>
        <i class="iconfont icon-guanbi11 confirm-close" @click="showConfirmBox = false;"></i>
      </div>
      <div class="confirm-main">
        <input type="text" :placeholder="from.type == 1?'请填写好友备注':'请填写拒绝理由'" v-model="from.text">

        <div style="text-align: right;padding-right: 33px;margin-top: 50px;">
          <el-button class="btn" size="small" @click="showConfirmBox = false;">取消</el-button>
          <el-button type="primary" class="btn" :loading="from.loading" size="small" @click="submit">确认</el-button>
        </div>
      </div>
    </div>

    <!-- 查看好友用户信息 -->
    <user-business-card ref="userBusinessCard" @send-friend-msg="sendFriendMsg" />
  </div>
</template>

<script>
  import {
    findFriendApplyServ,
    handleFriendApplyServ
  } from "@/api/user";

  import Vue from 'vue';
  import {
    Pagination
  } from 'element-ui';

  Vue.use(Pagination);

  import UserBusinessCard from "@/components/user/UserBusinessCard";
  export default {
    name: "friend-apply-record",
    data() {
      return {
        records: [],
        type: 1,
        page: 1,
        page_size: 7,
        page_total: 0,
        total: 0,
        showConfirmBox: false,
        from: {
          index: null,
          id: null,
          type: null,
          text: '',
          loading: false
        }
      }
    },
    components: {
      UserBusinessCard
    },
    created() {
      this.loadFriendApply();
    },
    methods: {
      changType(type) {
        this.type = type;
        this.page = 1;
        this.loadFriendApply();
      },

      //查看好友申请列表
      loadFriendApply() {
        findFriendApplyServ({
          type: this.type,
          page: this.page,
          page_size: 7
        }).then(res => {
          if (res.code == 200) {
            this.records = res.data.rows;
            this.page_total = res.data.page_total;
            this.total = res.data.total;
          }
        });
      },
      selectHandleFriend(ridx, type, record) {
        this.showConfirmBox = true;
        this.from.index = ridx;
        this.from.id = record.id;
        this.from.type = type;
        this.from.text = '';
      },

      currentChange(page) {
        this.page = page;
        this.loadFriendApply();
      },
      prevClick() {
        this.page--;
        this.loadFriendApply();
      },
      nextClick() {
        this.page++;
        this.loadFriendApply();
      },

      // 关闭窗口
      close() {
        if (this.showConfirmBox == false && this.$refs.userBusinessCard.isShow == false) {
          this.$emit('close');
        }
      },

      submit() {
        this.from.loading = true;
        handleFriendApplyServ({
          apply_id: this.from.id,
          type: this.from.type,
          remarks: this.from.text
        }).then(res => {
          if (res.code == 200) {
            let record = this.records[this.from.index];
            record.status = this.from.type;
            if (this.from.type == 2) {
              record.reason = this.from.text;
            }

            this.$set(this.records, this.from.index, record);
            this.showConfirmBox = false;
          } else {
            alert('处理失败...')
          }

          this.from.loading = false;
        }).catch(err => {
          this.from.loading = false;
        });
      },

      // 查看用户信息
      catFriendDetail(info) {
        let uid = this.$store.state.user.uid;
        let value = uid == info.user_id ? info.friend_id : info.user_id;
        this.$refs.userBusinessCard.open(value);
      },

      // 发送用户消息
      sendFriendMsg(friendInfo) {
        sessionStorage.setItem("send_message_index_name", friendInfo.index_name);
        this.$router.push({
          path: "/message"
        });
      },
    }
  };

</script>

<style scoped="scoped">
  .container-box {
    width: 750px;
    height: 600px;
    background-color: white;
    position: fixed;
    left: 0;
    right: 0;
    top: 0px;
    bottom: 0;
    margin: auto;
    overflow: hidden;
    border-radius: 3px;
  }

  .im-header {
    height: 45px;
    line-height: 45px;
    text-align: left;
    text-indent: 20px;
    position: relative;
    border-bottom: 1px solid #f6f1f1;
  }

  .im-header span {
    color: #5f5f5f;
    font-size: 14px;
  }

  .im-header>i {
    position: absolute;
    right: 12px;
    top: 0px;
    color: #4d4d4d;
    cursor: pointer;
  }

  .im-header .title {
    width: 220px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .im-body {
    height: calc(100% - 38px);
    height: -moz-calc(100% - 38px);
    height: -webkit-calc(100% - 38px);
  }

  .tool-groups {
    width: 100%;
    height: 30px;
    margin: 8px 0;
    text-align: right;
  }

  .tool-groups span {
    display: inline-block;
    padding: 5px 8px;
    background-color: #d1d3d6;
    cursor: pointer;
    color: white;
    font-size: 14px;
  }

  .tool-groups span:last-child {
    margin-right: 10px;
  }

  .tool-groups .bg-color {
    background-color: #409eff !important;
  }

  .apply-container {
    border-bottom: 1px dashed #e7e7e7;
    padding: 10px;
    height: 45px;
  }

  .apply-container img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    float: left;
    cursor: pointer;
  }

  .apply-container .name {
    float: left;
    width: calc(100% - 180px);
    margin-left: 10px;
    font-size: 16px;
  }

  .apply-container .apply-refuse-reason {
    cursor: pointer;
    color: #32b6ea;
  }

  .apply-container .name p:first-child {
    height: 20px;
    line-height: 20px;
  }

  .apply-container .name p:last-child {
    font-size: 12px;
    color: #999999;
    margin-top: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }

  .apply-container .message {
    float: right;
    line-height: 45px;
    font-size: 12px;
    color: #999999;
    margin-right: 10px;
  }

  .im-page {
    width: 100%;
    position: absolute;
    bottom: 10px;
  }

  .im-page .el-pagination {
    text-align: center;
  }

  .confirm-box {
    width: 300px;
    height: 200px;
    background-color: white;
    position: fixed;
    left: 0;
    right: 0;
    top: 0px;
    bottom: 0;
    margin: auto auto;
    overflow: hidden;
    box-shadow: 0 0 20px 0px #ccc;
    z-index: 1;
  }

  .confirm-box .confirm-header {
    height: 38px;
    border-bottom: 1px solid #ebe1e1;
    position: relative;
  }

  .confirm-box .confirm-header .confirm-title {
    height: 38px;
    line-height: 38px;
    padding-left: 5px;
    color: #969191;
  }

  .confirm-box .confirm-header .confirm-close {
    position: absolute;
    top: 8px;
    right: 10px;
    font-size: 22px;
    cursor: pointer;
  }

  .confirm-box .confirm-main {
    height: 162px;
    width: 100%;
  }

  .confirm-box .confirm-main input {
    width: 80%;
    height: 30px;
    border: 1px solid #409eff;
    margin: 25px 0 0 28px;
    padding: 3px;

    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 1;
    outline: none;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  }

  .confirm-box .confirm-main input:focus {
    outline: none;
    border-color: #409eff;
  }

  .confirm-box .confirm-main input::-webkit-input-placeholder {
    font-size: 14px;
    color: rgb(202, 192, 192);
  }

</style>
