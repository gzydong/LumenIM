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
            <el-main class="padding0 main">
              <div class="menu-item" :class="{'menu-item-border':activeIndex == 0}" @click="triggerMenu(0)">
                <i class="el-icon-user-solid" style="color: #f80;"></i>
                <span>新的联系人</span>
              </div>
              <div class="menu-item" :class="{'menu-item-border':activeIndex == 1}" @click="triggerMenu(1)">
                <i class="el-icon-s-custom" style="color:#ff3f3f;"></i>
                <span>我的好友</span>
                <i class="add-icon el-icon-circle-plus"></i>
              </div>
              <div class="menu-item" :class="{'menu-item-border':activeIndex == 2}" @click="triggerMenu(2)">
                <i class="iconfont icon-qunzutianchong" style="color: #70c745;"></i>
                <span>我的群组</span>
                <i class="add-icon el-icon-circle-plus"></i>
              </div>
              <div class="menu-item" :class="{'menu-item-border':activeIndex == 3}" @click="triggerMenu(3)">
                <i class="el-icon-star-on" style="color: #e485b0;"></i>
                <span>特别关心</span>
                <i class="add-icon el-icon-circle-plus"></i>
              </div>
            </el-main>
          </el-container>
        </el-aside>

        <!-- 聊天面板容器 -->
        <el-main class="padding0 hv100 ov-hidden" style="background-color: white;">

        </el-main>
      </el-container>
    </main-layout>

    <!-- 创建群聊组件 -->
    <launch-group-chat v-if="launchGroupShow" @close="launchGroupShow = false" @create-success="groupChatSuccess" />

    <!-- 查看好友用户信息 -->
    <user-business-card ref="userBusinessCard" />

    <!-- 用户查询 -->
    <search-users ref="searchUsers" />
  </div>
</template>

<script>
  import Vue from "vue";
  import MainLayout from "@/views/layout/MainLayout";
  import LaunchGroupChat from "@/components/chat/LaunchGroupChat";
  import UserBusinessCard from "@/components/user/UserBusinessCard";
  import SearchUsers from "@/components/user/SearchUsers";

  export default {
    name: 'contacts-page',
    components: {
      MainLayout,
      LaunchGroupChat,
      UserBusinessCard,
      SearchUsers
    },
    data() {
      return {
        activeIndex: 0,

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
      };
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

      triggerMenu(i){
        this.activeIndex = i;
      }
    }
  };

</script>
<style>
  .el-autocomplete-suggestion__wrap li {
    padding: 0 10px !important;
  }

</style>
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

  .menu-item {
    height: 42px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    cursor: pointer;
    border-left: 3px solid white;
    position: relative;
    transition:.2s ease-in;
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

  .menu-item .add-icon {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    position: absolute;
    right: 5px;
    top: 11px;
    font-size: 14px;
    display: none;
  }

  .menu-item:hover .add-icon,
  .menu-item-border .add-icon {
    display: block;
    color: #989494;
  }

</style>
