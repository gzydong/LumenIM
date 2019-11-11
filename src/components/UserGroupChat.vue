<template>
  <div class="box-rightGroup">
    <header>
      群聊信息({{groupMessage.members.length}})
      <span class="iconfont icon-guanbi11" @click="closeGroup"></span>
      <span class="cus-icon-refresh" @click="groupDetailList"><i class="iconfont icon-liebiaoxunhuan"></i></span>
    </header>
    <main class="panel-body">
      <div class="title"><label>群名称:</label><span>{{groupMessage.groupName}}</span></div>
      <div class="title"><label>群主:</label>
      <span style="margin-left: -5px;">{{ groupMessage.groupOwner }}</span>
      <span class="cat-group-owner" @click="catFriendInfo(groupMessage.userId,2)" >查看</span>
      </div>
      <div class="title">
        <label>群名片:</label>
        <span v-if="!isEditRemark" class="edit-remark-span">
          {{groupMessage.visitCard}} <span v-show="!groupMessage.visitCard">添加群名片</span> <i class="iconfont icon-beizhu pointer edit-remark-icon"
            @click="isEditRemark = true;editRemarkText = groupMessage.visitCard"></i>
        </span>
        <span v-else>
          <input type="text" v-model="editRemarkText" @keyup.enter="editRemark" class="edit-input"><span class="input-submit"
            @click="editRemark">确认</span>
        </span>
      </div>
      <div class="title line-height-30"><label>群简介:</label><span>{{ groupMessage.grouProfile?groupMessage.grouProfile:'暂无简介' }}</span></div>

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
            <img :src="member.avatarurl" :onerror="$store.state.user.detaultAvatar" :title="member.nickname" @click="catFriendInfo(member.mobile,1)">
            <p>{{ member.nickname }}</p>
          </div>

          <div v-if="searchList.length > 0" class="listImg">
            <span class="addGroupFired" @click="addGroupMembers"><i class="iconfont icon-jia "></i></span>
          </div>

        </div>
        <div v-else class="view-chart2">
          <table>
            <thead>
              <tr>
                <th width="120">昵称</th>
                <th width="120">名片</th>
                <th width="80" style="text-align: center;">性别</th>
              </tr>
              <tr>
                <th colspan="3" style="border-bottom: 1px solid rgb(226, 223, 223);;height: 3px;padding: 0 5px 0 5px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in searchList" @click="catFriendInfo(member.mobile,1)">
                <td>
                  <p>
                    <img :src="member.avatarurl" :onerror="$store.state.user.detaultAvatar">
                    {{member.nickname}}
                  </p>
                </td>
                <td>
                  <p>{{member.visit_card?member.visit_card:'-'}}</p>
                </td>
                <td style="text-align: center;">
                  <span v-if="member.gender == 0">未知</span>
                  <span v-if="member.gender == 1">男</span>
                  <span v-if="member.gender == 2">女</span>
                </td>
              </tr>
            </tbody>
          </table>
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
    dismissGroup,
    setUserGroupCardApi
  } from '@/services/api'

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
        groupMessage: {
          groupAvatar: '',
          groupId: 0,
          groupName: '',
          groupOwner: '',
          members: [],
          visitCard: '',
        },
        isEditRemark: false,
        editRemarkText: '',
        searchMember: '',

        reveal: false,
        searchList:[]
      };
    },
    created() {
      this.groupDetailList()
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
        groupDetail({
          group_id: that.groupId
        }).then((res) => {
          if (res.code == 200) {
            that.searchMember = '';
            that.groupMessage.groupAvatar = res.data.group_avatar;
            that.groupMessage.groupId = res.data.group_id;
            that.groupMessage.userId = res.data.user_id;
            that.groupMessage.groupName = res.data.group_name;
            that.groupMessage.groupOwner = res.data.group_owner;
            that.groupMessage.grouProfile = res.data.group_profile;
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
      catFriendInfo(value,type = 1) {
        sessionStorage.setItem("query_mobile", `${value},${type}`);
        this.$parent.subgroup.seekFriend.isOpen = true;
      },

      //邀请好友加入群聊
      addGroupMembers() {
        sessionStorage.setItem("invite_group_id", this.groupMessage.groupId);
        this.$parent.subgroup.launchGroupChat.isOpen = true;
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
      }
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

  .box-rightGroup header span:first-child {
    font-size: 27px;
    position: absolute;
    top: 0px;
    right: 15px;
    cursor: pointer;
  }

  .box-rightGroup header .cus-icon-refresh {
    font-size: 27px;
    color: #9696f7;
    cursor: pointer;
  }

  .box-rightGroup header .cus-icon-refresh:active{
    color: #CCC9C9;
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

  .title .cat-group-owner{
    font-size: 12px;color: #00D7FF !important;cursor: pointer;;margin-left: 8px;
  }

  .box-rightGroup main .line-height-30 {
    line-height: 25px !important;
    padding-top: 10px;
  }


  .panel-body .edit-remark-span {
    position: relative;
    margin-left: -5px;
  }


  .edit-remark-span span {
    color: rgb(169, 184, 187) !important;
    font-size: 12px;
  }

  .panel-body .edit-remark-icon {
    position: absolute;
    margin-left: 5px;
    color: rgb(169, 184, 187);
  }

  .panel-body .edit-input {
    width: 50%;
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
    color: #fff !important;
    font-size: 12px;
    margin-left: 10px;
    cursor: pointer;
  }

  .panel-body .input-submit:active {
    background-color: #59bbff;
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

  .member-box {
    width: 100%;
    box-shadow: -2px -3px 18px #eae4e4;
    margin-top: 30px;
    padding-top: 10px;
    cursor: pointer;
    min-height: 200px;
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
    left: 100px;
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
    background: #f5f5f5;
    margin-left: 8px;
  }

  .member-view-box input::-webkit-input-placeholder {
    color: #CCC9C9;
    font-size: 13px;
    background: #f5f5f5;
  }

  .member-view-box span {
    position: relative;
  }

  .member-view-box span i {
    font-size: 24px;
    top: 2px;
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

  .member-box .listImg {
    width: 64px;
    height: 79px;
    float: left;
    text-align: center;
    margin-top: 10px;
    font-size: 12px;
    cursor: pointer;
  }


  .member-box .listImg>img {
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

  .member-box .listImg>p {
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    /*禁止换行显示*/
    white-space: nowrap;
  }
</style>
