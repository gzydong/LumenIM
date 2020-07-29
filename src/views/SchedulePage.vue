<template>
  <div>
    <main-layout :idx="3">
      <el-container slot="container" class="hv100">
        <!-- 左侧侧边栏 -->
        <el-aside width="320px" class="aside-box padding0">
          <el-container class="hv100" direction="vertical">
            <el-header height="70px" class="padding0 header">

            </el-header>
            <el-header height="105px" class="padding0 subheader">
              <div class="top-item" v-for="i in 8">
                  <div class="avatar">远</div>
                  <div>那就阿</div>
              </div>
            </el-header>
            <el-main class="padding0 main">
              <div class="talk-item" v-for="i in 10" :class="{'talk-item-border':i==2}">
                <div class="avatar">远</div>
                <div class="card">
                  <div class="title">
                    <div class="card-name">
                      <p class="nickname">马赛克吗卡什么发卡量唉什么克隆反拉伸膜弗拉开门阿里卡密萨弗拉开门拉莫斯</p>
                      <div class="larkc-tag top">TOP</div>
                      <div class="larkc-tag group">群组</div>
                      <div class="larkc-tag disturb"><i class="iconfont icon-xiaoximiandarao"></i></div>
                    </div>
                    <div class="card-time">7月20日</div>
                  </div>
                  <div class="content">安居客饭安科技是否按实际开发</div>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-aside>

        <el-main style="background-color: white;">

        </el-main>
      </el-container>
    </main-layout>
  </div>
</template>

<script>
  import MainLayout from "@/views/layout/MainLayout";
  export default {
    name: 'schedule-page',
    components: {
      MainLayout
    },
    data() {
      return {

      };
    },
    methods: {

    }
  };

</script>
<style scoped>
  .aside-box {
    position: relative;
    background-color: white;
    overflow: hidden;
  }

  .aside-box .header {
    background-color: turquoise;
  }


  .aside-box .subheader {
    background-color: white;
    border-bottom: 1px solid #f3f0f0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .aside-box .subheader .top-item{
    flex-basis: 50px;
    flex-shrink: 0;
    height: 50px;
    background-color: royalblue;
    margin: 1px 1px 0 1px;
  }








  .aside-box .main {
    background-color: white;
  }


  .aside-box .talk-item {
    padding: 8px 5px;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    border-left: 3px solid white;
    transition: background-color .2s ease-in;
  }

  .aside-box .talk-item-border {
    border-color: #3370ff;
  }


  .aside-box .talk-item:hover {
    background-color: #eff0f1;
    border-color: #eff0f1;

  }

  .aside-box .talk-item:hover .avatar {
    transition: ease-in 2s;
    transform: rotate(360deg);
  }

  .aside-box .talk-item .avatar {
    height: 35px;
    width: 35px;
    flex-basis: 35px;
    flex-shrink: 0;
    background-color: #508afe;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: white;
  }

  .aside-box .talk-item .card {
    height: 40px;
    display: flex;
    align-content: center;
    flex-direction: column;
    flex: 1 1;
    margin-left: 10px;
    overflow: hidden;
  }

  .aside-box .talk-item .card .title {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
  }

  .aside-box .talk-item .card .title .card-name {
    color: #1f2329;
    font-size: 14px;
    line-height: 20px;
    flex: 1 1;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .aside-box .talk-item .card .title .card-name .nickname {
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .aside-box .talk-item .card .title .card-name .larkc-tag {
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

  .top {
    color: #dc9b04 !important;
    background-color: #faf1d1 !important;
  }

  .group {
    color: #3370ff !important;
    background-color: #e1eaff !important;
    font-size: 13px;
  }

  .disturb {
    color: #98999c !important;
    background-color: #ecedf1 !important;
    font-size: 12px;
  }

  .disturb i {
    font-size: 12px;
  }

  .aside-box .talk-item .card .title .card-time {
    color: #8f959e;
    font-size: 12px;
    margin-left: 10px;
  }

  .aside-box .talk-item .card .content {
    font-size: 10px;
    line-height: 18px;
    color: #8f959e;
    overflow: hidden;
    margin-top: 3px;
    font-weight: 300;
  }

</style>
