<template>
  <div>
    <main-layout :idx="3">
      <el-container slot="container" class="hv100">
        <!-- 左侧侧边栏 -->
        <el-aside width="250px" class="aside-box padding0">
          <el-container class="hv100" direction="vertical">
            <!-- 搜索栏 -->
            <el-header height="60px" class="padding0 header">
              <div class="from">
                <el-autocomplete v-model="input" :fetch-suggestions="querySearch" placeholder="搜索"
                  prefix-icon="el-icon-search" size="small" clearable>
                  <template slot-scope="{ item }">
                    <div class="search-item">
                      <div class="avatar">
                        <span v-show="!item.avatar">
                          {{(item.remark_name?item.remark_name:item.name).substr(0,1)}}
                        </span>
                        <img v-show="item.avatar" :src="item.avatar" :onerror="$store.state.user.detaultAvatar" />
                      </div>
                      <div class="card">
                        <div class="title">{{item.name}}</div>
                        <div class="content">备注：{{item.remark_name}}</div>
                      </div>
                    </div>
                  </template>
                </el-autocomplete>
              </div>

              <!-- 工具栏 -->
              <div class="tools">
                <el-button icon="el-icon-plus" circle plain size="small" v-show="subMenu"></el-button>
                <el-button icon="el-icon-plus" circle plain size="small" v-show="!subMenu" @click="subMenu = true">
                </el-button>
                <transition name="el-zoom-in-top">
                  <div class="tools-menu" v-show="subMenu" v-outside="closeSubMenu">
                    <div class="menu-item" @click="triggerSubMenu(1)">创建群聊</div>
                    <div class="menu-item" @click="triggerSubMenu(2)">添加好友</div>
                  </div>
                </transition>
              </div>
            </el-header>

            <!-- 对话列表栏 -->
            <el-main class="padding0 main no-user-select">
              <div class="menu-item" :class="{'menu-item-border':activeIndex == 0}" @click="triggerMenu(0)">
                <i class="el-icon-user-solid" style="color: #f80;"></i>
                <span>新的联系人</span>
                <span v-show="$store.state.notify.applyNum">({{$store.state.notify.applyNum}})</span>
              </div>
              <div class="menu-item" :class="{'menu-item-border':activeIndex == 1}" @click="triggerMenu(1)">
                <i class="el-icon-s-custom" style="color:#ff3f3f;"></i>
                <span>我的好友</span>
              </div>
              <div class="menu-item" :class="{'menu-item-border':activeIndex == 2}" @click="triggerMenu(2)">
                <i class="iconfont icon-qunzutianchong" style="color: #2196f3;"></i>
                <span>我的群组</span>
              </div>
            </el-main>
          </el-container>
        </el-aside>

        <!-- 聊天面板容器 -->
        <el-container class="padding0 hv100 ov-hidden panel">
          <el-header height="60px" class="panel-header no-user-select">
            <template v-if="activeIndex == 0">
              <span>新的联系人</span>
            </template>
            <template v-else-if="activeIndex == 1">
              <span>我的好友({{friends.items.length}})</span>
              <span @click="$refs.searchUsers.open()" class="pointer"><i class="el-icon-plus"></i> 添加好友</span>
            </template>
            <template v-else-if="activeIndex == 2">
              <span>我的群组({{groups.items.length}})</span>
              <span class="pointer" @click="launchGroupShow = true"><i class="el-icon-plus"></i> 创建群组</span>
            </template>
          </el-header>
          <el-main class="panel-main lumen-scrollbar">
            <template v-if="activeIndex == 0">
              <template v-if="apply.status == 0">
                <div class="preloading">
                  <div class="ant-spin ant-spin-lg ant-spin-spinning">
                    <span class="ant-spin-dot ant-spin-dot-spin">
                      <i class="ant-spin-dot-item"></i>
                      <i class="ant-spin-dot-item"></i>
                      <i class="ant-spin-dot-item"></i>
                      <i class="ant-spin-dot-item"></i>
                    </span>
                  </div>
                  <p>数据加载中 ...</p>
                </div>
              </template>
              <template v-if="apply.status == 1">
                <template v-if="apply.items.length == 0">
                  <div class="preloading">
                    <img src="/static/image/no-oncall.6b776fcf.png" width="180">
                    <p>暂无联系人申请</p>
                  </div>
                </template>
                <template>
                  <div class="data-item" v-for="(item,i) in apply.items" @click="openUserDetail(item.user_id)">
                    <el-avatar shape="square" :size="35" class="avatar" :src="item.avatar">
                      {{item.nickname.substr(0,1)}}
                    </el-avatar>
                    <div class="card">
                      <div class="title">
                        <span class="name">{{item.nickname}}</span>
                        <div class="larkc-tag wait" v-show="item.status == 0">待处理</div>
                        <div class="larkc-tag agree" v-show="item.status == 1">已同意</div>
                        <div class="larkc-tag" v-show="item.status == 2">已拒绝</div>
                      </div>
                      <div class="content">[申请时间] {{item.created_at}} ~ [备注说明] {{item.remarks}}</div>
                    </div>

                    <div class="apply-from" v-if="item.status == 0" @click.prevent.stop>
                      <el-button size="mini" round type="primary" @click="handleFrom(1,item)">同意</el-button>
                      <el-button size="mini" round @click="handleFrom(2,item)">拒绝</el-button>
                    </div>
                  </div>
                </template>
              </template>
            </template>
            <template v-else-if="activeIndex == 1">
              <template v-if="friends.status == 0">
                <div class="preloading">
                  <div class="ant-spin ant-spin-lg ant-spin-spinning">
                    <span class="ant-spin-dot ant-spin-dot-spin">
                      <i class="ant-spin-dot-item"></i>
                      <i class="ant-spin-dot-item"></i>
                      <i class="ant-spin-dot-item"></i>
                      <i class="ant-spin-dot-item"></i>
                    </span>
                  </div>
                  <p>数据加载中 ...</p>
                </div>
              </template>
              <template v-if="friends.status == 1">
                <template v-if="friends.items.length == 0">
                  <div class="preloading">
                    <img src="/static/image/no-oncall.6b776fcf.png" width="180">
                    <p>暂无好友</p>
                  </div>
                </template>
                <template>
                  <div class="data-item" v-for="(item,i) in friends.items" @click="openUserDetail(item.id)">
                    <el-avatar shape="square" :size="35" class="avatar" :src="item.avatar">
                      {{item.nickname.substr(0,1)}}
                    </el-avatar>
                    <div class="card">
                      <div class="title">
                        <span class="name">{{item.friend_remark?item.friend_remark:item.name}}</span>
                        <div class="larkc-tag agree" v-show="item.online == 1">在线</div>
                        <div class="larkc-tag" v-show="item.online == 0" style="color: white;">离线</div>
                      </div>
                      <div class="content">[签名] ~ {{item.motto}}</div>
                    </div>

                    <div class="apply-from" @click.prevent.stop>
                      <el-button size="mini" round type="primary" icon="el-icon-s-promotion"
                        @click="toTalk(`1_${item.id}`)">发送消息</el-button>
                      <el-button size="mini" round type="danger" icon="el-icon-delete" @click="deleteFriend(item)">删除好友
                      </el-button>
                    </div>
                  </div>
                </template>
              </template>
            </template>
            <template v-else-if="activeIndex == 2">
              <template v-if="groups.status == 0">
                <div class="preloading">
                  <div class="ant-spin ant-spin-lg ant-spin-spinning">
                    <span class="ant-spin-dot ant-spin-dot-spin">
                      <i class="ant-spin-dot-item"></i>
                      <i class="ant-spin-dot-item"></i>
                      <i class="ant-spin-dot-item"></i>
                      <i class="ant-spin-dot-item"></i>
                    </span>
                  </div>
                  <p>数据加载中 ...</p>
                </div>
              </template>
              <template v-if="groups.status == 1">
                <template v-if="groups.items.length == 0">
                  <div class="preloading">
                    <img src="/static/image/no-oncall.6b776fcf.png" width="180">
                    <p>暂未加入群聊</p>
                  </div>
                </template>
                <template>
                  <div class="data-item" v-for="(item,i) in groups.items" @click="groupDetailId = item.id">
                    <el-avatar shape="square" :size="35" class="avatar" :src="item.avatar">
                      {{item.group_name.substr(0,1)}}
                    </el-avatar>
                    <div class="card">
                      <div class="title">
                        <span class="name">{{item.group_name}}</span>
                        <div class="larkc-tag" v-show="item.not_disturb == 1">
                          <i class="iconfont icon-xiaoximiandarao" style="font-size: 10px;"></i>
                        </div>
                      </div>
                      <div class="content">[简介] ~ {{item.group_profile}}</div>

                      <div class="apply-from" @click.prevent.stop>
                        <el-button size="mini" round type="primary" icon="el-icon-s-promotion"
                          @click="toTalk(`2_${item.id}`)">发送消息</el-button>
                        <el-button size="mini" round type="danger" icon="el-icon-delete" @click="deleteGroup(item)">退出群聊
                        </el-button>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </template>
          </el-main>

          <div class="broadside-box" v-show="groupDetailId">
            <user-group :group-id="groupDetailId" @close="groupDetailId = 0" @send-group="sendMessage"
              @disturb-change="disturbChange" @send-friend-msg="sendFriendMsg" @quit-group="quitGroupSuccess" />
          </div>
        </el-container>
      </el-container>
    </main-layout>

    <!-- 创建群聊组件 -->
    <launch-group-chat v-if="launchGroupShow" @close="launchGroupShow = false" @create-success="groupChatSuccess" />

    <!-- 查看好友用户信息 -->
    <user-business-card ref="userBusinessCard" @send-friend-msg="sendFriendMsg" />

    <!-- 用户查询 -->
    <search-users ref="searchUsers" @send-friend-msg="sendFriendMsg" />
  </div>
</template>

<script>
  import Vue from "vue";
  import MainLayout from "@/views/layout/MainLayout";
  import LaunchGroupChat from "@/components/chat/LaunchGroupChat";
  import UserBusinessCard from "@/components/user/UserBusinessCard";
  import SearchUsers from "@/components/user/SearchUsers";
  import UserGroup from "@/components/chat/UserGroup";

  import {
    friendsServ,
    findFriendApplyServ,
    handleFriendApplyServ,
    findUserGroupsServ,
    removeFriendServ
  } from "@/api/user";

  import {
    secedeGroupServ
  } from "@/api/group";

  export default {
    name: 'contacts-page',
    components: {
      MainLayout,
      LaunchGroupChat,
      UserBusinessCard,
      SearchUsers,
      UserGroup
    },
    data() {
      return {
        launchGroupShow: false,

        // 查询关键词
        input: '',

        // 搜索列表
        restaurants: [{
            "value": "测试数据（功能尚未完善）",
            "address": "长宁区新渔路144号"
          },
          {
            "value": "Hot honey 首尔炸鸡（仙霞路）",
            "address": "上海市长宁区淞虹路661号"
          },
          {
            "value": "南拳妈妈龙虾盖浇饭",
            "address": "普陀区金沙江路1699号鑫乐惠美食广场A13"
          }
        ],

        // header 工具菜单
        subMenu: false,

        // 当前显示的栏目
        activeIndex: 0,

        // 好友申请列表
        apply: {
          items: [],
          status: 0,
        },

        // 我的好友列表
        friends: {
          items: [],
          status: 0,
        },

        // 我的群组
        groups: {
          items: [],
          status: 0,
        },

        groupDetailId: 0
      };
    },
    created() {
      this.loadFriendApply();
    },
    methods: {
      // 搜索框查询
      querySearch(queryString, cb) {
        let restaurants = this.restaurants;

        let createFilter = (queryString) => {
          return (restaurant) => {
            return (restaurant.value.indexOf(queryString) === 0);
          };
        };

        let results = queryString ? restaurants.filter(createFilter(queryString)) : restaurants;

        cb(results);
      },
      // header 功能栏隐藏事件
      closeSubMenu() {
        this.subMenu = false;
      },

      // 工具栏事件
      triggerSubMenu(type) {
        this.closeSubMenu();
        if (type == 1) {
          this.launchGroupShow = true;
        } else {
          this.$refs.searchUsers.open();
        }
      },

      triggerMenu(i) {
        this.activeIndex = i;

        if (i == 1) {
          if (this.friends.status == 0) {
            this.loadFriends();
          }
        } else if (i == 2) {
          if (this.groups.status == 0) {
            this.loadUserGroups();
          }
        }

        if (i != 2) {
          this.groupDetailId = 0;
        }
      },

      // 查看好友申请列表
      loadFriendApply() {
        findFriendApplyServ({
          type: 1,
          page: 1,
          page_size: 10000
        }).then(res => {
          if (res.code == 200) {
            this.apply.status = 1;
            this.apply.items = res.data.rows;
          }
        });
      },

      // 加载好友列表
      loadFriends() {
        friendsServ().then(res => {
          if (res.code == 200) {
            this.friends.status = 1;
            this.friends.items = res.data;
          }
        });
      },

      // 加载群聊列表接口
      loadUserGroups() {
        findUserGroupsServ().then(res => {
          if (res.code == 200) {
            this.groups.status = 1;
            this.groups.items = res.data;
          }
        });
      },

      // 查看用户名片
      openUserDetail(user_id) {
        this.$refs.userBusinessCard.open(user_id);
      },

      toTalk(index_name) {
        sessionStorage.setItem("send_message_index_name", index_name);
        this.$router.push({
          path: "/message"
        });
      },

      // 给群聊成员发送好友信息
      sendFriendMsg(friendInfo) {
        this.toTalk(friendInfo.index_name);
      },

      // 发起群聊成功后回调方法
      groupChatSuccess(data) {
        this.launchGroupShow = false;
        this.loadUserGroups();
      },

      // 修改群聊免打扰状态
      disturbChange(detail) {
        let idx = this.getGroupIndex(detail.group_id);
        this.groups.items[idx].not_disturb = detail.status;
      },

      // 根据用户对话索引获取对话数组对应的key
      getGroupIndex(group_id) {
        return this.groups.items.findIndex(function (item, index, arr) {
          return item.id == group_id;
        });
      },

      // 群聊窗口点击发送群聊信息按钮回调事件
      sendMessage(groupInfo) {
        this.toTalk(`2_${groupInfo.groupId}`);
      },

      // 用户退出群聊回调事件
      quitGroupSuccess() {
        this.$delete(this.groups.items, this.getGroupIndex(this.groupDetailId));
        this.groupDetailId = 0;
      },

      // 处理好友申请信息
      handleFrom(type, item) {
        this.$prompt(type == 1 ? `请设置好友备注【${item.nickname}】` : '请填写拒绝原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'border-radius0',
          inputValidator(val) {
            if (val == null) {
              return type == 1 ? '好友备注不能为空' : '拒绝添加原因不能为空';
            } else {
              return true;
            }
          },
        }).then((data) => {
          handleFriendApplyServ({
            apply_id: item.id,
            type: type,
            remarks: data.value
          }).then(res => {
            if (res.code == 200) {
              let apply_id = item.id;
              let idx = this.apply.items.findIndex((item) => {
                return item.id == apply_id;
              });

              this.apply.items[idx].status = type == 1 ? 1 : 2;
              this.$message({
                message: '处理成功...',
                type: 'success'
              });
            } else {
              this.$message({
                type: 'info',
                message: '提交失败'
              });
            }
          });
        }).catch(action => {

        });
      },

      // 删除好友
      deleteFriend(item) {
        let name = item.friend_remark ? item.friend_remark : item.name;
        this.$alert(`您确定要删除【${name}】好友吗？`, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          customClass: 'border-radius0',
          closeOnClickModal: true,
          callback: action => {
            if (action == 'confirm') {
              let friend_id = item.id;
              removeFriendServ({
                friend_id
              }).then(res => {
                if (res.code == 200) {
                  this.$delete(this.friends.items, this.friends.items.findIndex((item) => {
                    return item.id == friend_id;
                  }));

                  this.$message({
                    message: `好友 【${name}】已删除 ...`,
                    type: 'success'
                  });
                } else {
                  this.$message({
                    message: `好友 【${name}】删除失败 ...`,
                    type: 'info'
                  });
                }
              });
            }
          }
        });
      },

      // 退出群聊
      deleteGroup(item) {
        this.$alert(`您确定要退出【${item.group_name}】群聊吗？`, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          customClass: 'border-radius0',
          closeOnClickModal: true,
          callback: action => {
            if (action == 'confirm') {
              let group_id = item.id;
              secedeGroupServ({
                group_id
              }).then(res => {
                if (res.code == 200) {
                  this.$delete(this.groups.items, this.groups.items.findIndex((item) => {
                    return item.id == group_id;
                  }));

                  this.$message({
                    message: `您已成功退出【${item.group_name}】群聊 ...`,
                    type: 'success'
                  });
                } else {
                  this.$message({
                    message: `退出 【${item.group_name}】】群聊失败 ...`,
                    type: 'info'
                  });
                }
              });
            }
          }
        });
      }
    }
  };

</script>
<style scoped>
  .aside-box {
    position: relative;
    background-color: white;
    border-right: 1px solid rgb(245, 245, 245);
    overflow: hidden;
  }

  /* header start */
  .aside-box .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;
  }

  .aside-box .header .from {
    flex: 1 1;
    flex-shrink: 0;
    height: 40px;
  }

  .aside-box .header .from>>>.el-autocomplete {
    width: 180px;
  }

  .aside-box .header .from>>>.el-autocomplete .el-input__inner {
    border-radius: 20px;
  }

  .aside-box .header .tools {
    flex-basis: 32px;
    flex-shrink: 0;
    height: 32px;
    margin-bottom: 8px;
    cursor: pointer;
    line-height: 32px;
    text-align: center;
    position: relative;
    user-select: none;
  }

  .aside-box .header .tools .tools-menu {
    position: absolute;
    right: 0;
    top: 38px;
    width: 100px;
    min-height: 80px;
    box-sizing: border-box;
    background-color: rgba(31, 35, 41, .9);
    border-radius: 5px;
    z-index: 1;
    padding: 3px 0;
  }

  .aside-box .header .tools .tools-menu .menu-item {
    height: 40px;
    line-height: 40px;
    color: white;
    font-size: 14px;
  }

  .aside-box .header .tools .tools-menu .menu-item:hover {
    background-color: rgba(70, 72, 73, 0.9);
  }

  /* header end */

  /* 左侧菜单栏 */
  .menu-item {
    height: 42px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    cursor: pointer;
    border-left: 3px solid white;
    position: relative;
    transition: .2s ease-in;
  }

  .menu-item-border {
    border-color: #3370ff !important;
    background-color: #eff0f1;
  }

  .menu-item i:first-child {
    margin-right: 10px;
  }

  .menu-item span {
    font-size: 14px;
  }

  .menu-item:hover {
    background-color: #eff0f1;
    border-color: #eff0f1;
  }


  /* 右侧面板 */
  .panel {
    background-color: white;
    position: relative;
  }


  .panel .panel-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eae1e1;
    justify-content: space-between;
  }

  .panel-main {
    padding: 10px 0;
  }

  .panel .preloading {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .panel .preloading p {
    margin-top: 20px;
    color: #646a73;
    font-size: 14px;
  }

  .data-item {
    height: 60px;
    margin-bottom: 2px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 15px;
    position: relative;
    border-bottom: 1px solid white;
  }

  .data-item:hover {
    border-color: #ff5722;
  }

  .data-item .avatar {
    height: 35px;
    width: 35px;
    flex-basis: 35px;
    flex-shrink: 0;
    background-color: #508afe;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: white;
    user-select: none;
    transition: ease 1s;
    position: relative;
  }

  .data-item .card {
    height: 40px;
    display: flex;
    align-content: center;
    flex-direction: column;
    flex: 1 1;
    margin-left: 10px;
    overflow: hidden;
  }

  .data-item .card .title {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;

  }

  .data-item .card .title .name {
    margin-right: 15px;
    color: #1f2329;
  }

  .data-item .card .title .larkc-tag {
    font-size: 12px;
    font-weight: 400;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    height: 20px;
    border-radius: 2px;
    cursor: default;
    user-select: none;
    background-color: #dee0e3;
    transform: scale(.8);
    transform-origin: left;
    flex-shrink: 0;
  }

  .data-item .card .title .wait {
    background: #ffb445;
    color: white;
  }

  .data-item .card .title .agree {
    background: #53bd53;
    color: white;
  }

  .data-item .card .content {
    font-size: 10px;
    line-height: 18px;
    color: #8f959e;
    overflow: hidden;
    margin-top: 3px;
    font-weight: 300;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .data-item .apply-from {
    position: absolute;
    right: 5px;
    top: -8px;
    height: 100%;
    width: 0;
    display: block;
    transition: ease-in-out .2s;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
  }

  .data-item:hover .apply-from {
    width: 120px;
  }

  .data-item .apply-from button {
    margin: 2px;
    width: 100px;
  }

  .broadside-box {
    position: absolute;
    width: 350px;
    height: 100%;
    right: 0;
    z-index: 2;
    animation: showBox 0.5s ease-in-out;
    -webkit-animation: showBox 0.5s ease-in-out;
    -moz-animation: showBox 0.5s ease-in-out;
    -webkit-box-direction: normal;
    background: white;
    box-shadow: 0 0 14px #cccccc70;
  }

  @keyframes showBox {
    0% {
      transform: translateX(350px);
    }

    to {
      transform: translateX(0);
    }
  }

  @-webkit-keyframes showBox {
    0% {
      -webkit-transform: translateX(350px);
    }

    to {
      -webkit-transform: translateX(0);
    }
  }

</style>
