<template>
  <div class="lum-dialog-mask">
    <el-container class="lum-dialog-box" v-outside="close">
      <el-header class="no-padding header no-select" height="60px">
        <p>
          {{ from.groupId == 0 ? '创建群组' : '请选择需要邀请的好友' }}
        </p>
        <p class="tools">
          <i class="el-icon-close" @click="close" />
        </p>
      </el-header>
      <el-main class="main no-padding">
        <el-container class="full-height">
          <el-aside width="250px" class="aside-border">
            <el-container class="full-height no-select">
              <el-header
                class="no-padding search-header"
                height="50px"
                :class="{ shadow: searchHeaderShadow }"
              >
                <el-input
                  v-model="keywords"
                  placeholder="搜索 | 好友 or 群组"
                  prefix-icon="el-icon-search"
                  clearable
                  size="small"
                />
              </el-header>
              <el-main class="no-padding">
                <el-scrollbar
                  ref="scrollbar"
                  class="full-height"
                  tag="section"
                  :native="false"
                >
                  <ul class="friend-items no-select">
                    <li
                      v-for="item in search"
                      :key="item.id"
                      @click="triggerContacts(item)"
                    >
                      
                      <div class="avatar">
                        <el-avatar :size="25" :src="item.avatar" shape="square">
                          <img src="~@/assets/image/detault-avatar.jpg" />
                        </el-avatar>
                      </div>
                      <div class="content"><span class="lum-text-ellipsis">{{ item.nickname }}</span></div>

                      <div class="checkbox">
                        <i
                          class="el-icon-success"
                          :class="{ 'icon-active': item.checked }"
                        />
                      </div>
                    </li>
                  </ul>
                </el-scrollbar>
              </el-main>
            </el-container>
          </el-aside>

          <el-main class="no-padding">
            <el-container class="full-height">
              <el-header height="50px" v-show="!readonly">
                <div class="group-from no-select">
                  <label>群名称*</label>
                  <p>
                    <el-input
                      v-model="from.groupName"
                      placeholder="请输入群名称(必填)"
                      size="small"
                      :maxlength="20"
                    />
                  </p>
                </div>
              </el-header>
              <el-header height="40px" :class="{ mt40: !readonly }">
                <el-divider content-position="left" class="no-select">
                  <span style="color: #c4c5c7">
                    邀请成员 ({{ selected.length }})
                  </span>
                </el-divider>
              </el-header>
              <el-main>
                <el-scrollbar :native="false" tag="section" class="full-height">
                  <ul class="friend-items no-select">
                    <li
                      v-for="item in selected"
                      :key="item.id"
                      @click="triggerContacts(item)"
                      style="padding: 0;"
                    >
                      <div class="avatar">
                        <el-avatar :size="25" :src="item.avatar" shape="square">
                          <img src="~@/assets/image/detault-avatar.jpg" />
                        </el-avatar>
                      </div>
                      <div class="content"><span class="lum-text-ellipsis">{{ item.nickname }}</span></div>
                      <div class="checkbox">
                        <i
                          class="el-icon-success"
                          :class="{ 'icon-active': item.checked }"
                        />
                      </div>
                    </li>
                  </ul>
                </el-scrollbar>
              </el-main>
            </el-container>
          </el-main>
        </el-container>
      </el-main>
      <el-footer height="50px" class="no-padding footer">
        <el-button size="small" @click="close" plain>取消</el-button>
        <el-button
          v-if="from.groupId == 0"
          type="primary"
          size="small"
          @click="createSubmit"
        >
          创建群组<span v-show="selected.length">({{ selected.length }})</span>
        </el-button>
        <el-button v-else type="primary" size="small" @click="inviteSubmit">
          立即邀请({{ selected.length }})
        </el-button>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import {
  ServeCreateGroup,
  ServeInviteGroup,
  ServeGetInviteFriends,
} from '@/api/group'

export default {
  name: 'GroupLaunch',
  props: {
    groupId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      readonly: false,
      from: {
        groupId: 0,
        groupName: '',
      },
      contacts: [],
      search: [],
      searchHeaderShadow: false,
      keywords: '',
      isAvatarCropper: false,
    }
  },
  computed: {
    selected() {
      return this.contacts.filter(item => item.checked)
    },
  },
  watch: {
    keywords(val) {
      this.search =
        val == ''
          ? this.contacts
          : this.contacts.filter(item => {
              return item.nickname.match(this.keywords) != null
            })
    },
    contacts(arr) {
      if (this.keywords == '') {
        this.search = arr
      }
    },
  },
  created() {
    if (this.groupId > 0) {
      this.readonly = true
      this.from.groupId = this.groupId
    }
    this.friendsApi()
  },
  mounted() {
    this.handleScroll()
  },
  methods: {
    // 触发选择联系人事件
    triggerContacts(item) {
      let index = this.contacts.findIndex(val => {
        return val.id === item.id
      })

      this.contacts[index].checked = !this.contacts[index].checked
    },

    // 取消选中的联系人
    delContacts(item) {
      let index = this.contacts.findIndex(val => {
        return val.id === item.id
      })

      this.contacts[index].checked = false
    },

    // 移除所有选中选项
    delAll() {
      this.contacts.forEach((item, i) => {
        this.contacts[i].checked = false
      })
    },

    // 关闭窗口
    close() {
      this.$emit('close')
    },

    // 获取选中的ID列表
    getIds() {
      return this.selected.map(item => item.id)
    },

    // 加载好友列表
    friendsApi() {
      ServeGetInviteFriends({
        group_id: this.from.groupId,
      }).then(res => {
        if (res.code == 200 && res.data) {
          this.contacts = []

          let data = res.data.map(item => {
            return Object.assign(item, {
              nickname: item.friend_remark ? item.friend_remark : item.nickname,
              checked: false,
            })
          })

          this.contacts.push(...data)
        }
      })
    },

    //创建聊天群
    createSubmit() {
      let data = {
        group_avatar: '',
        group_name: this.from.groupName,
        group_profile: '',
        uids: this.getIds().join(','),
      }

      if (data.group_name == '') {
        this.$message('群聊名称不能为空！')
        return
      }

      if (this.getIds().length < 2) {
        this.$message('群聊人数必须大于俩人！')
        return
      }

      ServeCreateGroup({
        avatar: '',
        name: this.from.groupName,
        profile: '',
        ids: this.getIds().join(','),
      }).then(res => {
        if (res.code == 200) {
          this.$emit('create-success', res.data)
        } else {
          this.$message('创建群聊失败！')
        }
      })
    },

    //好友邀请提交
    inviteSubmit() {
      ServeInviteGroup({
        group_id: parseInt(this.from.groupId),
        ids: this.getIds().join(','),
      }).then(res => {
        if (res.code == 200) {
          this.$emit('invite-success')
        } else {
          this.$message('邀请好友失败！')
        }
      })
    },

    // 滚动条监听
    handleScroll() {
      let scrollbarEl = this.$refs.scrollbar.wrap
      scrollbarEl.onscroll = () => {
        this.searchHeaderShadow = scrollbarEl.scrollTop != 0
      }
    },
  },
}
</script>
<style lang="less" scoped>
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}

.lum-dialog-box {
  width: 650px;
  max-width: 650px;
  height: 550px;

  .main {
    .aside-border {
      border-right: 1px solid #f5eeee;
    }
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
    border-top: 1px solid #f5eeee;
  }
}

.search-header {
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.shadow {
    box-shadow: 0 2px 6px 0 rgba(31, 35, 41, 0.05);
  }
}

.friend-items {
  li {
    height: 40px;
    padding: 0 8px;
    box-sizing: border-box;
    margin: 2px 0;
    display: flex;
    flex-direction: row;
    cursor: pointer;

    > div {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .avatar {
      width: 40px;
      justify-content: center;
      flex-shrink: 0;
    }

    .content {
      flex: 1 auto;
      padding-left: 8px;
      overflow: hidden;
      font-size: 14px;
      font-weight: 400;
      &:hover{
        color: #409eff;
      }
    }

    .checkbox {
      flex-shrink: 0;
      width: 20px;
      justify-content: center;

      i {
        color: #ccc;

        &.icon-active {
          color: #26bcfe !important;
        }
      }
    }
  }
}

.group-from {
  label {
    height: 45px;
    line-height: 47px;
    width: 50px;
    color: #606266;
    padding-right: 3px;
    font-size: 13px;
  }

  input {
    height: 25px;
    width: 100%;
    text-indent: 3px;
    color: #a9a4a4;
    font-size: 12px;
    border-bottom: 1px solid #efebeb;
  }
}

.selectd-items {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;

  .selectd-item {
    width: 23%;
    height: 65px;
    margin: 6px 2px 0px 2px;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    box-shadow: 0px 0px 3px 0 rgba(0, 0, 0, 0.1);

    p {
      width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 10px;
      margin-top: 8px;
      text-align: center;
    }

    .del-mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(31, 35, 41, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      color: white;
      transition: ease 0.5s;
      border-radius: 2px;
    }

    &:hover .del-mask {
      display: flex;
    }
  }
}

.mt40 {
  margin-top: 40px;
}
</style>
