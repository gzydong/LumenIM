<template>
  <div class="box-rightGroup">
    <header>群聊信息({{groupMessage.members.length}}) <span class="iconfont icon-guanbi11" @click="closeGroup"></span></header>
    <main>
      <div class="title"><label>群名称:</label><span>{{groupMessage.groupName}}</span></div>
      <div class="title"><label>群主:</label><span>{{ groupMessage.groupOwner }}</span></div>
      <div class="title line-height-30"><label>群简介:</label><span>{{ groupMessage.grouProfile?groupMessage.grouProfile:'暂无简介' }}</span></div>
      <div class="packMember">
        <div class="listImg" v-for="member in groupMessage.members">
          <img :src="member.avatarurl" :onerror="detaultAvatar" :title="member.nickname" @click="catFriendInfo(member)" >
          <p>{{ member.nickname }}</p>
        </div>

        <div class="listImg">
          <span class="addGroupFired" @click="addGroupMembers" ><i class="iconfont icon-jia "></i></span>
        </div>

        <div class="clear"></div>
      </div>
    </main>

    <footer>
      <span @click="sendMessage">发消息</span>
      <span @click="signOutGroup">退出群聊</span>
    </footer>
  </div>
</template>

<script>
  import {
    groupDetail,
    dismissGroup
  } from '@/services/api.js'

  export default {
    props: {
      groupId: {
        type: Number,
        default: null,
      }
    },
    watch: {
      'groupId': function(snew, old) {
        this.groupDetailList();
      }
    },
    data() {
      return {
        detaultAvatar: "this.src='/static/image/detault-avatar.jpg'",
        groupMessage: {
          groupAvatar: '',
          groupId: 0,
          groupName: '',
          groupOwner: '',
          members: []
        }
      };
    },
    created() {
      this.groupDetailList()
    },
    methods: {
      groupDetailList() {
        let that = this;
        groupDetail({
          group_id: that.groupId
        }).then((res) => {
          if (res.code == 200) {
            that.groupMessage.groupAvatar = res.data.group_avatar,
            that.groupMessage.groupId = res.data.group_id,
            that.groupMessage.groupName = res.data.group_name,
            that.groupMessage.groupOwner = res.data.group_owner,
            that.groupMessage.grouProfile = res.data.group_profile,
            that.groupMessage.members = res.data.members
          }
        });
      },

      closeGroup: function() {
        this.$emit("close", null);
      },

      //发送群聊
      sendMessage: function() {
        this.$parent.crateChatList(this.groupMessage.groupId, 2);
      },

      //退出群聊
      signOutGroup: function() {
        let that = this;
        this.$confirm('确认退出群聊, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dismissGroup({
            group_id: that.groupId
          }).then((res) => {
            if (res.code == 200) {
              that.$notify({
                title: '退出成功',
                type: 'success'
              });
              that.$parent.userGroupsList();
            }
          });
        }).catch(() => {
          that.$notify({
            title: '已取消',
            type: 'warning'
          });
        });

      },

      //查看好友信息
      catFriendInfo(member){
        sessionStorage.setItem("query_mobile",member.mobile);
        this.$parent.subgroup.seekFriend.isOpen = true;
      },

      //邀请好友加入群聊
      addGroupMembers(){
        sessionStorage.setItem("invite_group_id",this.groupMessage.groupId);
        this.$parent.subgroup.launchGroupChat.isOpen = true;
      },
    }
  }
</script>

<style scoped>
  /* 滚动条的整体样式 */
  .box-rightGroup main::-webkit-scrollbar {
    width: 3px;
    background-color: #f5f5f5;
  }

  /* 滚动条上面的小滑块 */
  .box-rightGroup main::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #D2D2D2;
  }

  .box-rightGroup {
    width: 350px;
    height: 500px;
    margin: 100px auto;
    margin-top: 135px;
    -webkit-box-shadow: #666 0px 0px 10px;
    box-shadow: #ded2d2 0px 0px 20px;
    border-radius: 5px;
    position: relative;
  }

  .box-rightGroup header {
    height: 50px;
    line-height: 50px;
    box-shadow: 0px 1px 13px 0px #eae6e6;
    text-align: center;
    font-size: 16px;
    position: relative;
  }

  .box-rightGroup header>span {
    font-size: 27px;
    position: absolute;
    top: 0px;
    right: 15px;
    cursor: pointer;
  }

  .box-rightGroup main {
    overflow-y: auto;
    height: 385px;
    padding: 10px;
  }

  .box-rightGroup main .title {
    min-height: 40px;
    line-height: 40px;
    font-size: 14px;
    border-bottom: 1px dashed #cae4ec;
  }

  .box-rightGroup main .line-height-30 {
    line-height: 25px !important;
    padding-top: 10px;
  }

  .box-rightGroup .title label {
    width: 60px;
    display: inline-block;
  }

  .box-rightGroup .title span {
    color: #636161;
    font-size: 13px;
  }

  .box-rightGroup main>.title .groupName {
    padding-left: 10px;
    background: #F5F5F5 !important;
  }

  .packMember {
    width: 100%;
    box-shadow: -2px -3px 18px #eae4e4;
    margin-top: 10px;
  }

  .packMember .listImg {
    width: 64px;
    height: 79px;
    float: left;
    text-align: center;
    margin-top: 10px;
    font-size: 12px;
    cursor: pointer;
  }


  .packMember .listImg>img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 0 auto;
  }

  .box-rightGroup footer {
    width: 100%;
    height: 43px;
    line-height: 43px;
    position: absolute;
    text-align: center;
    border-top: 1px solid #efebeb;
  }

  .box-rightGroup footer>span {
    width: 49%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    font-size: 14px;
    color: #43b735;
    cursor: pointer;
  }

  .box-rightGroup footer>span:last-child {
    border-left: 1px solid #E4E4E5;
    color: #ED3C3B;
  }

  .borderGroup {
    width: 55px;
    height: 55px;
    line-height: 55px;
    text-align: center;
    top: 15px;
    float: left;
    border-radius: 50px;
    border: 1px solid #E4E4E5;
    margin: 0 auto;
    position: relative;
    left: 8px;
  }

  .addGroupFired {
    border: 1px dashed #c3bbbb;
    border-radius: 50%;
    width: 46px;
    height: 46px;
    display: block;
    margin: 5px 5px 5px 8px;
    line-height: 46px;
    color: #c3bbbb;
  }

  .addGroupFired:active {
    border: 1px dashed #a2d8ff;
    color: #a2d8ff;
  }

  .packMember .listImg>p {
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    /*禁止换行显示*/
    white-space: nowrap;
  }
</style>
