<template>
  <div class="base-mask">
    <div class="container">
      <el-container class="hv100">
        <el-header class="padding0 header no-select" height="50px">
          <span>群公告({{items.length}})</span>
          <i class="close-btn el-icon-close" @click="$emit('close')"></i>
        </el-header>
        <el-main class="main">
          <el-scrollbar :native="false" tag="section" class="hv100">
            <div v-for="(item,index) in items" :key="item.id" class="notice-item">
              <div class="title">
                <span class="left-title" v-text="item.title"></span>
                <span class="right-tools no-select" @click="catNoticeDetail(index)">{{item.isShow?'收起':'展开'}}</span>
              </div>
              <p class="datetime">
                <el-avatar :size="15" :src="item.avatar">
                  <img src="/static/image/detault-avatar.jpg" alt="">
                </el-avatar>
                <span class="text nickname" v-text="item.nickname"
                  @click="$refs.userBusinessCard.open(item.user_id)"></span>
                <span class="text">发表于 {{item.created_at}}</span>
              </p>
              <p class="content" :class="{'retract':!item.isShow}" v-text="item.content"></p>
            </div>
          </el-scrollbar>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
  import {
    getGroupNoticesServ
  } from '@/api/group';

  export default {
    name: "group-notice",
    props: {
      groupId: {
        type: [String, Number],
        default: null,
      }
    },
    data() {
      return {
        // 公告列表
        items: []
      }
    },
    created() {
      this.loadNotices();
    },
    methods: {
      // 加载群组公告列表
      loadNotices() {
        getGroupNoticesServ({
          group_id: this.groupId,
        }).then(res => {
          if (res.code == 200) {
            this.items = res.data.map((item) => {
              item.isShow = false;
              return item;
            });
          }
        });
      },
      // 展开/收起群公告详情
      catNoticeDetail(index) {
        this.items[index].isShow = !this.items[index].isShow;
      }
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

  .container>>>.el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .container .main {
    padding: 15px 0px;
  }

  .notice-item {
    cursor: pointer;
    min-height: 76px;
    overflow: hidden;
    border-bottom: 1px dashed #e2dcdc;
    margin-bottom: 15px;
    margin-right: 15px;
    padding-bottom: 5px;
    margin: 2px 20px 15px 15px;
  }

  .notice-item h6 {
    font-size: 15px;
    font-weight: 300;
  }

  .notice-item .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 30px;
  }

  .notice-item .title .left-title {
    flex: 1 1;
    height: 100%;
    line-height: 30px;
    font-size: 14px;
  }

  .notice-item .title .right-tools {
    flex-basis: 70px;
    flex-shrink: 0;
    height: 100%;
    line-height: 30px;
    text-align: right;
    font-weight: 300;
    font-size: 12px;
    color: #2196f3;
  }

  .notice-item .datetime {
    font-size: 10px;
    color: #a59696;
    font-weight: 300;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 10px 0;
  }

  .notice-item .datetime .text {
    margin: 0 5px;
  }

  .notice-item .datetime .nickname {
    color: #2196f3;
    font-weight: 400;
  }

  .notice-item .retract {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .notice-item .content {
    font-size: 12px;
    line-height: 28px;
    font-weight: 500;
    color: #7d7a7a;
  }

  .notice-box {
    position: relative;
    padding: 28px;
    background: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .2);
    border-radius: 4px;
    overflow: hidden;
    box-sizing: border-box;
    height: 415px;
    width: 420px;
  }

  .notice-box h4 {
    margin-bottom: 20px;
    font-weight: 400;
  }

</style>
