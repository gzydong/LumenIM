<template>
  <div>
    <el-container class="ov-hidden full-height">
      <el-container>
        <PanelHeader
          ref="panelHeader"
          :data="params"
          :online="isOnline"
          :keyboard="inputEvent"
          @event="handleHeaderEvent"
        />

        <!-- 主体信息 -->
        <el-main class="main-box no-padding">
          <div
            id="lumenChatPanel"
            class="talks-container lum-scrollbar"
            @scroll="talkPanelScroll($event)"
          >
            <!-- 数据加载状态栏 -->
            <div class="loading-toolbar">
              <span v-if="loadRecord.status == 0" class="color-blue">
                <i class="el-icon-loading" /> 正在加载数据中...
              </span>
              <span
                v-else-if="loadRecord.status == 1"
                class="pointer color-blue"
                @click="loadChatRecords"
              >
                <i class="el-icon-bottom" /> 查看更多消息...
              </span>
              <span v-else> 没有更多消息了... </span>
            </div>

            <!-- 消息主体 -->
            <div v-for="(item, idx) in records" :key="item.id">
              <!-- 群消息 -->
              <div v-if="item.msg_type == 9" class="message-box">
                <invite-message @cat="catFriendDetail" :invite="item.invite" />
              </div>

              <!-- 撤回消息 -->
              <div v-else-if="item.is_revoke == 1" class="message-box">
                <revoke-message :item="item" />
              </div>

              <div v-else-if="item.msg_type == 0" class="message-box">
                <system-text-message :content="item.content" />
              </div>

              <!-- 其它对话消息 -->
              <div
                v-else
                class="message-box record-box"
                :class="{
                  'direction-rt': item.float == 'right',
                  'checkbox-border': multiSelect.isOpen === true,
                }"
              >
                <aside v-show="multiSelect.isOpen" class="checkbox-column">
                  <i
                    class="el-icon-success"
                    :class="{ selected: verifyMultiSelect(item.id) }"
                    @click="triggerMultiSelect(item.id)"
                  />
                </aside>
                <aside class="avatar-column">
                  <el-avatar
                    class="pointer"
                    :size="30"
                    :src="item.avatar"
                    @click.native="catFriendDetail(item.user_id)"
                  />
                </aside>
                <main class="main-column">
                  <div class="talk-title">
                    <span
                      v-show="
                        params.talk_type == 1 ||
                          (params.talk_type == 2 && item.float == 'right')
                      "
                      class="time"
                    >
                      <i class="el-icon-time" />
                      {{ parseTime(item.created_at, '{m}月{d}日 {h}:{i}') }}
                    </span>
                  </div>

                  <div class="talk-content">
                    <span
                      v-show="params.talk_type == 2 && item.float == 'left'"
                      class="nickname"
                    >
                      {{ item.friend_remarks || item.nickname }} |
                      {{ parseTime(item.created_at, '{m}月{d}日 {h}:{i}') }}
                    </span>

                    <!-- 文本消息 -->
                    <text-message
                      v-if="item.msg_type == 1"
                      :content="item.content"
                      :float="item.float"
                      :full-width="false"
                      :arrow="true"
                      @contextmenu.native="onCopy(idx, item, $event)"
                    />

                    <!-- 图片消息 -->
                    <image-message
                      v-else-if="item.msg_type == 2 && item.file.type == 1"
                      :src="item.file.url"
                      @contextmenu.native="onCopy(idx, item, $event)"
                    />

                    <!-- 音频文件预留 -->
                    <audio-message
                      v-else-if="item.msg_type == 2 && item.file.type == 2"
                      :src="item.file.url"
                      @contextmenu.native="onCopy(idx, item, $event)"
                    />

                    <!-- 视频文件预留 -->
                    <video-message
                      v-else-if="item.msg_type == 2 && item.file.type == 3"
                      :src="item.file.url"
                      @contextmenu.native="onCopy(idx, item, $event)"
                    />

                    <!-- 文件消息 -->
                    <file-message
                      v-else-if="item.msg_type == 2 && item.file.type == 4"
                      :file="item.file"
                      :record_id="item.id"
                      @contextmenu.native="onCopy(idx, item, $event)"
                    />

                    <!-- 会话记录消息 -->
                    <forward-message
                      v-else-if="item.msg_type == 3"
                      :forward="item.forward"
                      :record_id="item.id"
                      @contextmenu.native="onCopy(idx, item, $event)"
                    />

                    <!-- 代码块消息 -->
                    <code-message
                      v-else-if="item.msg_type == 4"
                      :code="item.code_block.code"
                      :lang="item.code_block.lang"
                      :maxwidth="true"
                      @contextmenu.native="onCopy(idx, item, $event)"
                    />

                    <!-- 投票消息 -->
                    <vote-message
                      v-else-if="item.msg_type == 5"
                      :record_id="item.id"
                      :vote="item.vote"
                    />

                    <!-- 登录消息 -->
                    <login-message
                      v-else-if="item.msg_type == 8"
                      :detail="item.login"
                    />

                    <!-- 位置消息 -->
                    <location-message
                      v-else-if="item.msg_type == 10"
                      :lat="item.location.latitude"
                      :lng="item.location.longitude"
                    />

                    <!-- 未知消息 -->
                    <div class="unknown-msg" v-else>
                      未知消息类型[{{ item.msg_type }}]
                    </div>

                    <!-- 消息引用(预留) -->
                    <!-- <reply-message /> -->
                  </div>
                </main>
              </div>

              <!-- 消息时间 -->
              <div
                v-show="compareTime(idx, item.created_at)"
                class="datetime no-select"
                v-text="sendTime(item.created_at)"
              />
            </div>
          </div>

          <!-- 置底按钮 -->
          <transition name="el-fade-in-linear">
            <div
              v-show="tipsBoard"
              class="tips-board pointer"
              @click="talkPanelScrollBottom"
            >
              <SvgMentionDown class="svg" />
              <span>回到底部</span>
            </div>
          </transition>

          <!-- 新消息气泡 -->
          <div
            v-show="tipsBoard && unreadMessage.num"
            class="talk-bubble pointer no-select"
            @click="talkPanelScrollBottom"
          >
            <i class="el-icon-chat-dot-round" />
            <span>新消息({{ unreadMessage.num }}条)</span>
            <span>
              &nbsp;#{{ unreadMessage.nickname }}#
              {{ unreadMessage.content }}
            </span>
          </div>
        </el-main>

        <!-- 页脚信息 -->
        <el-footer class="footer-box" height="160">
          <template v-if="multiSelect.isOpen === false">
            <MeEditor
              @send="submitSendMesage"
              @keyboard-event="onKeyboardEvent"
            />
          </template>
          <template v-else>
            <PanelToolbar
              v-model="multiSelect.items.length"
              @event="handleMultiMode"
            />
          </template>
        </el-footer>
      </el-container>

      <!-- 群设置侧边栏 -->
      <el-aside
        v-if="group.panel && params.talk_type == 2"
        width="350px"
        class="panel-aside"
      >
        <GroupPanel
          v-if="params.talk_type == 2"
          :group-id="params.receiver_id"
          @close="hideChatGroup"
          @send-group="hideChatGroup"
          @quit-group="quitGroupSuccess"
          @disturb-change="disturbChange"
          @group-info="syncGroupInfo"
        />
      </el-aside>
    </el-container>

    <!-- 消息管理器 -->
    <transition name="el-fade-in-linear">
      <TalkSearchRecord
        v-if="findChatRecord"
        :params="{
          talk_type: params.talk_type,
          receiver_id: params.receiver_id,
          title: params.nickname,
        }"
        @close="findChatRecord = false"
      />
    </transition>

    <!-- 群公告组件 -->
    <transition name="el-fade-in-linear">
      <GroupNotice
        v-if="group.notice"
        :group-id="params.receiver_id"
        @close="group.notice = false"
      />
    </transition>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import TalkSearchRecord from '@/components/chat/TalkSearchRecord'
import GroupPanel from '@/components/group/GroupPanel'
import GroupNotice from '@/components/group/GroupNotice'
import MeEditor from '@/components/editor/MeEditor'
import PanelHeader from './PanelHeader'
import PanelToolbar from './PanelToolbar'
import SocketInstance from '@/im-server/socket-instance'
import { SvgMentionDown } from '@/core/icons'
import { formateTime, parseTime, copyTextToClipboard } from '@/utils/functions'
import {
  ServeTalkRecords,
  ServeForwardRecords,
  ServeRemoveRecords,
  ServeRevokeRecords,
  ServeSendTalkText,
} from '@/api/chat'

export default {
  name: 'TalkEditorPanel',
  components: {
    MeEditor,
    GroupPanel,
    TalkSearchRecord,
    GroupNotice,
    SvgMentionDown,
    PanelToolbar,
    PanelHeader,
  },
  props: {
    // 对话相关参数
    params: {
      type: Object,
      default: function() {
        return {
          // 消息来源（1：好友私信 2:群聊）
          talk_type: 0,
          // 消息接收者ID（好友ID或者群聊ID）
          receiver_id: 0,
          nickname: '',
        }
      },
    },

    // 用户是否在线
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 记录加载相关参数
      loadRecord: {
        status: 0,
        minRecord: 0,
      },

      // 多选相关操作
      multiSelect: {
        isOpen: false,
        items: [],
        mode: 0,
      },

      // 群组Box
      group: {
        panel: false,
        notice: false,
      },

      // 键盘输入事件
      keyboardEvent: {
        isShow: false,
        time: 0,
      },

      // 聊天记录管理器数据
      findChatRecord: false,

      // 置底按钮是否显示
      tipsBoard: false,
    }
  },
  computed: {
    ...mapState({
      unreadMessage: state => state.talks.unreadMessage,
      inputEvent: state => state.notify.inputEvent,
      uid: state => state.user.uid,
      records: state => state.dialogue.records,
      index_name: state => state.dialogue.index_name,
    }),
  },
  watch: {
    // 监听面板传递参数
    params() {
      this.loadRecord.minRecord = 0
      this.tipsBoard = false
      this.multiSelect = {
        isOpen: false,
        items: [],
        mode: 0,
      }

      this.loadChatRecords()
    },
  },
  mounted() {
    this.loadChatRecords()
  },
  methods: {
    parseTime,
    sendTime: formateTime,

    // 处理 Header 组件事件
    handleHeaderEvent(event_name) {
      switch (event_name) {
        case 'history':
          this.findChatRecord = true
          break
        case 'notice':
          this.group.notice = true
          break
        case 'setting':
          this.group.panel = !this.group.panel
          break
      }
    },

    // 回车键发送消息回调事件
    submitSendMesage(content) {
      ServeSendTalkText({
        receiver_id: parseInt(this.params.receiver_id),
        talk_type: parseInt(this.params.talk_type),
        text: content,
      }).then(() => {
        this.$store.commit('UPDATE_TALK_ITEM', {
          index_name: this.index_name,
          draft_text: '',
        })
      })
    },

    // 推送编辑事件消息
    onKeyboardEvent(text) {
      this.$store.commit('UPDATE_TALK_ITEM', {
        index_name: this.index_name,
        draft_text: text,
      })

      // 判断当前对话是否属于私聊信息
      if (this.params.talk_type == 2 || !this.isOnline) return

      // 判断是否推送键盘输入事件消息
      if (!this.$store.state.settings.keyboardEventNotify) {
        return false
      }

      let time = new Date().getTime()
      // 判断在两秒内是否已推送事件
      if (this.keyboardEvent.time != 0 && time - this.keyboardEvent.time < 2000)
        return

      this.keyboardEvent.time = time

      // 调用父类Websocket组件发送消息
      SocketInstance.emit('event_talk_keyboard', {
        sender_id: parseInt(this.uid),
        receiver_id: parseInt(this.params.receiver_id),
      })
    },

    // 加载用户聊天详情信息
    loadChatRecords() {
      const user_id = this.uid
      const data = {
        record_id: this.loadRecord.minRecord,
        receiver_id: this.params.receiver_id,
        talk_type: this.params.talk_type,
        limit: 30,
      }

      this.loadRecord.status = 0

      let el = document.getElementById('lumenChatPanel')
      let scrollHeight = el.scrollHeight

      ServeTalkRecords(data)
        .then(res => {
          // 防止点击切换过快消息返回延迟，导致信息错误
          if (
            res.code != 200 ||
            (data.receiver_id != this.params.receiver_id &&
              data.talk_type != this.params.talk_type)
          ) {
            return
          }

          const records = res.data.rows.map(item => {
            item.float = 'center'
            if (item.user_id > 0) {
              item.float = item.user_id == user_id ? 'right' : 'left'
            }

            return item
          })

          // 判断是否是初次加载
          if (data.record_id == 0) {
            this.$store.commit('SET_DIALOGUE', [])
          }

          this.$store.commit('UNSHIFT_DIALOGUE', records.reverse())

          this.loadRecord.status = records.length >= res.data.limit ? 1 : 2

          this.loadRecord.minRecord = res.data.record_id

          this.$nextTick(() => {
            if (data.record_id == 0) {
              el.scrollTop = el.scrollHeight
            } else {
              el.scrollTop = el.scrollHeight - scrollHeight
            }
          })
        })
        .catch(() => {
          this.loadRecord.status = 1
        })
    },

    // 多选处理方式
    handleMultiMode(value) {
      if (value == 'close') {
        this.closeMultiSelect()
        return false
      }

      if (this.multiSelect.items.length <= 1) {
        return false
      }

      if (value == 'forward' || value == 'merge_forward') {
        this.multiSelect.mode = value == 'forward' ? 1 : 2
        if (this.verifyMultiSelectType(3)) {
          this.$notify({
            title: '消息转发',
            message: '会话记录不支持合并转发',
          })
          return false
        }

        this.$contacts({
          confirm: this.confirmSelectContacts,
        })
      } else if (value == 'delete') {
        this.multiSelect.mode = 3

        // 批量删除
        let ids = this.multiSelect.items
        ServeRemoveRecords({
          talk_type: this.params.talk_type,
          receiver_id: this.params.receiver_id,
          record_id: ids.join(','),
        }).then(res => {
          if (res.code == 200) {
            this.delRecords(ids).closeMultiSelect()
          }
        })
      }
    },

    // 确认消息转发联系人事件
    confirmSelectContacts(data) {
      let user_ids = []
      let group_ids = []
      data.forEach(item => {
        if (item.type == 1) {
          user_ids.push(item.id)
        } else {
          group_ids.push(item.id)
        }
      })

      ServeForwardRecords({
        forward_mode: this.multiSelect.mode,
        talk_type: parseInt(this.params.talk_type),
        receiver_id: parseInt(this.params.receiver_id),
        records_ids: this.multiSelect.items.join(','),
        receive_user_ids: user_ids.join(','),
        receive_group_ids: group_ids.join(','),
      }).then(res => {
        if (res.code == 200) {
          this.closeMultiSelect()
          this.$notify({
            title: '消息转发',
            message: '消息转发成功...',
            type: 'success',
          })
        }
      })
    },

    // 处理消息时间是否显示
    compareTime(index, datetime) {
      if (datetime == undefined) {
        return false
      }

      if (this.records[index].is_revoke == 1) {
        return false
      }

      datetime = datetime.replace(/-/g, '/')
      let time = Math.floor(Date.parse(datetime) / 1000)
      let currTime = Math.floor(new Date().getTime() / 1000)

      // 当前时间5分钟内时间不显示
      if (currTime - time < 300) return false

      // 判断是否是最后一条消息,最后一条消息默认显示时间
      if (index == this.records.length - 1) {
        return true
      }

      let nextDate = this.records[index + 1].created_at.replace(/-/g, '/')

      return !(
        parseTime(new Date(datetime), '{y}-{m}-{d} {h}:{i}') ==
        parseTime(new Date(nextDate), '{y}-{m}-{d} {h}:{i}')
      )
    },

    // 查看好友用户信息
    catFriendDetail(value) {
      this.$user(value)
    },

    // 撤回消息
    revokeRecords(index, item) {
      ServeRevokeRecords({
        record_id: item.id,
      }).then(res => {
        if (res.code == 200) {
          this.$store.commit('UPDATE_DIALOGUE', { id: item.id, is_revoke: 1 })
        }
      })
    },

    // 删除消息
    removeRecords(index, item) {
      let receiver_id = item.receiver_id
      if (item.talk_type == 1 && item.user_id != this.uid) {
        receiver_id = item.user_id
      }

      ServeRemoveRecords({
        talk_type: item.talk_type,
        receiver_id: receiver_id,
        record_id: item.id.toString(),
      }).then(res => {
        if (res.code == 200) {
          this.$store.commit('DELETE_DIALOGUE', index)
        }
      })
    },

    // 转发消息
    forwardRecords(idx, item) {
      this.$notify({
        title: '温馨提示',
        message: '单条记录转发开发中...',
      })
    },

    // 从列表中删除记录
    delRecords(arr) {
      this.$store.commit('BATCH_DELETE_DIALOGUE', arr)
      return this
    },

    // 开启多选模式
    openMultiSelect() {
      this.multiSelect.isOpen = true
    },

    // 关闭多选模式
    closeMultiSelect() {
      this.multiSelect.isOpen = false
      this.multiSelect.items = []
    },

    // 判断记录是否选中
    verifyMultiSelect(records_id) {
      return this.multiSelect.items.indexOf(records_id) >= 0
    },

    // 触发多选事件
    triggerMultiSelect(records_id) {
      let i = this.multiSelect.items.indexOf(records_id)
      if (i >= 0) {
        this.multiSelect.items.splice(i, 1)
      } else {
        if (this.multiSelect.items.length >= 30) {
          this.$notify({
            title: '温馨提示',
            message: '批量操作最大支持30条数据...',
          })
          return false
        }
        this.multiSelect.items.push(records_id)
      }
    },

    // 验证是否存在选择的指定类型的消息
    verifyMultiSelectType(type) {
      return this.records.some(item => {
        return this.verifyMultiSelect(item.id) && item.msg_type == type
      })
    },

    // 消息点击右键触发自定义菜单
    onCopy(idx, item, event) {
      let menus = []
      let content = ''
      if (document.getElementById('copy_class_' + item.id)) {
        content = document.getElementById('copy_class_' + item.id).innerText
      }

      if (content) {
        menus.push({
          label: '复制',
          icon: 'el-icon-document-copy',
          customClass: 'cus-contextmenu-item',
          onClick: () => {
            copyTextToClipboard(content)
          },
        })
      }

      if (item.user_id == this.uid) {
        let time =
          new Date().getTime() - Date.parse(item.created_at.replace(/-/g, '/'))
        if (Math.floor(time / 1000 / 60) < 2) {
          menus.push({
            label: '撤回',
            icon: 'el-icon-s-flag',
            customClass: 'cus-contextmenu-item',
            onClick: () => {
              this.revokeRecords(idx, item)
            },
          })
        }
      }

      menus.push({
        label: '删除',
        icon: 'el-icon-delete',
        customClass: 'cus-contextmenu-item',
        onClick: () => {
          this.removeRecords(idx, item)
        },
      })

      menus.push({
        label: '转发',
        icon: 'el-icon-s-promotion',
        customClass: 'cus-contextmenu-item',
        onClick: () => {
          this.forwardRecords(idx, item)
        },
      })

      menus.push({
        label: '引用',
        icon: 'el-icon-connection',
        customClass: 'cus-contextmenu-item',
        onClick: () => {},
      })

      menus.push({
        label: '多选',
        icon: 'el-icon-finished',
        customClass: 'cus-contextmenu-item',
        onClick: () => {
          this.openMultiSelect()
        },
      })

      // 判断是否是图片消息
      if (item.msg_type == 2 && item.file.type == 1) {
        menus.push({
          label: '收藏',
          icon: 'el-icon-picture',
          customClass: 'cus-contextmenu-item',
          onClick: () => {
            this.$store.commit('SAVE_USER_EMOTICON', {
              record_id: item.id,
            })
          },
        })
      }

      this.$contextmenu({
        items: menus,
        event,
        customClass: 'cus-contextmenu',
        zIndex: 3,
        minWidth: 120,
      })

      this.closeMultiSelect()
      event.preventDefault()
    },

    hideChatGroup() {
      this.group.panel = false
    },

    // 修改群聊免打扰状态
    disturbChange(detail) {
      this.$store.commit('UPDATE_TALK_ITEM', {
        index_name: `2_${this.params.receiver_id}`,
        is_disturb: parseInt(detail.status),
      })
    },

    // 退出群聊回调事件
    quitGroupSuccess() {
      this.$emit('close-talk')
    },

    // 同步群信息
    syncGroupInfo(groupInfo) {
      this.$refs.panelHeader.setGroupNum(groupInfo.members_num)
    },

    // 对话面板滚动事件
    talkPanelScroll(e) {
      if (e.target.scrollTop == 0 && this.loadRecord.status == 1) {
        this.loadChatRecords()
        return
      }

      const height = e.target.scrollTop + e.target.clientHeight + 5
      this.tipsBoard = height < e.target.scrollHeight
      if (this.tipsBoard == false && this.unreadMessage.num > 0) {
        this.$store.commit('CLEAR_TLAK_UNREAD_MESSAGE')
      }
    },

    // 聊天版本滚动到底部
    talkPanelScrollBottom() {
      let el = document.getElementById('lumenChatPanel')
      el.scrollTop = el.scrollHeight
    },
  },
}
</script>
<style lang="less" scoped>
.main-box {
  position: relative;
}

.panel-aside {
  border-left: 1px solid #f5eeee;
}

/* 面板页脚 */
.footer-box {
  height: 160px !important;
  padding: 0;
  border-top: 1px solid #f5f5f5;
}

.tips-board {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 20px;
  height: 30px;
  width: 100px;
  border-radius: 20px;
  font-size: 12px;
  background-color: #fff;
  box-shadow: 0 2.5px 10px 0 rgba(31, 35, 41, 0.1);
  color: #1f2329;

  span {
    margin-left: 5px;
    margin-top: -2px;
  }

  .svg {
    width: 10px;
    height: 10px;
    color: black;
  }
}

.talk-bubble {
  position: absolute;
  left: 0px;
  bottom: 20px;
  max-width: 300px;
  height: 40px;
  line-height: 40px;
  border-radius: 0 20px 20px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: white;
  padding: 0 15px 0 30px;
  font-size: 13px;
  background: #409eff;

  i {
    font-size: 22px;
    position: absolute;
    left: 5px;
    top: 9px;
  }
}

.talks-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 15px 30px;
  overflow-y: auto;

  .message-box {
    width: 100%;
    min-height: 30px;
    margin-bottom: 5px;
  }

  .loading-toolbar {
    height: 30px;
    line-height: 30px;
    margin: 5px 0;
    text-align: center;
    user-select: none;
    font-size: 13px;
    color: #cec4c4;

    .color-blue {
      color: #409eff;
    }
  }

  .datetime {
    height: 30px;
    line-height: 30px;
    color: #ccc9c9;
    font-size: 12px;
    text-align: center;
    margin: 5px 0;
  }

  .record-box {
    display: flex;
    flex-direction: row;
    transition: 0.5s ease;

    .checkbox-column {
      display: flex;
      justify-content: center;
      flex-basis: 40px;
      flex-shrink: 0;
      order: 1;
      user-select: none;
      padding-top: 25px;

      i {
        color: #ccc;
        cursor: pointer;
        font-size: 22px;
        &.selected {
          color: #409eff !important;
        }
      }
    }

    .avatar-column {
      width: 40px;
      flex-basis: 40px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      order: 2;
      user-select: none;
      padding-top: 22px;
      flex-direction: column;
    }

    .main-column {
      flex: 1 auto;
      order: 3;
      position: relative;
      box-sizing: border-box;
      padding: 5px;
      overflow: hidden;

      .talk-title {
        display: flex;
        align-items: center;
        height: 15px;
        margin-bottom: 2px;
        font-size: 10px;
        user-select: none;
        color: #a7a0a0;
        opacity: 0;
        transition: 0.5s ease;

        &.show {
          opacity: 1 !important;
        }

        span {
          transform: scale(0.9);
        }
      }

      .talk-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        box-sizing: border-box;
        width: 100%;

        .nickname {
          font-size: 12px;
          color: #a7a0a0;
          margin: -4px 0 4px -8px;
          transform: scale(0.9);
        }
      }

      &:hover {
        .talk-title {
          opacity: 1;
        }
      }
    }

    &.direction-rt {
      .avatar-column {
        order: 3;
      }

      .main-column {
        order: 2;

        .talk-title {
          justify-content: flex-end;
        }

        .talk-content {
          align-items: flex-end;
        }
      }
    }

    &.checkbox-border {
      border: 1px dashed #c4c4ec;
      &:hover {
        border-color: #409eff;
      }
    }
  }
}

.lum-scrollbar::-webkit-scrollbar {
  background-color: #ffffff;
}
</style>
