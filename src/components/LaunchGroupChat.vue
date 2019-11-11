<template>
  <!-- 创建群聊组件 -->
  <div id="launch-group-mask">
    <div class="launchgroup-from-panel">
      <div class="panel-header">
        <p>{{queryGroupId==0?'创建群聊':'请选择需要邀请的好友'}}</p>
        <i class="close-btn el-icon-circle-close" v-on:click="$emit('close',0)"></i>
      </div>

      <div class="panel-body">
        <div class="float-left">
          <ul class="group-from" v-show="!readonly">
            <li class="group-avatar-box" >
              <label>群头像:</label>
              <div>
                <img :src="frGroupAvatar" :onerror="$store.state.user.detaultAvatar"  >
                <span @click="showAvatarCropper">设置头像</span>
              </div>
            </li>
            <li>
              <label>群名称:</label>
              <input type="text" v-model="frGroupName" placeholder="请设置群名称(必填)" @keyup.enter="fromSubmit" :readonly="readonly">
            </li>
            <li>
              <label>群简介:</label>
              <input type="text" v-model="frGroupProfile" placeholder="请设置群简介(选填)" @keyup.enter="fromSubmit" :readonly="readonly">
            </li>
          </ul>

          <div v-bind:class="{ height100: readonly,'friend-selectd-list':true }"  >
            <div v-if="groupMember.length == 0" class="no-select-member">{{queryGroupId==0?'您还未选择群聊好友...':'您还未选择需要邀请的好友...'}}</div>
            <ul v-else >
              <li v-for='member in groupMember' @click="clickSelect(member.id,member)" :title="member.friend_remark?member.friend_remark:member.nickname">
                <img :src="member.avatarurl" :onerror="$store.state.user.detaultAvatar">
              </li>
            </ul>
          </div>
        </div>

        <div class="float-right">
          <div class="list-title">
            <div class="input-item">
              <i class="iconfont icon-sousuo"></i>
              <input type="text" v-model="searchName" placeholder="搜索" @input="searchKeyword" @keyup.enter="searchKeyword">
            </div>
          </div>
          <ul>
            <li v-for='(friend,idx) in searchFriendsList' @click="clickSelect(friend.id,friend)">
              <img :src="friend.avatarurl" :onerror="$store.state.user.detaultAvatar">
              <span class="friend-nickname">{{ friend.friend_remark?friend.friend_remark:friend.nickname }}</span>
              <span class="select-btn"><i class="el-icon-success" v-bind:class="{'i-color-green': ids.indexOf(friend.id) >= 0  }"></i></span>
            </li>
          </ul>
        </div>
      </div>
      <div class="panel-footer">
        <button class="from-submit" v-if="queryGroupId==0" @click="fromSubmit">立即创建({{ ids.length }})</button>
        <button class="from-submit" v-else @click="fromSubmit2">立即邀请({{ ids.length }})</button>
      </div>
    </div>

      <avatar-cropper v-if="isAvatarCropper" v-on:close="closeAvatarCropper" ></avatar-cropper>
  </div>
</template>

<script>
  import {
    groupChatMemebers,
    createGroupChatApi,
    inviteGroupMember
  } from '@/services/api'
  
  import AvatarCropper from '@/components/AvatarCropper'
  export default {
    components: {
      AvatarCropper
    },
    data() {
      return {
        searchName: '', //查询关键字
        friendsList: [], //好友列表
        searchFriendsList: [], //好友搜索查询结果
        ids: [], //选择的好友id
        groupMember: [], //群聊成员

        frGroupAvatar:'',
        frGroupName: '',
        frGroupProfile: '',

        readonly: false,
        queryGroupId: 0,

        isAvatarCropper:false,
      }
    },
    created() {
      let groupid = sessionStorage.getItem('invite_group_id');
      sessionStorage.removeItem('invite_group_id');
      if (groupid) {
        this.readonly = true;
        this.queryGroupId = groupid;
      }

      this.friendsApi();
    },
    methods: {
      clickSelect(friend_id, friendInfo) {
        let idx = this.ids.indexOf(friend_id);
        if (idx == -1) {
          this.ids.push(friend_id);
          this.groupMember.push(friendInfo);
        } else {
          this.ids.splice(idx, 1);
          for (const i in this.groupMember) {
            if (this.groupMember[i].id == friend_id) {
              this.groupMember.splice(i, 1);
              break;
            }
          }
        }
      },
      searchKeyword() {
        let keyWords = this.searchName;
        if (keyWords == '') {
          this.searchFriendsList = this.friendsList;
          return;
        }

        this.searchFriendsList = [];
        if (this.friendsList.length > 0) {
          for (const info of this.friendsList) {
            if (info.friend_remark !== '') {
              if (info.friend_remark.match(this.searchName) != null) {
                this.searchFriendsList.push(info);
              }
            } else if (info.nickname.match(this.searchName) != null) {
              this.searchFriendsList.push(info);
            }
          }
        }
      },

      // 加载好友列表
      friendsApi() {
        let that = this
        groupChatMemebers({
          group_id: this.queryGroupId
        }).then(res => {
          if (res.code == 200) {
            that.friendsList = that.searchFriendsList = res.data;
          }
        })
      },

      fromSubmit() {
        let that = this,
          data = {
            group_avatar:this.frGroupAvatar,
            group_name: this.frGroupName,
            group_profile: this.frGroupProfile,
            uids: this.ids.join(',')
          };

        if (data.group_name == '') {
          alert('群聊名称不能为空...');
          return;
        }
        if (this.ids.length <= 2) {
          alert('群聊人数必须大于俩人...');
          return;
        }

        createGroupChatApi(data).then((res) => {
          if (res.code == 200) {
            that.$emit('close', 1);
          }
        });
      },

      //好友邀请提交
      fromSubmit2() {
        let that = this,
          data = {
            group_id: this.queryGroupId,
            uids: this.ids.join(',')
          };

        inviteGroupMember(data).then((res) => {
          if (res.code == 200) {
            that.$emit('close', 2);
          } else {
            this.$notify.info({
              title: '提示',
              message: '邀请好友失败...',
              position: 'bottom-right'
            });
          }
        });
      },

      showAvatarCropper(){
        this.isAvatarCropper = true;
      },

      closeAvatarCropper(type,avatar = ''){
        this.isAvatarCropper = false;
        if(type == 1){
          this.frGroupAvatar = avatar;
        }
      }
    }
  }
</script>

<style scoped>
  #launch-group-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }


  .launchgroup-from-panel {
    width: 550px;
    height: 550px;
    background: #FFFFFF;
    margin: auto auto;
    margin-top: calc(50vh - 225px);
  }


  .launchgroup-from-panel .panel-header {
    height: 45px;
    width: 100%;

    position: relative;
    box-shadow: 0 0 4px #ccc;
  }

  .launchgroup-from-panel .panel-header .close-btn {
    position: absolute;
    right: -40px;
    top: 0px;
    font-size: 26px;
    cursor: pointer;
    color: #FFF4F4;
  }

  .launchgroup-from-panel .panel-header p {
    width: 100%;
    text-align: center;
    height: 45px;
    line-height: 45px;
    font-size: 16px;

  }


  .launchgroup-from-panel .panel-body {
    height: calc(100% - 90px);
    width: 100%;
  }



  .panel-body .float-left {
    width: 60%;
  }

  .panel-body .float-right {
    width: 40%;
    margin-top: 3px;
  }

  .panel-body .float-left,
  .panel-body .float-right {
    float: left;
    height: 100%;
    box-shadow: inset 1px 1px 3px #fdf6f6;
    overflow: hidden;
  }


  .panel-body .float-left .group-from {
    padding: 20px 10px 5px 10px;
  }

  .panel-body .float-left .group-from li {
    height: 50px;
    width: 100%;
  }

  .group-avatar-box {
    height: 66px !important;
    position: relative;
  }


  .group-avatar-box div {
    display: inline-block;
    position: absolute;
    left: 59px;
    border-bottom: 1px dashed #ccc;
    width: 249px;
  }

  .group-avatar-box div img{
    width: 50px;height: 50px;box-shadow: 1px 1px 9px #cfc3c3;border-radius: 5px;
    cursor: pointer;
  }

  .group-avatar-box div span{
    height: 30px;
    width: 70px;
    display: inline-block;
    position: absolute;
    line-height: 30px;
    margin-left: 10px;
    top: 10px;
    cursor: pointer;
    color: #c4c5c7;
  }




  .panel-body .float-left .group-from li label {
    height: 45px;
    line-height: 47px;
    width: 50px;
    display: inline-block;
    text-align: right;
    color: #2dcee9;
    padding-right: 3px;
    font-size: 13px;
  }

  .panel-body .float-left .group-from li:nth-child(1) label i,
  .panel-body .float-left .group-from li:nth-child(3) label i {
    font-size: 14px;
  }

  .panel-body .float-left .group-from li:nth-child(2) label i {
    font-size: 16px;
  }

  .panel-body .float-left .group-from li input {
    height: 25px;
    width: 250px;
    border-bottom: 1px dashed #c8bdbd;
    text-indent: 3px;
    color: #a9a4a4;
    font-size: 12px;
  }


  .float-left input::-webkit-input-placeholder {
    color: #a9a4a4;
    font-size: 12px;
  }

  .friend-selectd-list {
    height: 250px;
    background: #fcfcfc;
    box-shadow: inset 3px 1px 8px 3px #f9f4f4;
    padding: 10px;
  }

  .height100{
    height: 100%;
  }

  .friend-selectd-list li {
    float: left;
    margin: 2px;
    cursor: pointer;
  }

  .friend-selectd-list li img {
    width: 40px;
    height: 40px;
    border-radius: 50%;

  }


  .no-select-member {
    color: #d1d0d0;
  }


  .launchgroup-from-panel .panel-footer {
    height: 45px;
    width: 100%;
    border-top: 1px solid #f2f2f2;
    text-align: center;
  }



  .float-right .list-title {
    height: 25px;
    line-height: 25px;
    background: #f7f7f7;
    font-size: 16px;
    color: #706e6e;
    padding: 5px;
  }

  .float-right .list-title .input-item {
    width: 205px;
    height: 25px;
    background: white;
    margin: 0 auto;
    border-radius: 3px;
    padding-left: 5px;
    position: relative;
  }

  .float-right .list-title .input-item input {
    position: absolute;
    top: 6px;
    width: 174px;
    color: #747474;
    text-indent: 3px;
    font-size: 12px;
  }

  .float-right .list-title .input-item input::-webkit-input-placeholder {
    color: #a9a4a4;
    font-size: 12px;
  }

  .float-right ul {
    height: calc(100% - 38px);
    overflow-y: auto;
  }


  .float-right ul::-webkit-scrollbar {
    width: 4px;
    background-color: #e4e4e5;
  }


  /* 滚动条上面的小滑块 */
  .float-right ul::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #C0BEBC;
  }

  .float-right ul li {
    padding: 10px;
    cursor: pointer;
    position: relative;
  }


  .float-right ul li:hover {
    background: #fcfcfc;
  }

  .float-right ul li img {
    width: 35px;
    height: 35px;
  }

  .float-right ul li .friend-nickname {
    width: 60%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    top: 10px;
    left: 52px;
    height: 35px;
    line-height: 35px;
  }

  .float-right ul li .select-btn {
    position: absolute;
    width: 32px;
    height: 35px;
    right: 3px;
    top: 10px;
    line-height: 35px;
    /* background: red; */
    text-align: center;
  }

  .float-right ul li .select-btn i {
    color: #ccc;
  }

  .float-right ul li .select-btn .i-color-green {
    color: #26bcfe !important;
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
</style>
