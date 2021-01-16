<template>
  <div class="lum-dialog-mask">
    <el-container class="lum-dialog-box">
      <el-header height="60px" class="header">
        <p>消息管理器</p>
        <p class="title">
          <span v-if="findSource == 1">好友【{{ title }}】</span>
          <span v-else>群【{{ title }}】</span>
        </p>
        <p class="tools">
          <i class="el-icon-close" @click="close"></i>
        </p>
      </el-header>

      <el-header height="38px" class="header-tool">
        <i
          class="iconfont pointer"
          :class="{ 'icon-shouqi2': broadside, 'icon-zhankai': !broadside }"
          @click="triggerBroadside"
        ></i>
        <div class="search-box no-select">
          <i class="iconfont icon-sousuo"></i>
          <input
            type="text"
            placeholder="关键字搜索"
            v-model="search.keyword"
            @keyup.enter="searchText($event)"
          />
        </div>
      </el-header>

      <el-container class="hv100 ov-hidden">
        <el-aside width="200px" class="broadside" v-show="broadside">
          <el-container class="hv100">
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
            <el-main class="padding0">
              <el-scrollbar :native="false" tag="section" class="hv100">
                <div
                  v-for="(item, i) in contacts[contacts.show]"
                  class="contacts-item"
                  @click="triggerMenuItem(item)"
                  :class="{
                    selected:
                      findSource == item.type && findReceiveId == item.id,
                  }"
                >
                  <div class="avatar">
                    <el-avatar :size="20" :src="item.avatar">
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
        <el-main v-show="showBox == 0" class="padding0">
          <el-container class="hv100">
            <el-header height="40px" class="type-items">
              <span
                :class="{ active: records.msgType == 0 }"
                @click="triggerLoadType(0)"
                >全部</span
              >
              <span
                :class="{ active: records.msgType == 5 }"
                @click="triggerLoadType(5)"
                >代码块</span
              >
              <span
                :class="{ active: records.msgType == 2 }"
                @click="triggerLoadType(2)"
                >文件</span
              >
              <span
                :class="{ active: records.msgType == 4 }"
                @click="triggerLoadType(4)"
                >会话记录</span
              >
            </el-header>

            <el-main
              class="history-record animated fadeIn"
              v-if="records.isEmpty"
            >
              <div class="empty-records">
                <img src="~@/assets/image/chat-search-no-message.png" />
                <p>暂无聊天记录</p>
              </div>
            </el-main>
            <el-main class="history-record" v-else>
              <el-scrollbar :native="false" tag="section" class="hv100">
                <div
                  class="message-group"
                  v-for="(record, i) in records.items"
                  :key="record.id"
                >
                  <div class="left-box">
                    <img
                      :src="record.avatar"
                      :onerror="$store.state.detaultAvatar"
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
                      <span class="time"> / {{ record.created_at }}</span>
                    </div>

                    <!-- 文本消息 -->
                    <div class="msg-text" v-if="record.msg_type == 1">
                      <pre
                        class="pre"
                        v-html="record.content"
                        v-href="'rgb(51, 51, 51)'"
                      ></pre>
                    </div>

                    <!-- 文件-图片消息 -->
                    <div
                      class="msg-image"
                      v-else-if="
                        record.msg_type == 2 && record.file.file_type == 1
                      "
                    >
                      <el-image
                        fit="cover"
                        :style="getImgStyle(record.file.file_url)"
                        :src="record.file.file_url"
                      >
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                        <div slot="placeholder" class="image-slot">
                          图片加载中
                        </div>
                      </el-image>
                    </div>

                    <!-- 文件-音频消息 -->
                    <div
                      class="msg-audio"
                      v-else-if="
                        record.msg_type == 2 && record.file.file_type == 2
                      "
                    >
                      文件-音频消息
                    </div>

                    <!-- 文件-视频消息 -->
                    <div
                      class="msg-video"
                      v-else-if="
                        record.msg_type == 2 && record.file.file_type == 3
                      "
                    >
                      文件-视频消息
                    </div>

                    <!-- 其它格式的文件消息 -->
                    <div
                      class="msg-file"
                      v-else-if="
                        record.msg_type == 2 && record.file.file_type == 4
                      "
                    >
                      <div class="file-icon">
                        {{ record.file.file_suffix.toUpperCase() }}
                      </div>
                      <div class="file-info">
                        <p>{{ record.file.original_name }}</p>
                        <p>
                          {{ renderSize(record.file.file_size) }}
                          <span>该文件永久保存</span>
                        </p>
                      </div>
                      <div class="file-tool">
                        <i
                          class="iconfont icon-download"
                          @click="download(record.id)"
                        ></i>
                      </div>
                    </div>

                    <!-- 代码块消息 -->
                    <div class="msg-text" v-else-if="record.msg_type == 5">
                      <pre class="pre" v-text="record.code_block.code"></pre>
                    </div>

                    <!-- 会话记录消息 -->
                    <div
                      class="msg-records"
                      v-else-if="record.msg_type == 4"
                      @click="catForwardRecords(record.id)"
                    >
                      <p class="records-title">
                        <span
                          v-text="getForwardTitle(record.forward.list)"
                        ></span>
                      </p>
                      <div class="records-list">
                        <p v-for="info in record.forward.list">
                          <span v-text="info.nickname"></span>
                          <span>:</span>
                          <span v-text="info.text"></span>
                        </p>
                      </div>
                      <p class="records-footer">
                        <span>转发：会话记录 ({{ record.forward.num }}条)</span>
                      </p>
                    </div>
                    <div v-else class="other-message">未知消息类型</div>
                  </div>
                </div>

                <div
                  class="load-button"
                  v-if="records.loadStatus == 1"
                  style="color: #51b2ff"
                >
                  <i class="el-icon-loading"></i>
                  <span>加载数据中...</span>
                </div>

                <div class="load-button" v-if="records.loadStatus == 0">
                  <i class="el-icon-arrow-up"></i>
                  <span @click="loadChatRecord">加载更多...</span>
                </div>
              </el-scrollbar>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-container>

    <!-- 会话记录查看器 -->
    <talk-forward-record ref="forwardRecordsRef" />
  </div>
</template>
<script>
import TalkForwardRecord from "@/components/chat/TalkForwardRecord";
import {
  ServeFindTalkRecords,
  ServeSearchTalkRecords,
  ServeGetRecordsContext,
} from "@/api/chat";
import { ServeFindUserGroups, friendsServ } from "@/api/user";
import {
  formateSize,
  download,
  imgZoom,
  replaceEmoji,
} from "@/utils/functions";

export default {
  name: "talk-search-record",
  components: {
    TalkForwardRecord,
  },
  props: {
    receiveId: {
      type: [Number, String],
      default: 0,
    },
    source: {
      type: [Number, String],
      default: 0,
    },
    titleName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 侧边栏相关信息
      broadside: false,
      contacts: {
        show: "friends",
        friends: [],
        groups: [],
      },

      uid: this.$store.state.user.uid,
      title: "",
      findType: 0, //查询的方式 0:所有 1:图片 2:文件
      findSource: 0, //查询的聊天类型 1:私聊 2:群聊
      findReceiveId: 0, //接收者ID(用户ID或群ID)

      //用户聊天记录
      records: {
        recordId: 0,
        msgType: 0,
        items: [],
        isEmpty: false,
        loadStatus: 0,
      },

      showBox: 0,

      search: {
        keyword: "", //关键字查询
        date: "", //时间查询
        page: 1, //当前分页
        totalPage: 50, //总分页
        items: [], //数据列表
        isShowDate: false,
      },
    };
  },
  mounted() {
    this.title = this.titleName;
    this.findSource = this.source;
    this.findReceiveId = this.receiveId;

    this.loadChatRecord(0);
  },
  created() {
    this.loadFriends();
    this.loadGroups();
  },
  methods: {
    //格式化文件大小
    renderSize: formateSize,

    //下载文件
    download: download,

    //关闭窗口
    close() {
      this.$emit("close");
    },

    //获取图片信息
    getImgStyle(url) {
      return imgZoom(url, 200);
    },

    //获取会话记录消息名称
    getForwardTitle(item) {
      let arr = [...new Set(item.map((v) => v.nickname))];
      return arr.join("、") + "的会话记录";
    },

    //查看会话记录列表
    catForwardRecords(records_id) {
      this.$refs.forwardRecordsRef.open(records_id);
    },

    //获取好友列表
    loadFriends() {
      friendsServ().then((res) => {
        if (res.code == 200) {
          this.contacts.friends = [];
          for (let friend of res.data) {
            this.contacts.friends.push({
              id: friend.id,
              type: 1,
              name: friend.friend_remark
                ? friend.friend_remark
                : friend.nickname,
              avatar: friend.avatar,
            });
          }
        }
      });
    },

    //获取群聊列表
    loadGroups() {
      ServeFindUserGroups().then((res) => {
        if (res.code == 200) {
          this.contacts.groups = [];
          for (let group of res.data) {
            this.contacts.groups.push({
              id: group.id,
              type: 2,
              name: group.group_name,
              avatar: group.avatar,
            });
          }
        }
      });
    },

    //左侧联系人菜单点击事件
    triggerMenuItem(itemInfo) {
      this.title = itemInfo.name;
      this.findSource = itemInfo.type;
      this.findReceiveId = itemInfo.id;
      this.showBox = 0;

      this.triggerLoadType(0);
    },

    //加载历史记录
    loadChatRecord() {
      let data = {
        record_id: this.records.recordId,
        receive_id: this.findReceiveId,
        msg_type: this.records.msgType,
        source: this.findSource,
      };

      if (this.records.loadStatus == 1) return;

      this.records.loadStatus = 1;
      ServeFindTalkRecords(data)
        .then((res) => {
          if (res.code != 200) return;

          let records = data.record_id == 0 ? [] : this.records.items;

          records.push(
            ...res.data.rows.map((item) => {
              if (item.msg_type == 1) {
                item.content = replaceEmoji(item.content);
              }
              return item;
            })
          );

          this.records.items = records;
          this.records.loadStatus =
            res.data.rows.length < res.data.limit ? 2 : 0;

          if (this.records.items.length == 0) {
            this.records.isEmpty = true;
          } else {
            this.records.recordId = this.records.items[
              this.records.items.length - 1
            ].id;
          }
        })
        .catch((err) => {
          this.records.loadStatus = 0;
        });
    },

    triggerLoadType(type) {
      this.records.recordId = 0;
      this.records.msgType = type;
      this.records.isEmpty = false;
      this.records.items = [];

      this.loadChatRecord();
    },

    searchText(e) {
      if (this.search.keyword == "") {
        this.showBox = 0;
        return false;
      }

      this.$notify.info({
        title: "消息",
        message: "查询功能正在开发中...",
      });
    },

    triggerBroadside() {
      this.broadside = !this.broadside;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}

.lum-dialog-box {
  width: 90%;
  height: 600px;
  max-width: 800px;

  .header-tool {
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
      height: 30px;
      top: 2px;
      right: 10px;
      background: #f9f4f4;
      border-radius: 5px;

      i {
        position: absolute;
        left: 10px;
        top: -3px;
      }

      input {
        position: absolute;
        left: 38px;
        top: 3px;
        height: 25px;
        width: 184px;
        color: #7d7171;
        background: #f9f4f4;
      }
    }
  }

  .broadside {
    border-right: 1px solid #f9f9f9;
    user-select: none;

    .aside-header {
      display: flex;
      flex-direction: row;
      height: 100%;
      border-bottom: 1px solid #f9f9f9;
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
      margin: 5px 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding-left: 10px;

      &:hover,
      &.selected {
        background-color: #f5f5f5;
      }

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
        font-size: 12px;
        padding-right: 10px;
        cursor: pointer;
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
    font-size: 13px;
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

@import "~@/assets/css/talk/talk-records.less";
</style>

