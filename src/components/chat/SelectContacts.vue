<template>
  <div class="base-mask">
    <div class="container no-user-select" v-outside="close">
      <el-container class="container no-user-select">
        <el-header class="padding0 header" height="50px">
          <span>联系列表</span>
          <i class="iconfont icon-guanbi11 close-btn" @click="close"></i>
        </el-header>
        <el-main class="main padding0">
          <el-container class="contacts-container">
            <el-aside width="250px">
              <div class="contacts-search-box">
                <i class="contacts-search-icon el-icon-search"></i>
                <input type="text" v-model="keywords" class="contacts-search" placeholder="搜索关键词 ...">
              </div>

              <div class="lumen-scrollbar contacts-items" style="overflow-y: scroll;">
                <div class="contacts-item" v-for="(item,index) in search" @click="triggerContacts(item)">
                  <div class="contacts-avatar">
                    <div class="avatar-text">{{item.nickname.substr(0,1)}}</div>
                  </div>
                  <div class="contacts-nickname">
                    <div class="flag" :class="{'blue-flag':item.type == 2}">{{item.type == 1?'友':'群'}}</div>
                    <span>{{item.nickname}}</span>
                  </div>
                  <div class="contacts-checkedbox">
                    <i class="el-icon-success" :class="{'checked':item.checked}"></i>
                  </div>
                </div>
              </div>
            </el-aside>
            <el-main style="padding: 12px 5px 0px 10px;">
              <div class="contacts-title">
                <span>已选择：{{selected.length}}个</span>
              </div>

              <div class="lumen-scrollbar contacts-items contacts-items-selected">
                <div class="contacts-item" v-for="(item,index) in selected">
                  <div class="contacts-avatar">
                    <div class="avatar-text">{{item.nickname.substr(0,1)}}</div>
                  </div>
                  <div class="contacts-nickname">
                    <p class="flag" :class="{'blue-flag':item.type == 2}">{{item.type == 1?'友':'群'}}</p>
                    <span>{{item.nickname}}</span>
                  </div>
                  <div class="contacts-checkedbox">
                    <i class="el-icon-error" @click="delContacts(item)"></i>
                  </div>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-main>
        <el-footer class="padding0 footer" height="50px">
          <p class="tips">已勾选：{{selected.length}}个</p>
          <el-button size="medium" @click="close">取消选择</el-button>
          <el-button size="medium" type="primary" @click="confirm">确定选择</el-button>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>
<script>
  import {
    friendsServ,
    findUserGroupsServ
  } from "@/api/user";

  export default {
    name: "container",
    data() {
      return {
        contacts: [],
        search: [],
        keywords: '',
      };
    },
    computed: {
      selected() {
        return this.contacts.filter((item, index) => {
          return item.checked;
        });
      }
    },
    watch: {
      keywords(val) {
        if (val == '') {
          this.search = this.contacts;
        } else {
          this.search = this.contacts.filter((item, index) => {
            return item.nickname.match(this.keywords) != null;
          });
        }
      },
      contacts(arr) {
        if (this.keywords == '') {
          this.search = arr;
        }
      }
    },
    created() {
      this.loadFriends();
      this.loadUserGroups();
    },
    methods: {
      //触发选择联系人事件
      triggerContacts(item) {
        let index = this.contacts.findIndex(val => {
          return val.index_name == item.index_name
        });

        this.contacts[index].checked = !this.contacts[index].checked;
      },
      //取消选中的联系人
      delContacts(item) {
        let index = this.contacts.findIndex(val => {
          return val.index_name == item.index_name
        });

        this.contacts[index].checked = false;
      },
      //移除所有选中选项
      delAll() {
        this.contacts.forEach((item, i) => {
          this.contacts[i].checked = false;
        });
      },
      //关闭窗口
      close() {
        this.delAll();
        this.$emit("close");
      },
      //确认按钮点击事件
      confirm() {
        let arr = this.selected.map(item => {
          return {
            id: item.id,
            type: item.type,
          };
        });

        this.$emit("confirm", arr);
      },

      //加载好友列表
      loadFriends() {
        friendsServ().then(res => {
          if (res.code == 200) {
            for (let o of res.data) {
              this.contacts.push({
                id: o.id,
                type: 1,
                index_name: `1_${o.id}`,
                nickname: o.friend_remark ? o.friend_remark : o.nickname,
                avatar: o.avatar,
                checked: false
              });
            }
          }
        });
      },

      //加载群聊列表接口
      loadUserGroups() {
        findUserGroupsServ().then(res => {
          if (res.code == 200) {
            for (let o of res.data) {
              this.contacts.push({
                id: o.id,
                type: 2,
                index_name: `2_${o.id}`,
                nickname: o.group_name,
                avatar: o.avatar,
                checked: false
              });
            }
          }
        });
      },
    }
  };

</script>
<style scoped>
  .base-mask {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    width: 500px;
    height: 600px;
    border-radius: 2px;
    overflow: hidden;
    background: white;
  }

  .container .header {
    height: 50px;
    line-height: 50px;
    background-color: white;
    padding-left: 10px;
    border-bottom: 1px solid #e4e4e4;
  }

  .container .header .close-btn {
    position: absolute;
    right: 12px;
    top: 0px;
    font-size: 24px;
    cursor: pointer;
  }

  .container .main {
    height: 480px;
    padding: 10px 5px;
  }

  .contacts-container {
    height: 100%;
    width: 100%;
  }

  .contacts-search-box {
    height: 40px;
    padding-top: 10px;
    position: relative;
  }

  .contacts-search-box .contacts-search {
    width: 200px;
    display: block;
    height: 32px;
    padding: 0 10px 0 30px;
    font-size: 13px;
    color: #4e4b4b;
    border: 1px solid #e8e6e6;
  }

  .contacts-search-box .contacts-search:focus {
    border-color: #66b1ff;
  }

  .contacts-search-box .contacts-search-icon {
    position: absolute;
    top: 19px;
    left: 10px;
    color: #ccc;
  }

  .contacts-search-box .contacts-search::-webkit-input-placeholder {
    font-size: 13px;
    color: #ccc;
  }

  .contacts-title {
    height: 30px;
    line-height: 30px;
    text-align: right;
    border-bottom: 1px solid rgb(226, 219, 219);
    color: #a5a0a0;
    font-weight: 400;
  }

  .contacts-items {
    height: 430px;
    overflow-y: auto;
    padding-right: 5px;
  }

  .contacts-items .contacts-item {
    width: 100%;
    height: 50px;
    background: #f7f7f7;
    margin-bottom: 8px;
    cursor: pointer;
  }

  .contacts-items .contacts-item:hover {
    background-color: #f3f0f0;
  }

  .contacts-items .contacts-item .contacts-avatar {
    width: 50px;
    height: 50px;
    float: left;
  }

  .contacts-items .contacts-item .contacts-avatar .avatar-text {
    width: 35px;
    height: 35px;
    background: #8f8ff5;
    border-radius: 3px;
    margin: auto;
    margin-top: 7px;
    text-align: center;
    line-height: 35px;
    color: white;
  }

  .contacts-items .contacts-item .contacts-nickname {
    width: 145px;
    height: 50px;
    line-height: 50px;
    float: left;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .contacts-items .contacts-item .contacts-nickname .flag {
    display: inline-table;
    width: 15px;
    height: 16px;
    background: #e6a23c;
    text-align: center;
    font-size: 10px;
    line-height: 20px;
    color: white;
    border-radius: 3px;
    position: relative;
    top: -2px;
  }

  .contacts-items .contacts-item .contacts-nickname .blue-flag {
    background-color: #409eff;
  }

  .contacts-items .contacts-item .contacts-checkedbox {
    width: 42px;
    height: 50px;
    float: left;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }

  .contacts-items .contacts-item .contacts-checkedbox i {
    color: #cccccc;
  }

  .contacts-items .contacts-item .contacts-checkedbox .checked {
    color: #409eff !important
  }

  .contacts-items .contacts-item .contacts-checkedbox .el-icon-error:hover {
    color: #a5a5a5;
  }

  .contacts-items-selected {
    margin-top: 6px;
  }

  .contacts-items-selected .contacts-item {
    background: #ffffff;
    border: 1px dashed #d6d6d6;
  }

  .contacts-items-selected .contacts-item:hover {
    border-color: #f3f0f0;
  }

  .contacts-items-selected .contacts-item .contacts-nickname {
    width: 130px;
  }

  .contacts-items-selected .contacts-item .contacts-checkedbox {
    width: 30px;
  }

  .container .footer {
    height: 50px;
    text-align: right;
    padding-right: 20px;
    line-height: 50px;
    border-top: 1px solid #f3f2f2;
    position: relative;
  }

  .container .footer>>>button {
    font-weight: 400;
    border-radius: 0;
  }

  .container .footer .tips {
    position: absolute;
    top: 0;
    left: 10px;
    font-size: 13px;
    color: #b9b4b4;
  }

</style>
