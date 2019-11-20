<template>
  <!-- 添加好友组件 -->
  <div id="add-friend-mask">

    <div v-if="!query" class="query-user-panel">
      <div class="panel-header">
        <h5>好友搜索</h5>
        <i class="close-btn el-icon-circle-close" v-on:click="$emit('close',0)"></i>
      </div>
      <div class="panel-body">
        <div class="from-box">
          <input type="text" v-focus placeholder="请输入查找的手机号" maxlength="11" autofocus="autofocus" v-model="searchMobile" @input="inputQueryMobile"
            @keyup.enter="queryMobile(1)">
        </div>
        <p class="search-tip" v-show="errorTip">{{errorTip}}</p>
      </div>
      <div class="panel-footer">
        <button class="from-submit" @click="queryMobile(1)">确认</button>
      </div>
    </div>

    <div v-else class="peofile-from-panel">
      <div class="panel-header">
        <p class="head-pic"><img :src="userInfo.avatarurl" :onerror="$store.state.user.detaultAvatar"></p>

        <p class="previous-step" v-show="isReturn" @click="query = false"><i class="el-icon-back"></i> 返回</p>

        <i class="close-btn el-icon-circle-close" v-on:click="$emit('close',0)"></i>
      </div>

      <div class="panel-body">
        <ul>
          <li>
            <label>手机号 </label>
            <p>+86 - {{ userInfo.mobile}}</p>
          </li>
          <li>
            <label>昵称 </label>
            <p>{{ userInfo.nickname}}</p>
          </li>
          <li v-if="userInfo.friendStatus == 2">
            <label>备注 </label>
            <p v-if="!isEditRemark" style="height: 25px;line-height: 25px;">
              {{userInfo.nicknameRemark?userInfo.nicknameRemark:'暂无备注'}} <i class="iconfont icon-beizhu pointer edit-remark-icon"
                @click="isEditRemark = true;editText = userInfo.nicknameRemark"></i>
            </p>
            <p v-else><input type="text" class="edit-input" v-model="editText" @keyup.enter="editRemark"><span class="input-submit"
                @click="editRemark">确认</span></p>
          </li>

          <li style="position: relative;">
            <label>座右铭 </label>
            <p style="position: absolute;left: 55px;">{{ userInfo.motto?userInfo.motto:'暂未设置'}}</p>
          </li>
        </ul>
      </div>

      <div v-show="showFromBox" class="add-friend-from">
        <p>
          <span>请输入请求好友说明：</span>
          <span @click="showFromBox = false">取消</span>
        </p>
        <div>
          <input type="text" v-model="applyRemark" @keyup.enter="sendApply">
          <span @click="sendApply">发送</span>
        </div>
      </div>

      <div v-if="userInfo.friendStatus == 2" class="panel-footer">
        <p class="green-color" @click="$emit('close',userInfo.user_id)">发消息</p>
        <p class="red-color" @click="delFirend">删除好友</p>
      </div>
      <div v-else-if="userInfo.friendApply == 1" class="panel-footer padding-none">
        <button class="from-submit grey-bag">已发送好友申请</button>
      </div>
      <div v-else-if="userInfo.friendStatus == 1" class="panel-footer padding-none">
        <button class="from-submit" @click="showFromBox = true">+添加好友</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    editUserSetupApi,
    getUserDetailApi,
    searchUserApi,
    sendFriendApplyApi,
    friendRemarkApi
  } from '@/services/api'
  import validate from '@/utils/validate'

  export default {
    data() {
      return {
        query: false,
        searchMobile: '',
        isReturn: true,
        errorTip: '',
        userInfo: {
          mobile: '',
          nickname: '',
          avatarurl: '',
          motto: '',
          friendStatus: 0,
          friendApply: 0,
          nicknameRemark: ''
        },
        showFromBox: false,
        applyRemark: '',

        isEditRemark: false,
        editText: '',
      }
    },
    created() {
      let queryMobile = sessionStorage.getItem('query_mobile');
      sessionStorage.removeItem('query_mobile');
      if (queryMobile) {
        let [val, type] = queryMobile.split(',');
        this.isReturn = false;
        this.searchMobile = val;
        this.queryMobile(type);
      }
    },
    methods: {
      inputQueryMobile() {
        this.errorTip = '';
      },

      //手机号查询
      queryMobile(type = 1) {
        let that = this,data = {};
        if (type == 1) {
          if (!validate.validatPhone(this.searchMobile)) {
            this.errorTip = '手机号格式不正确';
            return;
          }
          data = {
            mobile: this.searchMobile
          };
        } else {
          data = {
            user_id: this.searchMobile
          };
        }

        searchUserApi(data).then((res) => {
          if (res.code == 200) {
            that.query = true;
            let data = res.data;
            that.userInfo.user_id = data.id;
            that.userInfo.mobile = data.mobile;
            that.userInfo.nickname = data.nickname;
            that.userInfo.nicknameRemark = data.nickname_remark;
            that.userInfo.motto = data.motto;
            that.userInfo.avatarurl = data.avatarurl;
            that.userInfo.friendStatus = data.friend_status;
            that.userInfo.friendApply = data.friend_apply;
          } else {
            this.errorTip = '无法找到该用户，请检查手机号是否正确';
          }
        });
      },

      //发送好友申请
      sendApply() {
        let that = this;
        if (this.applyRemark == '') {
          return;
        }

        sendFriendApplyApi({
          friend_id: this.userInfo.user_id,
          remarks: this.applyRemark
        }).then((res) => {
          console.log(res)
          if (res.code == 200) {
            that.showFromBox = false;
            that.applyRemark = '';
            that.userInfo.friendApply = 1;
          } else {
            alert('发送好友申请失败,请稍后再试...');
          }
        });
      },

      //编辑好友备注昵称
      editRemark() {
        let that = this,
          data = {
            friend_id: this.userInfo.user_id,
            remarks: this.editText
          };
          
        if(data.remarks == that.userInfo.nicknameRemark){
          that.isEditRemark = false;
          return;
        }
          

        friendRemarkApi(data).then(res => {
          if (res.code == 200) {
            that.isEditRemark = false;
            that.userInfo.nicknameRemark = data.remarks;
          }
        })
      },


      delFirend() {
        alert('此功能暂未开发，请耐心等待...')
      }
    }
  }
</script>

<style scoped>
  #add-friend-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .peofile-from-panel {
    width: 355px;
    height: 550px;
    background: #FFFFFF;
    margin: auto auto;
    margin-top: calc(50vh - 225px);
  }

  .query-user-panel .panel-header,
  .peofile-from-panel .panel-header {
    height: 165px;
    width: 100%;
    color: #fff;
    position: relative;
  }

  .query-user-panel .panel-header {
    color: #000000 !important;
    box-shadow: 1px 0px 6px 0px #b0a8a8;
  }


  .peofile-from-panel .panel-header {
    background: url(/static/image/banner-bag.jpg);
    background-size: 100% 100%;
  }

  .query-user-panel .panel-header .close-btn,
  .peofile-from-panel .panel-header .close-btn {
    position: absolute;
    right: -40px;
    top: 0px;
    font-size: 26px;
    cursor: pointer;
    color: #FFFFFF !important;
  }

  .peofile-from-panel {
    position: relative !important;
  }

  .peofile-from-panel .panel-header .head-pic {
    width: 70px;
    height: 70px;
    position: absolute;
    left: 145px;
    top: 46px;
  }

  .peofile-from-panel .panel-header .head-pic img {
    width: 70px;
    height: 70px;
    border-radius: 50% 50%;
    cursor: pointer;
  }

  .peofile-from-panel .panel-header .previous-step {
    width: 50px;
    height: 38px;
    line-height: 38px;
    padding-left: 5px;
    font-size: 12px;
    cursor: pointer;
  }

  .peofile-from-panel .panel-body {
    height: calc(100% - 210px);
    width: 100%;
  }

  .peofile-from-panel .panel-body ul {
    width: 85%;
    margin: 0 auto;
    padding-top: 30px;
  }

  .peofile-from-panel .panel-body ul li {
    min-height: 46px;
    width: 100%;
    position: relative;
  }


  input::-webkit-input-placeholder {
    color: #a9a4a4;
    font-size: 12px;
  }


  .peofile-from-panel .panel-body ul li label {
    display: inline-block;
    font-size: 13px;
    color: #2dcee9;
    width: 50px;
  }

  .peofile-from-panel .panel-body ul li p {
    width: 245px;
    border-bottom: 1px dashed #e6e6e6;
    color: #a9a4a4;
    font-size: 12px;
    display: inline-block;
    padding: 5px 0;
    line-height: 20px;
    min-height: 20px;
  }

  .panel-body .edit-remark-icon {
    position: absolute;
    margin-left: 5px;
    color: rgb(0, 215, 255);
  }

  .panel-body .edit-input {
    width: 60%;
    line-height: 25px;
    border: 1px solid #92CBFF;
    padding-left: 5px;
    border-radius: 3px;
  }

  .panel-body .input-submit {
    width: 55px;
    text-align: center;
    line-height: 27px;
    background-color: #008CEE;
    border-radius: 2px;
    display: inline-block;
    color: #fff;
    font-size: 12px;
    margin-left: 10px;
    cursor: pointer;
  }

  .panel-body .input-submit:active {
    background-color: #59bbff;
  }

  .query-user-panel .panel-footer {
    height: 45px;
    width: 100%;
    border-top: 1px solid #f2f2f2;
    text-align: center;
  }

  .peofile-from-panel .panel-footer {
    position: relative;
    height: 33px;
    width: 100%;
    border-top: 1px solid #f2f2f2;
    text-align: center;
    padding-top: 11px;
  }

  .peofile-from-panel .panel-footer p {
    width: 49.5%;
    float: left;
    height: 21px;
    text-align: center;
    line-height: 23px;
    cursor: pointer;
  }

  .peofile-from-panel .panel-footer p:nth-child(2) {
    border-left: 1px solid #e2e2e2;
  }

  .add-friend-from {
    position: absolute;
    background: #f3f3f3;
    height: 80px;
    z-index: 2;
    width: 100%;
    bottom: 0px;
    left: 0;
    border-top: 1px solid #dcdcdc;
  }

  .add-friend-from p {
    height: 20px;
    line-height: 20px;
    padding: 7px 5px 5px 15px;
    font-size: 13px;
  }

  .add-friend-from p span:nth-child(2) {
    float: right;
    margin-right: 13px;
    color: #32caff;
    cursor: pointer;
  }

  .add-friend-from div {
    height: 31px;
    line-height: 20px;
    padding: 7px 5px 5px 15px;
    font-size: 13px;
  }

  .add-friend-from div input {
    height: 30px;
    line-height: 30px;
    text-indent: 5px;
    width: 250px;
    border-radius: 3px;
    padding-right: 7px;
  }

  .add-friend-from div span {
    height: 30px;
    width: 60px;
    line-height: 30px;
    background: #2fc7fe;
    display: inline-block;
    text-align: center;
    color: #fff;
    border-radius: 3px;
    font-size: 14px;
    cursor: pointer;
  }

  .add-friend-from div span:active {
    background: #88eef8;
  }

  .padding-none {
    padding: 0 !important;
  }

  .query-user-panel {
    width: 355px;
    height: 266px;
    background: #FFFFFF;
    margin: auto auto;
    margin-top: calc(50vh - 139px);
  }

  .query-user-panel .panel-header p {
    width: 100%;
    text-align: center;
    height: 60px;
    line-height: 60px;
    font-size: 20px;
  }

  .query-user-panel .panel-header {
    height: 40px !important;
  }

  .query-user-panel .panel-header h5 {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    font-weight: 100;
  }

  .query-user-panel .panel-body {
    height: 180px !important;
  }

  .query-user-panel .panel-body .from-box {
    text-align: center;
    padding-top: 40px;
  }

  .query-user-panel .panel-body .search-tip {
    text-align: center;
    height: 35px;
    line-height: 35px;
    color: #ff4234;
    margin-top: 10px;
    font-size: 12px;
  }

  .from-box input {
    height: 35px;
    text-indent: 5px;
    color: #a9a4a4;
    width: 240px;
    text-align: center;
    border: 1px solid #e7d8d8;
  }

  .from-submit {
    width: 193px;
    height: 31px;
    background: #53eafa;
    margin: 7px auto;
    cursor: pointer;
    color: #fff;
    border-radius: 1px;
  }

  .from-submit:active {
    background: #88eef8;
  }

  .grey-bag {
    background: #e8e8e8 !important;
    cursor: not-allowed;
  }

  .panel-footer .green-color {
    color: #43b735;
    font-size: 14px;
  }

  .panel-footer .red-color {
    color: #ed3c3b;
    font-size: 14px;
  }
</style>
