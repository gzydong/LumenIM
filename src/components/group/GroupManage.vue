<template>
  <div class="lum-dialog-mask">
    <div class="lum-dialog-box">
      <el-container class="container">
        <el-header class="header no-select" height="60px">
          <p>群管理 ({{ detail.group_name }})</p>
          <p class="tools">
            <i class="el-icon-close" @click="$emit('close')" />
          </p>
        </el-header>
        <el-main class="main no-padding">
          <el-container class="full-height">
            <el-aside width="100px" class="aside-border no-select">
              <div
                v-for="(menu, index) in menus"
                :key="menu.name"
                class="menu-list"
                :class="{ selectd: tabIndex == index }"
                v-text="menu.name"
                @click="triggerTab(index)"
              />
            </el-aside>

            <!-- 群介绍模块 -->
            <el-main v-if="tabIndex == 0">
              <el-row>
                <el-col :span="14">
                  <el-form ref="groupForm" :model="form" :rules="rules">
                    <el-form-item label="群名:" prop="group_name">
                      <el-input
                        v-model="form.group_name"
                        size="medium"
                        placeholder="请输入群名称"
                        maxlength="30"
                        show-word-limit
                      />
                    </el-form-item>
                    <el-form-item label="群描述:">
                      <el-input
                        v-model="form.profile"
                        type="textarea"
                        rows="3"
                        placeholder="请输入群描述"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        icon="el-icon-edit"
                        size="small"
                        :loading="loading"
                        @click="editGroup"
                        >修改信息
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="10" class="avatar-col">
                  <div class="avatar-box">
                    <img v-show="form.avatar" :src="form.avatar" />
                    <div class="upload-icon">
                      <i class="el-icon-upload" />
                    </div>
                    <div class="upload-mask" @click="isAvatarCropper = true">
                      <i class="el-icon-plus" />
                    </div>
                  </div>
                  <p style="margin-top: 20px">设置头像</p>
                </el-col>
              </el-row>
            </el-main>

            <!-- 群成员模块 -->
            <el-main v-else-if="tabIndex == 1" class="no-padding">
              <el-container class="full-height">
                <el-header height="50px" class="notice-header">
                  <el-input
                    v-model="keywords"
                    style="width: 200px"
                    size="small"
                    clearable
                    prefix-icon="el-icon-search"
                    :placeholder="`搜索群成员 ( 共${members.length}人 )`"
                  />
                  <p>
                    <el-button
                      plain
                      size="small"
                      icon="el-icon-plus"
                      @click="inviteFriendBox = true"
                      >邀请好友
                    </el-button>
                    <el-button
                      v-if="batchDelMember"
                      type="danger"
                      size="small"
                      icon="el-icon-delete"
                      @click="deleteMembers"
                      >确认删除
                    </el-button>
                    <el-button
                      v-else
                      plain
                      size="small"
                      icon="el-icon-finished"
                      @click="batchDelMember = true"
                      >批量操作
                    </el-button>
                  </p>
                </el-header>
                <el-main class="no-padding">
                  <el-scrollbar
                    class="full-height"
                    tag="section"
                    :native="false"
                  >
                    <div class="members">
                      <div
                        v-for="member in searchs"
                        class="member no-select"
                        :class="{
                          selectd: member.is_delete && batchDelMember,
                        }"
                        :key="member.user_id"
                      >
                        <div class="item-header">
                          <div class="avatar" @click="catUserDetail(member)">
                            <el-avatar :size="30" :src="member.avatar">
                              <img src="~@/assets/image/detault-avatar.jpg" />
                            </el-avatar>
                            <span class="nickname" v-text="member.nickname" />
                            <span class="larkc-tag" v-show="member.leader == 2">
                              群主
                            </span>
                          </div>
                          <div
                            v-show="batchDelMember && member.leader != 2"
                            class="tools"
                          >
                            <i
                              class="el-icon-success"
                              :class="{ 'is-delete': member.is_delete }"
                              @click.stop="triggerDelBtn(member)"
                            />
                          </div>
                        </div>
                        <div class="profile">
                          签名 | {{ member.motto ? member.motto : '未设置' }}
                        </div>
                      </div>
                    </div>
                  </el-scrollbar>
                </el-main>
              </el-container>
            </el-main>

            <!-- 群公告模块 -->
            <el-main v-else-if="tabIndex == 2" class="no-padding">
              <el-container class="full-height">
                <el-header
                  class="notice-header"
                  height="50px"
                  style="padding-left: 14px"
                >
                  <span>群公告 ({{ notice.items.length }})</span>
                  <el-button
                    plain
                    size="small"
                    icon="el-icon-plus"
                    @click="showNoticeBox(0, '', '')"
                  >
                    添加公告
                  </el-button>
                </el-header>

                <el-main class="no-padding">
                  <el-scrollbar
                    class="full-height"
                    tag="section"
                    :native="false"
                  >
                    <div v-if="notice.items.length == 0" class="empty-notice">
                      <SvgNotData style="width: 80px; margin-bottom: 10px" />
                      <span>暂无群公告</span>
                    </div>

                    <div v-else class="notices">
                      <div
                        v-for="(item, index) in notice.items"
                        :key="item.id"
                        class="notice"
                      >
                        <div class="title">
                          <span
                            class="left-title"
                            v-text="item.title"
                            @click="
                              showNoticeBox(item.id, item.title, item.content)
                            "
                          ></span>
                          <span
                            class="right-tools no-select"
                            @click="catNoticeDetail(index)"
                            >{{ item.isShow ? '收起' : '展开' }}</span
                          >
                        </div>
                        <p class="datetime">
                          <el-avatar :size="15" :src="item.avatar">
                            <img src="~@/assets/image/detault-avatar.jpg" />
                          </el-avatar>
                          <span
                            class="text nickname"
                            v-text="item.nickname"
                            @click="$user(item.user_id)"
                          />
                          <span class="text">
                            发表于 {{ item.created_at.substr(0, 16) }}
                          </span>
                        </p>
                        <p
                          class="content"
                          :class="{ retract: !item.isShow }"
                          v-text="item.content"
                        ></p>
                      </div>
                    </div>
                  </el-scrollbar>
                </el-main>
              </el-container>
            </el-main>

            <el-main v-else-if="tabIndex == 3" class="no-padding"> </el-main>
          </el-container>
        </el-main>
      </el-container>
    </div>

    <!-- 编辑公告信息 -->
    <div class="lum-dialog-mask animated fadeIn" v-show="notice.isShowform">
      <div class="notice-box">
        <h4>编辑群公告</h4>
        <el-form ref="noticeForm" :model="notice.form" :rules="notice.rules">
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="notice.form.title"
              size="medium"
              placeholder="请输入标题..."
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="详情" prop="content">
            <el-input
              v-model="notice.form.content"
              type="textarea"
              rows="5"
              placeholder="请输入公告详情..."
              maxlength="500"
            />
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button plain size="small" @click="notice.isShowform = false">
              取消
            </el-button>
            <el-button
              type="primary"
              size="small"
              :loading="notice.loading"
              @click="onSubmitNotice"
              >提交
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <transition name="el-fade-in-linear">
      <AvatarCropper v-if="isAvatarCropper" @close="closeAvatarCropper" />
    </transition>

    <transition name="el-fade-in-linear">
      <GroupLaunch
        v-if="inviteFriendBox"
        :group-id="groupId"
        @close="inviteFriendBox = false"
        @invite-success="inviteSuccess"
      />
    </transition>
  </div>
</template>
<script>
import AvatarCropper from '@/components/layout/AvatarCropper'
import GroupLaunch from '@/components/group/GroupLaunch'
import { SvgNotData } from '@/core/icons'
import {
  ServeGetGroupMembers,
  ServeGetGroupNotices,
  ServeEditGroupNotice,
  ServeRemoveMembersGroup,
  ServeGroupDetail,
  ServeEditGroup,
} from '@/api/group'

export default {
  name: 'GroupManage',
  props: {
    groupId: {
      type: [String, Number],
      default: null,
    },
  },
  components: {
    AvatarCropper,
    GroupLaunch,
    SvgNotData,
  },
  data() {
    return {
      // 当前选中菜单
      tabIndex: 0,
      menus: [
        { name: '群信息' },
        { name: '群成员' },
        { name: '群公告' },
        { name: '群设置' },
      ],

      loading: false,
      form: {
        group_name: '',
        profile: '',
        avatar: '',
      },
      rules: {
        group_name: [
          {
            required: true,
            message: '用户昵称不能为空!',
            trigger: 'blur',
          },
        ],
      },

      detail: {
        group_name: '',
        profile: '',
        avatar: '',
      },

      // 群成员列表
      batchDelMember: false,
      members: [],
      keywords:"",

      // 群公告相关数据
      notice: {
        isShowform: false,
        loading: false,
        form: {
          id: 0,
          title: '',
          content: '',
        },
        rules: {
          title: [
            {
              required: true,
              message: '标题不能为空!',
              trigger: 'blur',
            },
          ],
          content: [
            {
              required: true,
              message: '详情不能为空',
              trigger: 'blur',
            },
          ],
        },
        items: [],
      },

      inviteFriendBox: false,
      isAvatarCropper: false,
    }
  },
  computed: {
    searchs() {
      return this.keywords == ''
        ? this.members
        : this.members.filter(item => {
            return (
              item.nickname.match(this.keywords) != null ||
              item.user_card.match(this.keywords) != null
            )
          })
    },
  },
  created() {
    this.loadGroupDetail()
    this.loadMembers()
    this.loadNotices()
  },
  methods: {
    // 加载群信息
    loadGroupDetail() {
      ServeGroupDetail({
        group_id: this.groupId,
      }).then(({ code, data }) => {
        if (code == 200) {
          this.form = this.detail = {
            group_name: data.group_name,
            profile: data.profile,
            avatar: data.avatar,
          }
        }
      })
    },

    // 加载群组成员列表
    loadMembers() {
      ServeGetGroupMembers({
        group_id: this.groupId,
      }).then(res => {
        if (res.code == 200) {
          this.members = res.data.map(item => {
            item.is_delete = false
            return item
          })
        }
      })
    },

    // 加载群组公告列表
    loadNotices() {
      ServeGetGroupNotices({
        group_id: this.groupId,
      }).then(res => {
        if (res.code == 200) {
          this.notice.items = res.data.rows.map(item => {
            item.isShow = false
            return item
          })
        }
      })
    },

    // 修改群信息
    editGroup() {
      this.$refs.groupForm.validate(valid => {
        if (!valid) return false
        this.loading = true
        ServeEditGroup({
          group_id: parseInt(this.groupId),
          group_name: this.form.group_name,
          profile: this.form.profile,
          avatar: this.form.avatar,
        })
          .then(res => {
            if (res.code == 200) {
              this.detail.group_name = this.form.group_name
              this.detail.profile = this.form.profile
              this.detail.avatar = this.form.avatar

              this.$message({
                message: '信息修改成功...',
                type: 'success',
              })
            } else {
              this.$message('信息修改失败...')
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    },

    // 左侧菜单栏切换事件
    triggerTab(i) {
      this.tabIndex = i
    },

    // 关闭头像裁剪弹出层
    closeAvatarCropper(type, avatar = '') {
      this.isAvatarCropper = false
      if (type == 1 && avatar != '') {
        this.form.avatar = avatar
      }
    },

    // 显示编辑公告窗口
    showNoticeBox(id = 0, title = '', content = '') {
      this.notice.isShowform = true
      this.notice.form.id = id
      this.notice.form.title = title
      this.notice.form.content = content
    },

    // 编辑公告提交事件
    onSubmitNotice() {
      this.$refs.noticeForm.validate(valid => {
        if (!valid) return false

        this.notice.loading = true
        ServeEditGroupNotice({
          notice_id: parseInt(this.notice.form.id),
          group_id: parseInt(this.groupId),
          title: this.notice.form.title,
          content: this.notice.form.content,
          is_top: 0,
          is_confirm: 0,
        })
          .then(res => {
            if (res.code == 200) {
              this.notice.isShowform = false
              this.loadNotices()
              this.$notify({
                title: '消息提示',
                message: this.notice.form.id
                  ? '群公告修改成功...'
                  : '群公告添加成功...',
                type: 'success',
              })
            } else {
              this.$notify({
                title: '消息提示',
                message: this.notice.form.id
                  ? '群公告修改失败...'
                  : '群公告添加失败...',
                type: 'success',
              })
            }
          })
          .catch(() => {
            this.$notify({
              title: '消息提示',
              message: '网络异常，请稍后再试...',
              position: 'bottom-right',
              type: 'warning',
            })
          })
          .finally(() => {
            this.notice.loading = false
          })
      })
    },

    // 展开/收起群公告详情
    catNoticeDetail(index) {
      this.notice.items[index].isShow = !this.notice.items[index].isShow
    },

    // 查看群成员信息事件
    catUserDetail(item) {
      this.$user(item.user_id)
    },

    // 选中删除成员事件
    triggerDelBtn(member) {
      let i = this.members.findIndex(item => {
        return item.id === member.id
      })

      this.members[i].is_delete = !this.members[i].is_delete
    },

    // 批量删除群成员
    deleteMembers() {
      let ids = [],
        names = []

      this.members.forEach(item => {
        if (item.is_delete) {
          ids.push(item.user_id)
          names.push(item.nickname)
        }
      })

      if (ids.length == 0) {
        this.batchDelMember = false
        return
      }

      this.$confirm(`您确定要将【 ${names.join('、')}】移出群聊?`, '温馨提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          ServeRemoveMembersGroup({
            group_id: parseInt(this.groupId),
            members_ids: ids.join(','),
          }).then(res => {
            if (res.code == 200) {
              this.loadMembers()
              this.$notify({
                title: '删除成功',
                message: `已成功将群成员移除群组...`,
                type: 'success',
              })
              this.batchDelMember = false
            }
          })
        })
        .catch(() => {
          this.members.map(item => {
            return (item.is_delete = false)
          })
          this.batchDelMember = false
        })
    },

    // 好友邀请成功回调方法
    inviteSuccess() {
      this.inviteFriendBox = false
      this.loadMembers()
    },
  },
}
</script>
<style lang="less" scoped>
.lum-dialog-box {
  width: 80%;
  height: 500px;
  max-width: 800px;
}

.aside-border {
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-right: 1px solid #f5f5f5;

  .menu-list {
    height: 25px;
    line-height: 25px;
    margin: 8px 2px;
    font-weight: 400;
    font-size: 13px;
    background-color: white;
    cursor: pointer;
    border-left: 3px solid white;
    padding-left: 10px;

    &.selectd {
      color: #2196f3;
      border-color: #2196f3;
    }
  }
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
  transition: ease 0.5s;

  .upload-icon {
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

    i {
      font-size: 30px;
      color: #1bb0f3;
    }
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    z-index: 0;
  }

  .upload-mask {
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

    i {
      font-size: 30px;
      color: white;
    }
  }

  &:hover .upload-mask {
    display: flex;
  }
}

/* 群成员相关 start */
.members {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 5px 20px;
  justify-content: space-between;

  .member {
    width: 48%;
    height: 70px;
    border-radius: 3px;
    cursor: pointer;
    border: 1px dashed #e2dcdc;
    margin: 5px 0;
    padding: 3px;
    transition: ease 0.5s;

    .larkc-tag {
      color: #3370ff;
      background-color: #e1eaff;
    }

    .item-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .avatar {
        flex: 1 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 3px 5px;

        .nickname {
          font-size: 13px;
          margin: 0 5px 0 15px;
        }
      }

      .tools {
        flex-basis: 50px;
        overflow: hidden;
        text-align: right;
        padding-right: 5px;

        i {
          color: #cccccc;
        }

        .is-delete {
          color: #03a9f4;
        }
      }
    }

    .profile {
      color: #8f8a8a;
      font-size: 12px;
      padding: 3px 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 3px 0;
    }

    &:hover,
    &.selectd {
      border-color: #2196f3;
    }
  }
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
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  span {
    color: #cccccc;
    font-size: 13px;
  }
}

.notices {
  .notice {
    cursor: pointer;
    min-height: 76px;
    overflow: hidden;
    border-bottom: 1px dashed #e2dcdc;
    margin-bottom: 15px;
    margin-right: 15px;
    padding-bottom: 5px;
    margin: 2px 20px 15px 15px;

    h6 {
      font-size: 15px;
      font-weight: 300;
    }

    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 30px;

      .left-title {
        flex: 1 1;
        height: 100%;
        line-height: 30px;
        font-size: 14px;
      }

      .right-tools {
        flex-basis: 70px;
        flex-shrink: 0;
        height: 100%;
        line-height: 30px;
        text-align: right;
        font-weight: 300;
        font-size: 12px;
        color: #2196f3;
      }
    }

    .datetime {
      font-size: 10px;
      color: #a59696;
      font-weight: 300;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 10px 0;

      .text {
        margin: 0 5px;
      }

      .nickname {
        color: #2196f3;
        font-weight: 400;
      }
    }

    .retract {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .content {
      font-size: 12px;
      line-height: 28px;
      font-weight: 500;
      color: #7d7a7a;
    }
  }
}

.notice-box {
  position: relative;
  padding: 28px;
  background: #fff;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
  height: 415px;
  width: 420px;

  h4 {
    margin-bottom: 20px;
    font-weight: 400;
  }
}

/* 公告相关 end */

/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
