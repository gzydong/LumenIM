<template>
  <div class="base-mask">
    <div class="container" v-outside="close">
      <el-container class="hv100">
        <el-header class="padding0 header no-select" height="50px">
          <span>我的联系人</span>
          <i class="close-btn el-icon-close" @click="close"></i>
        </el-header>
        <el-main class="main padding0">
          <el-container class="hv100">
            <el-aside width="250px" class="aside-border">
              <el-container class="hv100 no-select">
                <el-header class="padding0 search-header" height="50px" id="search-header">
                  <el-input placeholder="搜索 | 好友 or 群组" prefix-icon="el-icon-search" v-model="keywords" clearable
                    size="small" />
                </el-header>
                <el-main class="padding0">
                  <el-scrollbar :native="false" tag="section" class="hv100" ref="scrollbar">
                    <ul class="friend-items no-select">
                      <li v-for="(item,index) in search" @click="triggerContacts(item)">
                        <el-avatar :size="30" :src="item.avatar" class="avatar">
                          <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                        </el-avatar>
                        <span class="nickname">[{{item.type == 1?'友':'群'}}] ~ {{item.nickname}}</span>
                        <span class="select-btn">
                          <i class="el-icon-success" :class="{'i-color-green':item.checked}"></i>
                        </span>
                      </li>
                    </ul>
                  </el-scrollbar>
                </el-main>
              </el-container>
            </el-aside>

            <el-main class="padding0">
              <el-container class="hv100">
                <el-header height="40px">
                  <el-divider content-position="left" class="no-select">
                    <span style="color: #c4c5c7;">已选联系人 ({{selected.length}})</span>
                  </el-divider>
                </el-header>
                <el-main>
                  <el-scrollbar :native="false" tag="section" class="hv100">
                    <div class="selectd-items">
                      <div class="selectd-item no-select" v-for="(item,index) in selected">
                        <el-avatar :size="25" :src="item.avatar">
                          <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                        </el-avatar>
                        <p>{{item.nickname}}</p>
                        <div class="triangle-topleft" :class="{'triangle-topleft-group':item.type == 2}"></div>
                        <div class="del-mask" @click="delContacts(item)">
                          <i class="el-icon-delete"></i>
                        </div>
                      </div>
                    </div>
                  </el-scrollbar>
                </el-main>
              </el-container>
            </el-main>
          </el-container>
        </el-main>
        <el-footer height="50px" class="padding0 footer">
          <el-button size="small" @click="close" plain>取消</el-button>
          <el-button type="primary" size="small" @click="confirm">
            确认选择<span v-show="selected.length">({{selected.length}})</span>
          </el-button>
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
    name: "select-contacts",
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
  .container>>>.el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .base-mask {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    width: 650px;
    height: 550px;
    border-radius: 3px;
    overflow: hidden;
    background-color: white;
  }

  .container .header {
    height: 50px;
    line-height: 50px;
    position: relative;
    text-indent: 15px;
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
    border-top: 1px solid #f5eeee;
  }

  .container .aside-border {
    border-right: 1px solid #f5eeee;
  }

  .search-header {
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search-header-shadow {
    box-shadow: 0 2px 6px 0 rgba(31, 35, 41, .05);
  }

  .friend-items li {
    padding: 10px;
    cursor: pointer;
    position: relative;
  }

  .friend-items li:hover {
    background: #fcfcfc;
  }

  .friend-items li .avatar {
    margin-top: 3px;
  }

  .friend-items li .nickname {
    width: 60%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    top: 10px;
    left: 52px;
    height: 35px;
    line-height: 35px;
    font-weight: 400;
    font-size: 13px;
  }

  .friend-items li .select-btn {
    position: absolute;
    width: 32px;
    height: 35px;
    right: 3px;
    top: 10px;
    line-height: 35px;
    text-align: center;
  }

  .friend-items li .select-btn i {
    color: #ccc;
  }

  .friend-items li .select-btn .i-color-green {
    color: #26bcfe !important;
  }

  .group-from label {
    height: 45px;
    line-height: 47px;
    width: 50px;
    color: #606266;
    padding-right: 3px;
    font-size: 13px;
  }

  .group-from input {
    height: 25px;
    width: 100%;
    text-indent: 3px;
    color: #a9a4a4;
    font-size: 12px;
    border-bottom: 1px solid #efebeb;
  }

  .selectd-items {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: flex-start;
  }

  .selectd-item {
    width: 50px;
    height: 65px;
    margin: 3px 5px 0px 4px;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    box-shadow: 0px 0px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .selectd-item .triangle-topleft {
    width: 0;
    height: 0;
    border-top: 15px solid #03a9f4;
    border-right: 15px solid transparent;
    position: absolute;
    top: 0;
    left: 0;
  }

  .selectd-item .triangle-topleft-group {
    border-top: 15px solid #ff9800;
  }

  .selectd-item p {
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 10px;
    margin-top: 8px;
    text-align: center;
  }

  .selectd-item .del-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(31, 35, 41, .5);
    display: none;
    justify-content: center;
    align-items: center;
    color: white;
    transition: ease .5s;
  }

  .selectd-item:hover .del-mask {
    display: flex;
  }

</style>
