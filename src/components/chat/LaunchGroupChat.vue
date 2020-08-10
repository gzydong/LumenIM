<template>
  <div class="base-mask animated fadeIn">
    <div class="container" v-outside="close">
      <el-container class="hv100">
        <el-header class="padding0 header" height="50px">
          <span>{{queryGroupId==0?'创建群聊':'请选择需要邀请的好友'}}</span>
          <i class="close-btn el-icon-close" @click="close"></i>
        </el-header>
        <el-main class="main padding0">
          <el-container class="hv100">
            <el-main class="padding0">
              <el-container class="hv100">
                <el-header class="padding0" height="100px" v-show="!readonly">
                  <ul class="group-from">
                    <li>
                      <label>群名称:</label>
                      <input type="text" v-model="frGroupName" placeholder="请设置群名称(必填)" @keyup.enter="fromSubmit"
                        :readonly="readonly" />
                    </li>
                    <li>
                      <label>群简介:</label>
                      <input type="text" v-model="frGroupProfile" placeholder="请设置群简介(选填)" @keyup.enter="fromSubmit"
                        :readonly="readonly" />
                    </li>
                  </ul>
                </el-header>
                <el-main class="padding0 friend-selectd-list lumen-scrollbar">
                  <div v-if="groupMember.length == 0" class="no-select-member">
                    {{queryGroupId==0?'您还未选择群聊好友...':'您还未选择需要邀请的好友...'}}</div>
                  <ul v-else>
                    <li v-for='member in groupMember' @click="clickSelect(member.id,member)"
                      :title="member.friend_remark?member.friend_remark:member.nickname">
                      <img :src="member.avatar" :onerror="$store.state.user.detaultAvatar">
                    </li>
                  </ul>
                </el-main>
              </el-container>
            </el-main>
            <el-aside width="220px" class="padding0">
              <el-container class="hv100">
                <el-header class="padding0 list-title" height="40px">
                  <div class="input-item">
                    <i class="iconfont icon-sousuo"></i>
                    <input type="text" v-model="searchName" placeholder="搜索" @input="searchKeyword"
                      @keyup.enter="searchKeyword">
                  </div>
                </el-header>
                <el-main class="lumen-scrollbar padding0 friend-list">
                  <ul>
                    <li v-for='(friend,idx) in searchFriendsList' @click="clickSelect(friend.id,friend)">
                      <div v-if="friend.avatar">
                        <img :src="friend.avatar" :onerror="$store.state.user.detaultAvatar" />
                      </div>
                      <div v-else class="avatar-text">
                        {{(friend.friend_remark?friend.friend_remark:friend.nickname).substr(0,1)}}
                      </div>

                      <span
                        class="friend-nickname">{{ friend.friend_remark?friend.friend_remark:friend.nickname }}</span>
                      <span class="select-btn">
                        <i class="el-icon-success" v-bind:class="{'i-color-green': ids.indexOf(friend.id) >= 0  }"></i>
                      </span>
                    </li>
                  </ul>
                </el-main>
              </el-container>
            </el-aside>
          </el-container>
        </el-main>
        <el-footer height="50px" class="padding0 footer">
          <el-button size="small" style="width: 100px;" @click="close">取消</el-button>
          <el-button type="primary" size="small" v-if="queryGroupId==0" @click="createSubmit">创建群聊({{ ids.length }})
          </el-button>
          <el-button type="primary" size="small" v-else @click="inviteSubmit">立即邀请({{ ids.length }})</el-button>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
  import {
    createGroupServ,
    inviteGroupServ,
    getGroupMembersServ
  } from '@/api/group';

  import AvatarCropper from '@/components/layout/AvatarCropper';
  export default {
    name: 'launch-group-chat',
    components: {
      AvatarCropper
    },
    props: {
      groupId: {
        type: [String, Number],
        default: null,
      }
    },
    data() {
      return {
        searchName: '', //查询关键字
        friendsList: [], //好友列表
        searchFriendsList: [], //好友搜索查询结果
        ids: [], //选择的好友id
        groupMember: [], //群聊成员

        frGroupAvatar: '',
        frGroupName: '',
        frGroupProfile: '',

        readonly: false,
        queryGroupId: 0,

        isAvatarCropper: false,
      }
    },
    created() {
      if (this.groupId > 0) {
        this.readonly = true;
        this.queryGroupId = this.groupId;
      }

      this.friendsApi();
    },
    methods: {
      close() {
        this.$emit('close');
      },
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
        getGroupMembersServ({
          group_id: this.queryGroupId
        }).then(res => {
          if (res.code == 200) {
            that.friendsList = that.searchFriendsList = res.data;
          }
        });
      },

      //创建聊天群
      createSubmit() {
        let that = this,
          data = {
            group_avatar: this.frGroupAvatar,
            group_name: this.frGroupName,
            group_profile: this.frGroupProfile,
            uids: this.ids.join(',')
          };

        if (data.group_name == '') {
          alert('群聊名称不能为空...');
          return;
        }
        if (this.ids.length < 2) {
          alert('群聊人数必须大于俩人...');
          return;
        }

        createGroupServ(data).then((res) => {
          if (res.code == 200) {
            that.$emit('create-success', res.data);
          } else {
            alert('创建群聊失败');
          }
        });
      },

      //好友邀请提交
      inviteSubmit() {
        let that = this;
        inviteGroupServ({
          group_id: this.queryGroupId,
          uids: this.ids.join(',')
        }).then((res) => {
          if (res.code == 200) {
            that.$emit('invite-success');
          } else {
            alert('邀请好友失败...');
          }
        });
      },

      showAvatarCropper() {
        this.isAvatarCropper = true;
      },

      closeAvatarCropper(type, avatar = '') {
        this.isAvatarCropper = false;
        if (type == 1) {
          this.frGroupAvatar = avatar;
        }
      }
    }
  }

</script>

<style scoped>
  .base-mask {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    width: 550px;
    height: 550px;
    border-radius: 3px;
    overflow: hidden;
    background-color: white;
  }

  .container .header {
    height: 50px;
    line-height: 50px;
    position: relative;
    text-indent: 20px;
    border-bottom: 1px solid #f5eeee;
  }

  .container .header .close-btn {
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 20px;
    cursor: pointer;
  }

  .container .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
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

  .group-avatar-box div img {
    width: 50px;
    height: 50px;
    box-shadow: 1px 1px 9px #cfc3c3;
    border-radius: 50%;
    cursor: pointer;
  }

  .group-avatar-box div span {
    height: 30px;
    width: 70px;
    display: inline-block;
    position: absolute;
    line-height: 30px;
    margin-left: 25px;
    top: 10px;
    cursor: pointer;
    color: #c4c5c7;
  }

  .group-from li label {
    height: 45px;
    line-height: 47px;
    width: 50px;
    display: inline-block;
    text-align: right;
    color: #606266;
    padding-right: 3px;
    font-size: 13px;
  }

  .group-from li:nth-child(1) label i,
  .group-from li:nth-child(3) label i {
    font-size: 14px;
  }

  .group-from li:nth-child(2) label i {
    font-size: 16px;
  }

  .group-from li input {
    height: 25px;
    width: 250px;
    text-indent: 3px;
    color: #a9a4a4;
    font-size: 12px;
    border-bottom: 1px solid #efebeb;
  }

  input::-webkit-input-placeholder {
    color: #a9a4a4;
    font-size: 12px;
  }

  .friend-selectd-list {
    background-color: #fdfafa;
    padding: 5px;
  }

  .friend-selectd-list li {
    float: left;
    margin: 2px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    overflow: hidden;
  }

  .friend-selectd-list li img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .friend-selectd-list li img:hover {
    transform: rotate(7deg);
    -ms-transform: rotate(7deg);
    /* IE 9 */
    -moz-transform: rotate(7deg);
    /* Firefox */
    -webkit-transform: rotate(7deg);
    /* Safari 和 Chrome */
    -o-transform: rotate(7deg);
    /* Opera */
  }

  .no-select-member {
    color: #cecece;
    margin-top: 15px;
    height: 83%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .list-title {
    background: #f7f7f7;
    font-size: 16px;
    color: #706e6e;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .list-title .input-item {
    width: 95%;
    height: 30px;
    background: white;
    border-radius: 3px;
    padding-left: 5px;
    position: relative;
  }

  .list-title .input-item input {
    position: absolute;
    top: 6px;
    width: 174px;
    color: #747474;
    padding-left: 20px;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
  }

  .list-title .input-item input::-webkit-input-placeholder {
    color: #a9a4a4;
    font-size: 12px;
  }

  .list-title .input-item i {
    position: absolute;
    top: 8px;
    z-index: 1;
  }

  .friend-list ul li {
    padding: 10px;
    cursor: pointer;
    position: relative;
  }

  .friend-list ul li:hover {
    background: #fcfcfc;
  }

  .friend-list ul li img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }

  .friend-list ul li .avatar-text {
    width: 35px;
    height: 35px;
    line-height: 35px;
    border-radius: 50%;
    background: #8f8ff5;
    text-align: center;
    color: white;
  }

  .friend-list ul li:nth-child(odd)>>>.avatar-text {
    background: #fd8866;
  }

  .friend-list ul li .friend-nickname {
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

  .friend-list ul li .select-btn {
    position: absolute;
    width: 32px;
    height: 35px;
    right: 3px;
    top: 10px;
    line-height: 35px;
    text-align: center;
  }

  .friend-list ul li .select-btn i {
    color: #ccc;
  }

  .friend-list ul li .select-btn .i-color-green {
    color: #26bcfe !important;
  }

</style>
