<template>
  <div class="lumen-user-group">
    <div class="group-box-header">
      <i class="iconfont icon-duanxin group-message" @click="send()"></i>
      <span>群设置</span>
      <i class="group-close iconfont icon-RectangleCopy" @click="$emit('close')"></i>
    </div>

    <div v-if="loadStatus != 1" class="group-box-main lumen-scrollbar">
      <div v-if="loadStatus == 0" class="group-history-tips" style="margin-top: 200px;text-align: center;">
        数据加载中，请耐心等待...
      </div>
      <div v-else class="group-history-tips" style="margin-top: 200px;text-align: center;cursor: pointer;" @click="groupDetailList">
        数据加载失败，点击我重新加载...
      </div>
    </div>
    <div v-else class="group-box-main lumen-scrollbar">
      <div class="group-setting-row">
        <span>群名称：</span>
        <span class="group-setting-title">{{groupMessage.groupName}}</span>
      </div>

      <div class="group-setting-row">
        <span>群主：</span>
        <span class="group-boss-name">{{ groupMessage.groupOwner }}</span>
      </div>

      <div class="group-setting-row">
        <span>我的群昵称：</span>
        <span v-if="!isEditRemark" style="display: inline-block;position: relative;">
          <span style="color: #67aaf1;font-size: 12px;height: 25px;line-height: 25px;">{{groupMessage.visitCard}} <span
              v-show="!groupMessage.visitCard">添加群名片</span> </span>
          <i class="iconfont icon-beizhu pointer edit-remark-icon" @click="isEditRemark = true;editRemarkText = groupMessage.visitCard"></i>
        </span>
        <span v-else>
          <input type="text" v-model="editRemarkText" @keyup.enter="editRemark" class="edit-input">
          <span class="input-submit" @click="isEditRemark = false">确认</span>
        </span>
      </div>

      <div class="group-setting-row">
        <span>消息免打扰：</span>
        <span style="width: 70%;text-align: right;display: inline-block;">
          <el-switch v-model="value5" active-color="#1ebafc" inactive-color="#ccc" active-value="100" inactive-value="0">
          </el-switch>
        </span>
      </div>

      <div class="group-setting-row">
        <span>群成员：</span>
        <span>{{groupMessage.members.length}} 人</span>
      </div>

      <div class="group-history-tips">
        群主已开启“新成员入群可查看最近100条聊天记录”
      </div>

      <div class="group-setting-row">
        <span>群简介</span>
      </div>
      <div class="group-history-tips">{{groupMessage.groupProfile?groupMessage.groupProfile:'暂无群简介'}}</div>

      <div class="group-setting-row">
        <p class="lumen-group-invite" @click="addGroupMembers"><i class="iconfont icon-jia "></i> 邀请好友</p>
      </div>

      <div class="group-setting-row">
        <div class="member-box">
          <div class="member-view-box">
            <i v-show="searchMember == ''" class="iconfont icon-sousuo i-sousuo"></i>
            <input type="text" placeholder="搜索群成员" v-model="searchMember" @input="searchKeyword" @keyup.enter="searchKeyword">
            <span @click="reveal = !reveal">
              <i v-if="reveal" class="iconfont icon-liebiao "></i>
              <i v-else class="iconfont icon-liebiao31"></i>
            </span>
          </div>

          <div v-if="reveal == false" class="view-chart1">
            <div class="listImg" v-for="member in searchList">
              <img :src="member.avatarurl" :onerror="$store.state.user.detaultAvatar" :title="member.nickname" @click="$store.commit('showSeekFriendBox', {type: 2,text: member.user_id})">
            </div>
            <div class="clear"></div>
          </div>
          <div v-else class="view-chart2">
            <table>
              <thead>
                <tr>
                  <th width="120px">昵称</th>
                  <th width="120px">名片</th>
                  <th width="80px" style="text-align: center;">性别</th>
                </tr>
                <tr>
                  <th colspan="3" style="border-bottom: 1px solid rgb(226, 223, 223);;height: 3px;padding: 0 5px 0 5px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="member in searchList" @click="$store.commit('showSeekFriendBox', {type: 2,text: member.user_id})">
                  <td width="120px">
                    <p>
                      <img :src="member.avatarurl" :onerror="$store.state.user.detaultAvatar">
                      {{member.nickname}}
                    </p>
                  </td>
                  <td width="120px">
                    <p>{{member.visit_card?member.visit_card:'-'}}</p>
                  </td>
                  <td width="80px" style="text-align: center;">
                    <span v-if="member.gender == 0">未知</span>
                    <span v-if="member.gender == 1">男</span>
                    <span v-if="member.gender == 2">女</span>
                  </td>
                </tr>

                <tr v-show="searchList.length == 0">
                  <td colspan="3" style="text-align: center;padding-top: 30px;">暂无相关搜索</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="clear"></div>
        </div>
      </div>
    </div>
    <div class="group-box-footer">
      <button>退出群聊</button>
    </div>

    <launch-group-chat v-if="isShow" :group-id="groupId" @close="isShow = false" @create-success="createSuccess"
      @invite-success="inviteSuccess"></launch-group-chat>
  </div>
</template>

<script>
  import {
    groupDetail,
    dismissGroup,
    setUserGroupCardApi,
    crateChatListApi
  } from '@/services/api';

  //创建群聊组件
  import LaunchGroupChat from '@/components/LaunchGroupChat';

  export default {
    name: 'lumen-user-group',
    props: {
      groupId: {
        type: [String, Number],
        default: null,
      }
    },
    watch: {
      'groupId': function(newval, oldval) {
        if (newval > 0) {
          this.groupDetailList();
        }
      }
    },
    components: {
      LaunchGroupChat
    },
    data() {
      return {
        loadStatus: 0,
        groupMessage: {
          groupAvatar: '',
          groupId: 0,
          groupName: '',
          groupOwner: '',
          groupProfile: '',
          members: [],
          visitCard: '',
        },

        isEditRemark: false,
        editRemarkText: '',
        searchMember: '',

        value5: false,
        reveal: true,
        searchList: [],
        isShow: false
      };
    },
    created() {
      if (parseInt(this.groupId) > 0) {
        this.groupDetailList();
      }
    },
    methods: {
      searchKeyword() {
        let keyWords = this.searchMember;
        if (keyWords == '') {
          this.searchList = this.groupMessage.members;
          return;
        }

        this.searchList = [];
        if (this.groupMessage.members.length > 0) {
          for (const info of this.groupMessage.members) {
            if (info.visit_card.match(keyWords) != null) {
              this.searchList.push(info);
            } else if (info.nickname.match(keyWords) != null) {
              this.searchList.push(info);
            }
          }
        }
      },

      groupDetailList() {
        let that = this;
        this.loadStatus = 0;
        groupDetail({
          group_id: that.groupId
        }).then((res) => {
          if (res.code == 200) {
            that.loadStatus = 1;
            that.searchMember = '';
            that.groupMessage.groupAvatar = res.data.group_avatar;
            that.groupMessage.groupId = res.data.group_id;
            that.groupMessage.userId = res.data.user_id;
            that.groupMessage.groupName = res.data.group_name;
            that.groupMessage.groupOwner = res.data.group_owner;
            that.groupMessage.groupProfile = res.data.group_profile;
            that.searchList = that.groupMessage.members = res.data.members;
            if (res.data.members) {
              for (let o of res.data.members) {
                if (o.user_id == this.$store.state.user.uid) {
                  that.groupMessage.visitCard = o.visit_card;
                  break;
                }
              }
            }
          }
        });
      },

      //邀请好友加入群聊
      addGroupMembers() {
        sessionStorage.setItem("invite_group_id", this.groupMessage.groupId);

        this.isShow = true;
        // this.$store.commit('showlaunchGroupChatBox', true);
      },

      //提交修改用户群名片
      editRemark() {
        let that = this;
        if (this.editRemarkText == '') {
          return;
        }

        if (this.groupMessage.visitCard == this.editRemarkText) {
          this.isEditRemark = false;
          return;
        }

        setUserGroupCardApi({
          group_id: this.groupId,
          visit_card: this.editRemarkText,
        }).then((res) => {
          if (res.code == 200) {
            that.isEditRemark = false;
            that.groupMessage.visitCard = that.editRemarkText;
          }
        });
      },

      createSuccess() {

      },
      inviteSuccess() {
        this.isShow = false;
        this.groupDetailList();
      },

      send(){
        this.$emit('send',{
          groupId:this.groupMessage.groupId,
          avatar:this.groupMessage.groupAvatar,
          groupName:this.groupMessage.groupName
        })
      }
    }
  }
</script>

<style scoped>
  .lumen-user-group {
    width: 100%;
    height: 100%;
  }

  .lumen-user-group .group-box-header {
    height: 50px;
    box-shadow: 1px 4px 5px 0px #cccccc45;
    line-height: 50px;
    text-align: center;
    position: relative;
  }

  .lumen-user-group .group-box-header .group-message {
    position: absolute;
    left: 15px;
    font-size: 16px;
    cursor: pointer;
  }

  .lumen-user-group .group-box-header .group-close {
    position: absolute;
    right: 15px;
    font-size: 28px;
    cursor: pointer;
  }

  .lumen-user-group .group-box-main {
    height: calc(100% - 100px);
    height: -moz-calc(100% - 100px);
    height: -webkit-calc(100% - 100px);
    overflow-y: auto;
  }

  .group-setting-row {
    position: relative;
    padding: 16px 16px 0;
    min-height: 18px;
    font-size: 14px;
  }

  .group-setting-row .edit-remark-icon {
    position: absolute;
    margin-left: 5px;
    color: rgb(169, 184, 187);
    top: 6px
  }

  .group-setting-row .edit-input {
    width: 46%;
    height: 25px;
    line-height: 25px;
    border: 1px solid #92CBFF;
    padding-left: 5px;
    border-radius: 3px;
  }

  .group-setting-row .input-submit {
    width: 55px;
    text-align: center;
    height: 25px;
    line-height: 25px;
    background-color: #008CEE;
    border-radius: 2px;
    display: inline-block;
    color: #fff !important;
    font-size: 12px;
    margin-left: 10px;
    cursor: pointer;
  }

  .group-setting-row .group-setting-title {
    max-width: 250px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: bottom;
  }

  .group-setting-row .group-boss-name {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    max-width: 180px;
    position: relative;
    top: 4px;
  }

  .group-history-tips {
    font-size: 12px;
    color: #b1b1b1;
    margin-top: 5px;
    padding-left: 16px;
    padding-right: 16px;
  }


  .group-setting-row .lumen-group-invite {
    height: 30px;
    background: #fdf2f2;
    line-height: 30px;
    text-align: center;
    color: #f3848e;
    cursor: pointer;
    border-radius: 2px;
  }

  .group-setting-row .lumen-group-invite:active {
    color: #CCCCCC;
  }

  .lumen-user-group .group-box-footer {
    height: 50px;
    background: #f7f5f5a8;
    text-align: center;
    line-height: 50px;
  }

  .lumen-user-group .group-box-footer button {
    width: 180px;
    height: 35px;
    background: #ed3c3b;
    border-radius: 3px;
    color: #ffff;
    cursor: pointer;
    font-size: 12px;
  }

  .lumen-user-group .member-box {
    box-shadow: -2px -3px 18px #eae4e4;
    padding-top: 10px;
    cursor: pointer;
    min-height: 180px;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .member-view-box input::-webkit-input-placeholder {
    color: #CCC9C9;
    font-size: 13px;
  }

  .member-view-box {
    width: 100%;
    height: 30px;
    margin-top: 20px;
    margin-bottom: 15px;
    position: relative;
  }

  .member-view-box .i-sousuo {
    color: rgb(179, 176, 176);
    position: absolute;
    left: 96px;
    top: 6px;
  }

  .member-view-box input {
    width: 85%;
    height: 25px;
    line-height: 25px;
    border-radius: 15px;
    text-align: center;
    border: 1px solid #d6d6d6;
    color: #b3b0b0;
    font-size: 13px;
    margin-left: 8px;
  }

  .member-view-box span {
    position: relative;
  }

  .member-view-box span i {
    font-size: 24px;
    top: -3px;
    left: 10px;
    position: absolute;
    color: #ccc;
  }

  .view-chart2 table thead th {
    font-weight: 200;
    color: #908d8d;
    text-align: left;
    padding-left: 10px;
    font-size: 14px;
  }

  .view-chart2 table tbody tr {
    height: 30px;
    line-height: 30px;
  }

  .view-chart2 table tbody tr td {
    text-align: left;
    font-size: 12px;
    color: #908d8d;
    padding-left: 10px;
  }

  .view-chart2 table tbody tr td p {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    width: 120px;
    height: 32px;
    line-height: 32px;
    position: relative;
  }

  .view-chart2 table tbody tr td img {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    position: inherit;
    top: 4px;
  }


  .member-box .view-chart1 {
    min-height: 80px;
    padding-bottom: 20px;
  }

  .member-box .listImg {
    width: 52px;
    height: 40px;
    float: left;
    text-align: center;
    margin-top: 10px;
    font-size: 12px;
    cursor: pointer;
  }


  .member-box .listImg>img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 auto;
  }

  .member-box .addGroupFired {
    border: 1px dashed #c3bbbb;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: block;
    margin: 0px 5px 5px 4px;
    line-height: 40px;
    color: #c3bbbb;
  }
</style>
