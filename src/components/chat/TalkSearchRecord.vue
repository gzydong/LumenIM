<template>
  <div class="lum-dialog-mask">
    <el-container class="lum-dialog-box" :class="{ 'full-screen': fullscreen }">
      <el-header height="60px" class="header">
        <p>消息管理器</p>
        <p class="title">
          <span>{{ query.talk_type == 1 ? '好友' : '群' }}【{{ title }}】</span>
        </p>
        <p class="tools">
          <i
            class="iconfont"
            style="transform: scale(0.85)"
            :class="fullscreen ? 'icon-tuichuquanping' : 'icon-quanping'"
            @click="fullscreen = !fullscreen"
          />
          <i class="el-icon-close" @click="$emit('close')" />
        </p>
      </el-header>

      <el-header height="38px" class="sub-header">
        <i
          class="iconfont pointer"
          :class="{ 'icon-shouqi2': broadside, 'icon-zhankai': !broadside }"
          @click="triggerBroadside"
        />
        <div class="search-box no-select">
          <i class="el-icon-search" />
          <input
            v-model="search.keyword"
            type="text"
            maxlength="30"
            placeholder="搜索"
            @keyup.enter="searchText($event)"
          />
        </div>
      </el-header>

      <el-container class="full-height ov-hidden">
        <el-aside width="200px" class="broadside" v-show="broadside">
          <el-container class="full-height">
            <el-header height="40px" class="aside-header">
              <div
                class="item"
                :class="{ selected: contacts.show == 'friends' }"
                @click="contacts.show = 'friends'"
              >
                我的好友({{ contacts.friends.length }})
              </div>
              <div class="item-shuxian">|</div>
              <div
                class="item"
                :class="{ selected: contacts.show == 'groups' }"
                @click="contacts.show = 'groups'"
              >
                我的群组({{ contacts.groups.length }})
              </div>
            </el-header>
            <el-main class="no-padding">
              <el-scrollbar class="full-height" tag="section" :native="false">
                <div
                  v-for="item in contacts[contacts.show]"
                  class="contacts-item pointer"
                  :class="{
                    selected:
                      query.talk_type == item.type &&
                      query.receiver_id == item.id,
                  }"
                  :key="item.id"
                  @click="triggerMenuItem(item)"
                >
                  <div class="avatar">
                    <el-avatar :size="20" :src="item.avatar" shape="square">
                      <img src="~@/assets/image/detault-avatar.jpg" />
                    </el-avatar>
                  </div>
                  <div class="content" v-text="item.name"></div>
                </div>
              </el-scrollbar>
            </el-main>
          </el-container>
        </el-aside>

        <!-- 聊天记录阅览 -->
        <el-main v-show="showBox == 0" class="no-padding">
          <el-container class="full-height">
            <el-header height="40px" class="type-items">
              <span
                v-for="tab in tabType"
                :class="{ active: query.msg_type == tab.type }"
                @click="triggerLoadType(tab.type)"
                >{{ tab.name }}
              </span>
            </el-header>

            <el-main
              v-if="records.isEmpty"
              class="history-record animated fadeIn"
            >
              <div class="empty-records">
                <img src="~@/assets/image/chat-search-no-message.png" />
                <p>暂无聊天记录</p>
              </div>
            </el-main>

            <el-main v-else class="history-record">
              <el-scrollbar class="full-height" tag="section" :native="false">
                <div
                  v-for="record in records.items"
                  :key="record.id"
                  class="message-group"
                >
                  <div class="left-box">
                    <el-avatar
                      shape="square"
                      fit="contain"
                      :size="30"
                      :src="record.avatar"
                    />
                  </div>

                  <div class="right-box">
                    <div class="msg-header">
                      <span class="name">
                        {{
                          record.nickname_remarks
                            ? record.nickname_remarks
                            : record.nickname
                        }}
                      </span>
                      <el-divider direction="vertical" />
                      <span class="time">{{ record.created_at }}</span>
                    </div>

                    <!-- 文本消息 -->
                    <text-message
                      v-if="record.msg_type == 1"
                      :content="record.content"
                    />

                    <!-- 文件 - 图片消息 -->
                    <image-message
                      v-else-if="
                        record.msg_type == 2 && record.file.type == 1
                      "
                      :src="record.file.url"
                    />

                    <!-- 文件 - 音频消息 -->
                    <audio-message
                      v-else-if="
                        record.msg_type == 2 && record.file.type == 2
                      "
                      :src="record.file.url"
                    />

                    <!-- 文件 - 视频消息 -->
                    <video-message
                      v-else-if="
                        record.msg_type == 2 && record.file.type == 3
                      "
                      :src="record.file.url"
                    />

                    <!-- 文件 - 其它格式文件 -->
                    <file-message
                      v-else-if="
                        record.msg_type == 2 && record.file.type == 4
                      "
                      :file="record.file"
                      :record_id="record.id"
                    />

                    <!-- 会话记录消息 -->
                    <forward-message
                      v-else-if="record.msg_type == 3"
                      :forward="record.forward"
                      :record_id="record.id"
                    />

                    <!-- 代码块消息 -->
                    <code-message
                      v-else-if="record.msg_type == 4"
                      :code="record.code_block.code"
                      :lang="record.code_block.lang"
                    />

                    <!-- 投票消息 -->
                    <vote-message
                      v-else-if="record.msg_type == 5"
                      :record_id="record.id"
                      :vote="record.vote"
                    />

                    <div v-else class="other-message">未知消息类型</div>
                  </div>
                </div>

                <!-- 数据加载栏 -->
                <div v-show="records.loadStatus == 1" class="load-button blue">
                  <i class="el-icon-loading" />
                  <span>加载数据中...</span>
                </div>
                <div v-show="records.loadStatus == 0" class="load-button">
                  <i class="el-icon-arrow-down" />
                  <span @click="loadChatRecord">加载更多...</span>
                </div>
              </el-scrollbar>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { ServeGetContacts } from '@/api/contacts'
import { ServeGetGroups } from '@/api/group'
import { ServeFindTalkRecords } from '@/api/chat'
import { formateSize as renderSize, download, imgZoom } from '@/utils/functions'

export default {
  name: 'TalkSearchRecord',
  props: {
    params: {
      type: Object,
      default: () => {
        return {
          talk_type: 0,
          receiver_id: 0,
          title: '',
        }
      },
    },
  },
  data() {
    return {
      fullscreen: false,

      user_id: this.$store.state.user.uid,
      title: '',

      // 侧边栏相关信息
      broadside: false,
      contacts: {
        show: 'friends',
        friends: [],
        groups: [],
      },

      query: {
        talk_type: 0,
        receiver_id: 0,
        msg_type: 0,
      },

      // 用户聊天记录
      records: {
        record_id: 0,
        items: [],
        isEmpty: false,
        loadStatus: 0,
      },

      showBox: 0,

      tabType: [
        { name: '全部', type: 0 },
        { name: '图片/视频/文件', type: 2 },
        { name: '会话记录', type: 3 },
        { name: '代码块', type: 4 },
        { name: '群投票', type: 5 },
      ],

      search: {
        keyword: '', // 关键字查询
        date: '', // 时间查询
        page: 1, // 当前分页
        totalPage: 50, // 总分页
        items: [], // 数据列表
        isShowDate: false,
      },
    }
  },
  mounted() {
    this.title = this.params.title
    this.query = {
      talk_type: this.params.talk_type,
      receiver_id: this.params.receiver_id,
      msg_type: 0,
    }

    this.loadChatRecord(0)
  },
  created() {
    this.loadFriends()
    this.loadGroups()
  },
  methods: {
    download,
    renderSize,

    // 获取图片信息
    getImgStyle(url) {
      return imgZoom(url, 200)
    },

    // 获取会话记录消息名称
    getForwardTitle(item) {
      let arr = [...new Set(item.map(v => v.nickname))]
      return arr.join('、') + '的会话记录'
    },

    // 获取好友列表
    loadFriends() {
      ServeGetContacts().then(({ code, data }) => {
        if (code == 200) {
          this.contacts.friends = data.map(item => {
            return {
              id: item.id,
              type: 1,
              avatar: item.avatar,
              name: item.friend_remark ? item.friend_remark : item.nickname,
            }
          })
        }
      })
    },

    // 获取群聊列表
    loadGroups() {
      ServeGetGroups().then(({ code, data }) => {
        if (code == 200) {
          this.contacts.groups = data.rows.map(item => {
            return {
              id: item.id,
              type: 2,
              name: item.group_name,
              avatar: item.avatar,
            }
          })
        }
      })
    },

    // 左侧联系人菜单点击事件
    triggerMenuItem(item) {
      this.title = item.name
      this.query.talk_type = item.type
      this.query.receiver_id = item.id
      this.showBox = 0

      this.triggerLoadType(0)
    },

    // 加载历史记录
    loadChatRecord() {
      let data = {
        talk_type: this.query.talk_type,
        receiver_id: this.query.receiver_id,
        record_id: this.records.record_id,
        msg_type: this.query.msg_type,
        limit: 30,
      }

      if (this.records.loadStatus == 1) return

      this.records.loadStatus = 1
      ServeFindTalkRecords(data)
        .then(res => {
          if (res.code != 200) return

          let records = data.record_id == 0 ? [] : this.records.items

          records.push(...res.data.rows)

          this.records.items = records
          this.records.loadStatus =
            res.data.rows.length < res.data.limit ? 2 : 0

          if (this.records.items.length == 0) {
            this.records.isEmpty = true
          } else {
            this.records.record_id = this.records.items[
              this.records.items.length - 1
            ].id
          }
        })
        .catch(() => {
          this.records.loadStatus = 0
        })
    },

    triggerLoadType(type) {
      this.records.record_id = 0
      this.query.msg_type = type
      this.records.isEmpty = false
      this.records.items = []

      this.loadChatRecord()
    },

    searchText() {
      if (this.search.keyword == '') {
        this.showBox = 0
        return false
      }

      this.$notify.info({
        title: '消息',
        message: '查询功能正在开发中...',
      })
    },

    triggerBroadside() {
      this.broadside = !this.broadside
    },
  },
}
</script>
<style lang="less" scoped>
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}

.lum-dialog-mask {
  z-index: 1;
}

.lum-dialog-box {
  width: 100%;
  height: 600px;
  max-width: 800px;
  transition: 1s ease;

  &.full-screen {
    width: 100%;
    height: 100%;
    max-width: unset;
    margin: 0;
    border-radius: 0px;
  }

  .sub-header {
    height: 38px;
    line-height: 38px;
    font-size: 12px;
    border-bottom: 1px solid #f9f4f4;
    margin-top: 10px;
    padding: 0 10px;
    position: relative;

    i {
      font-size: 22px;
      color: #6f6a6a;
    }

    .search-box {
      position: absolute;
      width: 230px;
      height: 32px;
      top: 2px;
      right: 10px;
      background: #f9f4f4;
      border-radius: 5px;

      i {
        position: absolute;
        left: 10px;
        top: 8px;
        font-size: 16px;
      }

      input {
        position: absolute;
        left: 35px;
        top: 3px;
        height: 25px;
        width: 184px;
        color: #7d7171;
        background: #f9f4f4;
      }
    }
  }

  .broadside {
    @border: 1px solid #f9f9f9;
    border-right: @border;
    user-select: none;
    transition: 3s ease;

    .aside-header {
      display: flex;
      flex-direction: row;
      height: 100%;
      border-bottom: @border;
      padding: 0;

      > div {
        text-align: center;
        line-height: 40px;
        font-size: 13px;
        font-weight: 400;
      }

      .item {
        flex: 1;
        cursor: pointer;

        &.selected {
          color: #66b1ff;
        }
      }

      .item-shuxian {
        flex-basis: 1px;
        flex-shrink: 0;
        color: rgb(232 224 224);
      }
    }

    .contacts-item {
      height: 35px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding-left: 10px;
      position: relative;

      .avatar {
        flex-basis: 40px;
        flex-shrink: 0;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .content {
        flex: 1 1;
        height: 100%;
        line-height: 35px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 13px;
        padding-right: 10px;
      }

      &:hover,
      &.selected {
        background-color: #f5f5f5;
      }
    }
  }
}

/* first box */
.type-items {
  padding: 0 0 0 10px;
  line-height: 40px;
  user-select: none;
  border-bottom: 1px solid #f9f4f4;

  .active {
    color: #03a9f4;
    font-weight: 500;
  }

  span {
    height: 40px;
    width: 45px;
    text-align: center;
    cursor: pointer;
    margin: 0 10px;
    font-size: 12px;
    font-weight: 400;
  }
}

.history-record {
  padding: 10px 0;
}

.load-button {
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  &.blue {
    color: #51b2ff;
  }

  span {
    margin-left: 5px;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
  }
}

.empty-records {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #cccccc;
  font-weight: 300;
  font-size: 14px;

  img {
    width: 100px;
  }
}

@import '~@/assets/css/talk/talk-records.less';
</style>
