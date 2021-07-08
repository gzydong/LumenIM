import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import AppMessageEvent from './app-message-event'
import { parseTime } from '@/utils/functions'
import { formateTalkItem, findTalkIndex } from '@/utils/talk'
import { ServeClearTalkUnreadNum, ServeCreateTalkList } from '@/api/chat'

/**
 * 聊天消息处理
 */
class TalkEvent extends AppMessageEvent {
  /**
   * @var resource 资源
   */
  resource

  /**
   * 发送者ID
   */
  sender_id = 0

  /**
   * 接收者ID
   */
  receiver_id = 0

  /**
   * 聊天类型[1:私聊;2:群聊;]
   */
  talk_type = 0

  constructor(resource) {
    super()

    this.sender_id = resource.sender_id
    this.receiver_id = resource.receiver_id
    this.talk_type = resource.talk_type

    this.resource = resource.data
  }

  /**
   * 获取对话索引
   *
   * @return String
   */
  getIndexName() {
    if (this.talk_type == 2) {
      return `${this.talk_type}_${this.receiver_id}`
    }

    let receiver_id = this.isCurrSender() ? this.receiver_id : this.sender_id

    return `${this.talk_type}_${receiver_id}`
  }

  /**
   * 判断消息发送者是否来自于我
   * @return
   */
  isCurrSender() {
    return this.sender_id == this.UserId
  }

  handle() {
    const indexName = this.getIndexName()
    if (!this.isTalkPage()) {
      return !this.isCurrSender() && this.showMessageNocice(indexName)
    }

    const index = findTalkIndex(indexName)
    if (index == -1) {
      return this.loadTalkItem()
    }

    if (this.isChatting(this.talk_type, this.receiver_id, this.sender_id)) {
      this.updateTalkRecord(index)
    } else {
      this.updateTalkItem(index)
    }
  }

  /**
   * 显示消息提示
   *
   * @param {String} index_name
   * @returns
   */
  showMessageNocice(index_name) {
    let tag = this.talk_type == 1 ? '[私信]' : '[群聊]'
    let group_name = this.resource.group_name || '好友'
    let nickname = this.resource.nickname || this.resource.group_name
    let content = this.getTalkText()

    this.$notify({
      title: `${tag} 聊天通知`,
      message: `「${group_name}」@${nickname} : ${content}`,
      duration: 3000,
      customClass: 'talk-notify pointer',
      onClick: function() {
        sessionStorage.setItem('send_message_index_name', index_name)
        router.push('/')
        this.close()
      },
      position: 'top-right',
    })

    store.commit('INCR_UNREAD_NUM')
  }

  getFloatType() {
    let user_id = this.resource.user_id

    if (user_id == 0) return 'center'

    return user_id == this.UserId ? 'right' : 'left'
  }

  /**
   * 更新对话记录
   *
   * @param {Number} index 聊天列表的索引
   */
  updateTalkRecord(index) {
    let record = this.resource

    record.float = this.getFloatType()

    store.commit('PUSH_DIALOGUE', record)

    // 获取聊天面板元素节点
    let elChatPanel = document.getElementById('lumenChatPanel')

    // 判断的滚动条是否在底部
    let isBottom =
      Math.ceil(elChatPanel.scrollTop) + elChatPanel.clientHeight >=
      elChatPanel.scrollHeight

    if (isBottom || record.user_id == this.UserId) {
      Vue.nextTick(() => {
        // 更新聊天面板滚动条置底
        elChatPanel.scrollTop = elChatPanel.scrollHeight
      })
    } else {
      store.commit('SET_TLAK_UNREAD_MESSAGE', {
        content: this.getTalkText(),
        nickname: record.nickname,
      })
    }

    store.commit('UPDATE_TALK_ITEM', {
      index,
      item: {
        msg_text: this.getTalkText(),
        updated_at: parseTime(new Date()),
      },
    })

    if (this.talk_type == 1 && this.UserId !== this.sender_id) {
      ServeClearTalkUnreadNum({
        talk_type: store.state.dialogue.talk_type,
        receiver_id: store.state.dialogue.receiver_id,
      })
    }
  }

  /**
   * 更新对话列表记录
   *
   * @param {Number} index 聊天列表的索引
   */
  updateTalkItem(index) {
    store.commit('INCR_UNREAD_NUM')
    if (index == -1) {
      // 对话列表不存在需请求后端...
      return
    }

    store.commit('UPDATE_TALK_MESSAGE', {
      index,
      item: {
        msg_text: this.getTalkText(),
        updated_at: parseTime(new Date()),
      },
    })
  }

  /**
   * 获取聊天列表左侧的对话信息
   */
  getTalkText() {
    let text = this.resource.content
    switch (this.resource.msg_type) {
      case 2:
        let file_type = this.resource.file.file_type
        text = file_type == 1 ? '[图片消息]' : '[文件消息]'
        break
      case 3:
        text = '[会话记录]'
        break
      case 4:
        text = '[代码消息]'
        break
    }

    return text
  }

  /**
   * 判断用户是否打开对话页
   */
  isTalkPage() {
    let path = router.currentRoute.fullPath
    return !(path != '/message' && path != '/')
  }

  /**
   * 加载对接节点
   */
  loadTalkItem() {
    let receiver_id = this.sender_id
    let talk_type = this.talk_type

    if (talk_type == 2 || this.sender_id == this.UserId) {
      receiver_id = this.receiver_id
    }

    ServeCreateTalkList({
      talk_type,
      receiver_id,
    }).then(({ code, data }) => {
      if (code == 200) {
        data.unread_num++
        store.commit('INSERT_TALK_ITEM', formateTalkItem(data))
      }
    })
  }
}

export default TalkEvent
