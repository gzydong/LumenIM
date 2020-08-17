<template>
  <div class="base-mask">
    <div class="container">
      <el-container class="hv100">
        <el-header class="padding0 header no-select" height="50px">
          <span>群管理【{{detail.group_name}}】</span>
          <i class="close-btn el-icon-close" @click="close"></i>
        </el-header>
        <el-main class="main padding0">
          <el-container class="hv100">
            <el-aside width="100px" class="aside-border no-select">
              <div class="menu-list" :class="{'menu-list-selectd':tabIndex == 0}" @click="triggerTab(0)">群信息</div>
              <div class="menu-list" :class="{'menu-list-selectd':tabIndex == 1}" @click="triggerTab(1)">群成员</div>
              <div class="menu-list" :class="{'menu-list-selectd':tabIndex == 2}" @click="triggerTab(2)">群公告</div>
            </el-aside>

            <!-- 群介绍模块 -->
            <el-main v-if="tabIndex == 0">
              <el-row>
                <el-col :span="14">
                  <el-form ref="groupForm" :model="form" :rules="rules">
                    <el-form-item label="群名:" prop="group_name">
                      <el-input v-model="form.group_name" size="medium" placeholder="请输入群名称" maxlength="30"
                        show-word-limit />
                    </el-form-item>
                    <el-form-item label="群描述:">
                      <el-input type="textarea" v-model="form.profile" rows="3" placeholder="请输入群描述" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" size="small" @click="editGroup" :loading="loading">修改</el-button>
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

            <!-- 群成员模块 -->
            <el-main v-else-if="tabIndex == 1" class="padding0">
              <el-container class="hv100">
                <el-header height="50px" class="notice-header">
                  <el-input :placeholder="`搜索群成员 ( 共${members.length}人 )`" v-model="searchMembers" clearable
                    style="width: 200px;" size="small" prefix-icon="el-icon-search" />
                  <p>
                    <el-button plain size="small" icon="el-icon-plus" @click="inviteFriendBox = true">
                      邀请好友
                    </el-button>
                    <el-button size="small" icon="el-icon-delete" type="danger" v-if="batchDelMember"
                      @click="deleteMembers">
                      确认删除
                    </el-button>
                    <el-button plain size="small" icon="el-icon-finished" v-else @click="batchDelMember = true">
                      批量操作
                    </el-button>
                  </p>
                </el-header>
                <el-main class="padding0">
                  <el-scrollbar :native="false" tag="section" class="hv100">
                    <div class="members">
                      <div v-for="(member,i) in filterMembers" class="member no-select"
                        :class="{'member-selectd':member.is_delete && batchDelMember}" :key="member.user_id">
                        <div class="item-header">
                          <div class="avatar" @click="catUserDetail(member)">
                            <el-avatar :size="30" :src="member.avatar">
                              <img src="/static/image/detault-avatar.jpg" alt="">
                            </el-avatar>
                            <span class="nickname" v-text="member.nickname"></span>
                            <span class="larkc-tag" v-show="member.is_manager">群主</span>
                          </div>
                          <div class="tools" v-show="batchDelMember && !member.is_manager">
                            <i class="el-icon-success" @click.stop="triggerDelBtn(member)"
                              :class="{'is-delete':member.is_delete}"></i>
                          </div>
                        </div>
                        <div class="profile">签名 | {{member.motto?member.motto:'未设置'}}</div>
                      </div>
                    </div>
                  </el-scrollbar>
                </el-main>
              </el-container>
            </el-main>

            <!-- 群公告模块 -->
            <el-main v-else-if="tabIndex == 2" class="padding0">
              <el-container class="hv100">
                <el-header height="50px" class="notice-header" style="padding-left: 14px;">
                  <span>群公告 ({{notice.items.length}})</span>
                  <el-button plain size="small" icon="el-icon-plus" @click="showNoticeBox(0,'','')">
                    添加公告
                  </el-button>
                </el-header>

                <el-main class="padding0">
                  <el-scrollbar :native="false" tag="section" class="hv100">
                    <div v-if="notice.items.length == 0" class="empty-notice">
                      <svg-icon icon-class="not-data" style="width: 80px;" />
                      <span>暂无群公告</span>
                    </div>

                    <div v-else class="notices">
                      <div v-for="(item,index) in notice.items" :key="item.id" class="notice">
                        <div class="title">
                          <span class="left-title" v-text="item.title"
                            @click="showNoticeBox(item.id,item.title,item.content)"></span>
                          <span class="right-tools no-select"
                            @click="catNoticeDetail(index)">{{item.isShow?'收起':'展开'}}</span>
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
                    </div>
                  </el-scrollbar>
                </el-main>
              </el-container>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </div>

    <!-- 编辑公告信息 -->
    <div class="base-mask animated fadeIn" v-show="notice.isShowform">
      <div class="notice-box">
        <h4>编辑群公告</h4>
        <el-form ref="noticeForm" :model="notice.form" :rules="notice.rules">
          <el-form-item label="标题" prop="title">
            <el-input v-model="notice.form.title" size="medium" placeholder="请输入标题..." maxlength="30" show-word-limit />
          </el-form-item>
          <el-form-item label="详情" prop="content">
            <el-input type="textarea" v-model="notice.form.content" rows="5" placeholder="请输入公告详情..." maxlength="500" />
          </el-form-item>
          <el-form-item style="text-align: right;">
            <el-button plain size="small" @click="notice.isShowform = false">取消</el-button>
            <el-button type="primary" size="small" @click="onSubmitNotice" :loading="notice.loading">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <avatar-cropper v-if="isAvatarCropper" v-on:close="closeAvatarCropper" />

    <!-- 查看好友用户信息 -->
    <user-business-card ref="userBusinessCard" />

    <launch-group-chat v-if="inviteFriendBox" :group-id="groupId" @close="inviteFriendBox = false"
      @invite-success="inviteSuccess" />
  </div>
</template>
<script>
  import AvatarCropper from '@/components/layout/AvatarCropper';
  import UserBusinessCard from "@/components/user/UserBusinessCard";
  import LaunchGroupChat from "@/components/chat/LaunchGroupChat";

  import {
    getGroupMembersServ,
    getGroupNoticesServ,
    editNoticeServ,
    removeMembersGroupServ,
    groupDetailServ,
    editGroupServ
  } from '@/api/group';

  export default {
    name: "group-manager",
    props: {
      groupId: {
        type: [String, Number],
        default: null,
      }
    },
    components: {
      AvatarCropper,
      UserBusinessCard,
      LaunchGroupChat
    },
    data() {
      return {
        // 当前选中菜单
        tabIndex: 0,

        loading: false,
        form: {
          group_name: '',
          profile: '',
          avatar: '',
        },
        rules: {
          group_name: [{
            required: true,
            message: '用户昵称不能为空!',
            trigger: 'blur'
          }]
        },

        detail: {
          group_name: '',
          profile: '',
          avatar: '',
        },

        // 群成员列表
        searchMembers: '',
        batchDelMember: false,
        members: [],

        // 群公告相关数据
        notice: {
          isShowform: false,
          loading: false,
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
              message: '详情不能为空',
              trigger: 'blur'
            }]
          },
          items: []
        },

        inviteFriendBox: false,
        isAvatarCropper: false,
      };
    },
    computed: {
      filterMembers() {
        return this.searchMembers == '' ? this.members : this.members.filter((item, index) => {
          return item.nickname.match(this.searchMembers) != null || item.visit_card.match(this.searchMembers) !=
            null;
        });
      }
    },
    created() {
      this.loadGroupDetail();
      this.loadMembers();
      this.loadNotices();
    },
    methods: {
      // 加载群信息
      loadGroupDetail() {
        groupDetailServ({
          group_id: this.groupId
        }).then(res => {
          if (res.code == 200) {
            let result = res.data;
            this.form.group_name = result.group_name;
            this.form.profile = result.group_profile;
            this.form.avatar = result.avatar;

            this.detail = {
              group_name: result.group_name,
              profile: result.profile,
              avatar: result.avatar,
            };
          }
        });
      },

      // 加载群组成员列表
      loadMembers() {
        getGroupMembersServ({
          group_id: this.groupId
        }).then(res => {
          if (res.code == 200) {
            this.members = res.data.map((item) => {
              item.is_delete = false;
              return item;
            });
          }
        });
      },

      // 加载群组公告列表
      loadNotices() {
        getGroupNoticesServ({
          group_id: this.groupId,
        }).then(res => {
          if (res.code == 200) {
            this.notice.items = res.data.map((item) => {
              item.isShow = false;
              return item;
            });
          }
        });
      },

      // 修改群信息
      editGroup() {
        this.$refs.groupForm.validate((valid) => {
          if (!valid) return false;
          this.loading = true;
          editGroupServ({
            group_id: this.groupId,
            group_name: this.form.group_name,
            group_profile: this.form.profile,
            avatar: this.form.avatar,
          }).then(res => {
            if (res.code == 200) {
              this.detail.group_name = this.form.group_name;
              this.detail.profile = this.form.profile;
              this.detail.avatar = this.form.avatar;

              this.$message({
                message: '信息修改成功...',
                type: 'success'
              });
            } else {
              this.$message('信息修改失败...');
            }
          }).finally(() => {
            this.loading = false;
          });
        });
      },

      // 关闭窗口
      close() {
        this.$emit("close");
      },

      // 左侧菜单栏切换事件
      triggerTab(i) {
        this.tabIndex = i;
      },

      // 关闭头像裁剪弹出层
      closeAvatarCropper(type, avatar = '') {
        this.isAvatarCropper = false;
        if (type == 1 && avatar != '') {
          this.form.avatar = avatar;
        }
      },

      // 显示编辑公告窗口
      showNoticeBox(id = 0, title = '', content = '') {
        this.notice.isShowform = true;
        this.notice.form.id = id;
        this.notice.form.title = title;
        this.notice.form.content = content;
      },

      // 编辑公告提交事件
      onSubmitNotice() {
        this.$refs.noticeForm.validate((valid) => {
          if (!valid) return false;

          this.notice.loading = true;
          editNoticeServ({
            notice_id: this.notice.form.id,
            group_id: this.groupId,
            title: this.notice.form.title,
            content: this.notice.form.content
          }).then(res => {
            if (res.code == 200) {
              this.notice.isShowform = false;
              this.loadNotices();
              this.$notify({
                title: '消息提示',
                message: this.notice.form.id ? '群公告修改成功...' : '群公告添加成功...',
                position: 'bottom-right',
                type: 'success'
              });
            } else {
              this.$notify({
                title: '消息提示',
                message: this.notice.form.id ? '群公告修改失败...' : '群公告添加失败...',
                position: 'bottom-right',
                type: 'success'
              });
            }
          }).catch(err => {
            this.$notify({
              title: '消息提示',
              message: '网络异常，请稍后再试...',
              position: 'bottom-right',
              type: 'warning'
            });
          }).finally(() => {
            this.notice.loading = false;
          });
        });
      },

      // 展开/收起群公告详情
      catNoticeDetail(index) {
        this.notice.items[index].isShow = !this.notice.items[index].isShow;
      },

      // 查看群成员信息事件
      catUserDetail(item) {
        this.$refs.userBusinessCard.open(item.user_id);
      },

      // 选中删除成员事件
      triggerDelBtn(member) {
        let i = this.members.findIndex((item) => {
          return item.id == member.id;
        });

        this.members[i].is_delete = !this.members[i].is_delete;
      },

      // 批量删除群成员
      deleteMembers() {
        let ids = [],
          names = [];

        this.members.forEach(item => {
          if (item.is_delete) {
            ids.push(item.user_id);
            names.push(item.nickname);
          }
        });

        if (ids.length == 0) {
          this.batchDelMember = false;
          return;
        }

        this.$confirm(`您确定要将【 ${names.join('、')}】移出群聊?`, '温馨提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          customClass: 'border-radius0'
        }).then(() => {
          removeMembersGroupServ({
            group_id: this.groupId,
            members_ids: ids
          }).then(res => {
            if (res.code == 200) {
              this.loadMembers();
            }
          });
        }).catch(() => {
          this.members.map((item) => {
            return item.is_delete = false;
          });
          this.batchDelMember = false;
        });
      },

      // 好友邀请成功回调方法
      inviteSuccess() {
        this.inviteFriendBox = false;
        this.loadMembers();
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


  /* 群成员相关 start */
  .members {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 5px 20px;
    justify-content: space-between;
  }

  .members .member {
    width: 48%;
    height: 70px;
    border-radius: 3px;
    cursor: pointer;
    border: 1px dashed #e2dcdc;
    margin: 5px 0;
    padding: 3px;
  }

  .members .member:hover,
  .members .member-selectd {
    border-color: #2196f3;
  }

  .members .member .item-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .members .member .larkc-tag {
    color: #3370ff;
    background-color: #e1eaff;
  }

  .members .member .item-header .avatar {
    flex: 1 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 3px 5px;
  }

  .members .member .item-header .avatar .nickname {
    font-size: 13px;
    margin: 0 5px 0 15px;
  }

  .members .member .item-header .tools {
    flex-basis: 50px;
    overflow: hidden;
    text-align: right;
    padding-right: 5px;
  }

  .members .member .item-header .tools i {
    color: #cccccc;
  }

  .members .member .item-header .tools .is-delete {
    color: #03a9f4;
  }

  .members .member .profile {
    color: #8f8a8a;
    font-size: 12px;
    padding: 3px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 3px 0;
  }



  /* 群成员相关 end */



  /* 公告相关 start */

  .notice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .empty-notice {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .empty-notice span {
    color: #cccccc;
  }

  .notices .notice {
    cursor: pointer;
    min-height: 76px;
    overflow: hidden;
    border-bottom: 1px dashed #e2dcdc;
    margin-bottom: 15px;
    margin-right: 15px;
    padding-bottom: 5px;
    margin: 2px 20px 15px 15px;
  }

  .notices .notice h6 {
    font-size: 15px;
    font-weight: 300;
  }

  .notices .notice .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 30px;
  }

  .notices .notice .title .left-title {
    flex: 1 1;
    height: 100%;
    line-height: 30px;
    font-size: 14px;
  }

  .notices .notice .title .right-tools {
    flex-basis: 70px;
    flex-shrink: 0;
    height: 100%;
    line-height: 30px;
    text-align: right;
    font-weight: 300;
    font-size: 12px;
    color: #2196f3;
  }

  .notices .notice .datetime {
    font-size: 10px;
    color: #a59696;
    font-weight: 300;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 10px 0;
  }

  .notices .notice .datetime .text {
    margin: 0 5px;
  }

  .notices .notice .datetime .nickname {
    color: #2196f3;
    font-weight: 400;
  }

  .notices .notice .retract {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .notices .notice .content {
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


  /* 公告相关 end */

</style>
