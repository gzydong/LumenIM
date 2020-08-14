<template>
  <div class="base-mask">
    <div class="container" v-outside="close">
      <el-container class="hv100">
        <el-header class="padding0 header no-user-select" height="50px">
          <span>群管理【你就按】</span>
          <i class="close-btn el-icon-close" @click="close"></i>
        </el-header>
        <el-main class="main padding0">
          <el-container class="hv100">
            <el-aside width="100px" class="aside-border no-user-select">
              <div class="menu-list" :class="{'menu-list-selectd':tabIndex == 0}" @click="triggerTab(0)">群信息</div>
              <div class="menu-list" :class="{'menu-list-selectd':tabIndex == 1}" @click="triggerTab(1)">群成员</div>
              <div class="menu-list" :class="{'menu-list-selectd':tabIndex == 2}" @click="triggerTab(2)">群公告</div>
            </el-aside>
            <el-main v-if="tabIndex == 0">
              <el-row>
                <el-col :span="14">
                  <el-form ref="form" :model="form" :rules="rules">
                    <el-form-item label="群名:" prop="nickname">
                      <el-input v-model="form.nickname" size="medium" placeholder="给自己起个名字" />
                    </el-form-item>
                    <el-form-item label="群简介:">
                      <el-input type="textarea" v-model="form.motto" rows="3" placeholder="编辑我的座右铭..." />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" size="small">修改</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="10" class="avatar-col">
                  <div class="avatar-box">
                    <img :src="form.avatar" v-show="form.avatar" />
                    <div class="upload-icon"><i class="el-icon-upload"></i></div>
                    <div class="upload-mask" @click="isAvatarCropper = true"><i class="el-icon-plus"></i></div>
                  </div>
                  <p style="margin-top: 20px;">设置头像</p>
                </el-col>
              </el-row>
            </el-main>
            <el-main v-else-if="tabIndex == 1" class="padding0">
              <el-container class="hv100">
                <el-header height="60px"
                  style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;padding: 0 15px;">
                  <el-input placeholder="搜索群成员" v-model="searchMembers" clearable style="width: 200px;" size="small"
                    prefix-icon="el-icon-search" />
                  <el-button plain size="small" icon="el-icon-circle-plus-outline" style="font-weight: 400;">添加群成员
                  </el-button>
                </el-header>
                <el-main class="padding0">
                  <el-scrollbar :native="false" tag="section" class="hv100">

                    <div class="members">
                      <div v-for="i in 23" class="member"></div>
                    </div>
                  </el-scrollbar>

                </el-main>
              </el-container>
            </el-main>
            <el-main v-else-if="tabIndex == 2" class="padding0">
              <el-container class="hv100">
                <el-header height="50px" style="display: flex;justify-content: space-between;align-items: center;">
                  <span>群公告 (共{{notice.items.length}}条)</span>
                  <span>
                    <el-button plain size="small" icon="el-icon-plus" style="font-weight: 400;" @click="showNoticeBox">
                      添加群公告
                    </el-button>
                  </span>
                </el-header>
                <el-main>
                  <el-scrollbar :native="false" tag="section" class="hv100">
                    <div class="notices">
                      <div v-for="(item,index) in notice.items" class="notice">
                        <h6 @click="showNoticeBox(item.id,item.title,item.content)">{{item.title}}</h6>
                        <p>发表于 {{item.datetime}}</p>
                        <p class="no-user-select" :class="{'retract':!item.isShow}" @click="catNoticeDetail(index)">
                          <i :class="item.isShow?'el-icon-arrow-down':'el-icon-arrow-right'"></i>
                          <span>{{item.content}}</span>
                        </p>
                      </div>
                    </div>
                  </el-scrollbar>
                </el-main>
              </el-container>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </div>

    <avatar-cropper v-if="isAvatarCropper" v-on:close="closeAvatarCropper" />


    <!-- 编辑公告信息 -->
    <div class="base-mask" v-show="notice.isShowform">
      <div class="notice-box">
        <h4>编辑群公告</h4>
        <el-form ref="noticeForm" :model="notice.form" :rules="notice.rules">
          <el-form-item label="标题" prop="title">
            <el-input v-model="notice.form.title" size="medium" placeholder="请输入标题..." />
          </el-form-item>
          <el-form-item label="详情" prop="content">
            <el-input type="textarea" v-model="notice.form.content" rows="5" placeholder="请输入公告详情..." />
          </el-form-item>
          <el-form-item style="text-align: right;">
            <el-button plain size="small" @click="notice.isShowform = false">取消</el-button>
            <el-button type="primary" size="small" @click="onSubmitNotice">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import AvatarCropper from '@/components/layout/AvatarCropper';
  export default {
    name: "group-manager",
    props: {
      groupId: {
        type: [String, Number],
        default: null,
      }
    },
    components: {
      AvatarCropper
    },
    data() {
      return {
        form: {
          nickname: '',
          gender: '',
          avatar: '',
          motto: '',
          email: '',
          mobile: '',
        },
        rules: {
          nickname: [{
            required: true,
            message: '用户昵称不能为空!',
            trigger: 'blur'
          }]
        },
        isAvatarCropper: false,

        tabIndex: 2,

        searchMembers: '',


        // 群成员列表
        members: [

        ],

        // 群公告相关数据
        notice: {
          isShowform: false,
          form: {
            id: 0,
            title: '',
            content: ''
          },
          rules: {
            title: [{
              required: true,
              message: '标题不能为空!',
              trigger: 'blur'
            }],
            content: [{
              required: true,
              message: '内容不能为空',
              trigger: 'blur'
            }]
          },
          items: [{
            id: 1,
            title: '按时看见那看那会计师DNA',
            content: 'as没课啦吗 马拉喀什',
            datetime: '2020-05-08 15:13',
            isShow:false,
          }, {
            id: 1,
            title: '按时看见那看那会计师DNA',
            content: 'as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什as没课啦吗 马拉喀什',
            datetime: '2020-05-08 15:13',
            isShow:false,
          }, {
            id: 1,
            title: '按时看见那看那会计师DNA',
            content: 'as没课啦吗 马拉喀什',
            datetime: '2020-05-08 15:13',
            isShow:false,
          }, {
            id: 1,
            title: '按时看见那看那会计师DNA',
            content: 'as没课啦吗 马拉喀什',
            datetime: '2020-05-08 15:13',
            isShow:false,
          }]
        }
      };
    },
    methods: {
      //关闭窗口
      close() {
        this.$emit("close");
      },

      // 关闭头像裁剪弹出层
      closeAvatarCropper(type, avatar = '') {
        this.isAvatarCropper = false;
        if (type == 1 && avatar != '') {
          this.form.avatar = avatar;
        }
      },

      triggerTab(i) {
        this.tabIndex = i;
      },

      // 显示编辑公告窗口
      showNoticeBox(id = 0, title = '', content = '') {
        this.notice.isShowform = true;
        this.notice.form.id = id;
        this.notice.form.title = title;
        this.notice.form.content = content;
      },
      onSubmitNotice() {
        this.$refs.noticeForm.validate((valid) => {
          if (!valid) return false;
          this.editNotice();
        });
      },

      editNotice(item) {

      },

      catNoticeDetail(index){
        this.notice.items[index].isShow = !this.notice.items[index].isShow;
      }
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
    width: 80%;
    height: 500px;

    max-width: 800px;

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


  .container .aside-border {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    padding: 8px;
    border-right: 1px solid #f5f5f5;
  }

  .container .aside-border .menu-list {
    height: 30px;
    line-height: 30px;
    margin: 4px 2px;
    text-align: center;
    font-weight: 400;
    font-size: 13px;
    background-color: white;
    cursor: pointer;
  }

  .container .aside-border .menu-list-selectd {
    background: #2196F3;
    color: white !important;
    border-radius: 20px;
    font-weight: 200;
  }

  .avatar-col {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .avatar-box {
    width: 100px;
    height: 100px;
    box-shadow: 0px 0px 7px 1px #e8e4e4;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    transition: ease .5s;
  }

  .avatar-box .upload-icon {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(184, 184, 197, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .avatar-box .upload-icon i {
    font-size: 30px;
    color: #1bb0f3;
  }

  .avatar-box img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    z-index: 0;
  }

  .avatar-box .upload-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 3;
    display: none;
    justify-content: center;
    align-items: center;
  }

  .avatar-box .upload-mask i {
    font-size: 30px;
    color: white;
  }

  .avatar-box:hover .upload-mask {
    display: flex;
  }



  .members {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 5px 15px;
  }

  .members .member {
    width: 105px;
    height: 120px;
    background-color: white;
    margin: 3px;
    box-shadow: 1px 1px 8px #eae4e4;
    border-radius: 3px;
  }


  .notices .notice {
    cursor: pointer;
    min-height: 76px;
    overflow: hidden;
    border-bottom: 1px dashed #e2dcdc;
    margin-bottom: 15px;
    margin-right: 15px;
    padding-bottom: 5px;
  }

  .notices .notice h6 {
    font-size: 15px;
    font-weight: 300;
  }

  .notices .notice p {
    font-size: 10px;
    color: #a59696;
    font-weight: 300;
    margin-top: 9px;

  }

  .notices .notice .retract {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
