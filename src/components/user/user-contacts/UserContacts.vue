<template>
  <div class="lum-dialog-mask">
    <el-container class="lum-dialog-box" v-outside="close">
      <el-header class="no-padding header no-select" height="60px">
        <p>我的联系人</p>
        <p class="tools"><i class="el-icon-close" @click="close" /></p>
      </el-header>
      <el-main class="main no-padding">
        <el-container class="full-height">
          <el-aside width="250px" class="aside-border">
            <el-container class="full-height no-select">
              <el-header
                class="no-padding search-header"
                :class="{ shadow: headerShadow }"
                height="50px"
              >
                <el-input
                  v-model="keywords"
                  clearable
                  size="small"
                  placeholder="搜索 | 好友 or 群组"
                  prefix-icon="el-icon-search"
                />
              </el-header>
              <el-main class="no-padding">
                <el-scrollbar
                  ref="scrollbar2"
                  class="full-height"
                  tag="section"
                  :native="false"
                >
                  <ul class="friend-items no-select">
                    <li
                      v-for="item in search"
                      :key="item.index_name"
                      @click="triggerContacts(item)"
                    >
                      <el-avatar
                        class="avatar"
                        style="margin-top: 5px"
                        :size="25"
                        :src="item.avatar"
                      >
                        <img src="~@/assets/image/detault-avatar.jpg" />
                      </el-avatar>
                      <span class="nickname">
                        [{{ item.type == 1 ? '友' : '群' }}] {{ item.nickname }}
                      </span>
                      <span class="select-btn">
                        <i
                          class="el-icon-success"
                          :class="{ 'i-color-green': item.checked }"
                        />
                      </span>
                    </li>
                  </ul>
                </el-scrollbar>
              </el-main>
            </el-container>
          </el-aside>

          <el-main class="no-padding">
            <el-container class="full-height">
              <el-header height="40px">
                <el-divider class="no-select" content-position="left">
                  <span style="color: #c4c5c7">
                    已选联系人 ({{ selected.length }})
                  </span>
                </el-divider>
              </el-header>
              <el-main>
                <el-scrollbar :native="false" tag="section" class="full-height">
                  <div class="selectd-items">
                    <div
                      v-for="item in selected"
                      :key="item.index_name"
                      class="selectd-item no-select"
                    >
                      <el-avatar :size="25" :src="item.avatar">
                        <img src="~@/assets/image/detault-avatar.jpg" />
                      </el-avatar>
                      <p>{{ item.nickname }}</p>
                      <div
                        class="triangle-topleft"
                        :class="{ group: item.type == 2 }"
                      ></div>
                      <div class="del-mask" @click="delContacts(item)">
                        <i class="el-icon-delete" />
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </el-main>
            </el-container>
          </el-main>
        </el-container>
      </el-main>
      <el-footer height="50px" class="no-padding footer">
        <el-button size="small" plain @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="confirm">
          确认选择<span v-show="selected.length">({{ selected.length }})</span>
        </el-button>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import { ServeGetContacts } from '@/api/contacts'
import { ServeGetGroups } from '@/api/group'

export default {
  name: 'UserContacts',
  data() {
    return {
      contacts: [],
      search: [],
      keywords: '',
      headerShadow: false,
    }
  },
  computed: {
    selected() {
      return this.contacts.filter(item => item.checked)
    },
  },
  watch: {
    keywords(val) {
      if (val == '') {
        this.search = this.contacts
      } else {
        this.search = this.contacts.filter(item => {
          return item.nickname.match(this.keywords) != null
        })
      }
    },
    contacts(arr) {
      if (this.keywords == '') {
        this.search = arr
      }
    },
  },
  mounted() {
    this.scrollEvent()
  },
  created() {
    this.loadFriends()
    this.loadUserGroups()
  },
  methods: {
    //触发选择联系人事件
    triggerContacts(item) {
      let index = this.contacts.findIndex(val => {
        return val.index_name == item.index_name
      })

      this.contacts[index].checked = !this.contacts[index].checked
    },
    //取消选中的联系人
    delContacts(item) {
      let index = this.contacts.findIndex(val => {
        return val.index_name == item.index_name
      })

      this.contacts[index].checked = false
    },
    //移除所有选中选项
    delAll() {
      this.contacts.forEach((item, i) => {
        this.contacts[i].checked = false
      })
    },
    //关闭窗口
    close(e) {
      this.delAll()
      this.$emit('close')

      e.stopPropagation();
    },
    //确认按钮点击事件
    confirm() {
      const arr = this.selected.map(item => ({
        id: item.id,
        type: item.type,
      }))

      this.$emit('confirm', arr)
    },

    //加载好友列表
    loadFriends() {
      ServeGetContacts().then(res => {
        if (res.code == 200) {
          for (let o of res.data) {
            this.contacts.push({
              id: o.id,
              type: 1,
              index_name: `1_${o.id}`,
              nickname: o.friend_remark ? o.friend_remark : o.nickname,
              avatar: o.avatar,
              checked: false,
            })
          }
        }
      })
    },

    //加载群聊列表接口
    loadUserGroups() {
      ServeGetGroups().then(res => {
        if (res.code == 200) {
          for (let o of res.data.rows) {
            this.contacts.push({
              id: o.id,
              type: 2,
              index_name: `2_${o.id}`,
              nickname: o.group_name,
              avatar: o.avatar,
              checked: false,
            })
          }
        }
      })
    },

    // 监听自定义滚动条事件
    scrollEvent() {
      let scrollbarEl = this.$refs.scrollbar2.wrap
      scrollbarEl.onscroll = () => {
        this.headerShadow = scrollbarEl.scrollTop > 0
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
    padding: 10px;
    cursor: pointer;
    position: relative;

    &:hover {
      background: #f5f5f5;
    }

    .avatar {
      margin-top: 3px;
    }

    .nickname {
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

    .select-btn {
      position: absolute;
      width: 32px;
      height: 35px;
      right: 3px;
      top: 10px;
      line-height: 35px;
      text-align: center;

      i {
        color: #ccc;
      }

      .i-color-green {
        color: #26bcfe !important;
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
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;

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

    .triangle-topleft {
      width: 0;
      height: 0;
      border-top: 15px solid #03a9f4;
      border-right: 15px solid transparent;
      position: absolute;
      top: 0;
      left: 0;

      &.group {
        border-top: 15px solid #ff9800;
      }
    }

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
</style>
