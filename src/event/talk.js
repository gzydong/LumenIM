import Base from './base'
import { nextTick } from 'vue'
import ws from '@/connect'
import { parseTime } from '@/utils/datetime'
import * as message from '@/constant/message'
import { formatTalkItem, palyMusic, formatTalkRecord } from '@/utils/talk'
import { isElectronMode } from '@/utils/common'
import { ServeClearTalkUnreadNum, ServeCreateTalkList } from '@/api/chat'
import { useTalkStore, useDialogueStore, useSettingsStore } from '@/store'

/**
 * 好友状态事件
 */
class Talk extends Base {
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

  /**
   * 初始化构造方法
   *
   * @param {Object} resource Socket消息
   */
  constructor(resource) {
    super()

    this.sender_id = resource.sender_id
    this.receiver_id = resource.receiver_id
    this.talk_type = resource.talk_type
    this.resource = resource.data

    this.handle()
  }

  /**
   * 判断消息发送者是否来自于我
   * @returns
   */
  isCurrSender() {
    return this.sender_id == this.getAccountId()
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
   * 获取聊天列表左侧的对话信息
   */
  getTalkText() {
    let text = ''
    if (this.resource.msg_type != message.ChatMsgTypeText) {
      text = message.ChatMsgTypeMapping[this.resource.msg_type]
    } else {
      text = this.resource.extra.content.replace(/<img .*?>/g, '')
    }

    return text
  }

  // 播放提示音
  play() {
    // 客户端有消息提示
    if (isElectronMode()) return

    useSettingsStore().isPromptTone && palyMusic()
  }

  handle() {
    // 不是自己发送的消息则需要播放提示音
    if (!this.isCurrSender()) {
      this.play()
    }

    // 判断会话列表是否存在，不存在则创建
    if (useTalkStore().findTalkIndex(this.getIndexName()) == -1) {
      return this.addTalkItem()
    }

    // 判断当前是否正在和好友对话
    if (this.isTalk(this.talk_type, this.receiver_id, this.sender_id)) {
      this.insertTalkRecord()
    } else {
      this.updateTalkItem()
    }
  }

  /**
   * 显示消息提示
   * @returns
   */
  showMessageNocice() {
    if (useSettingsStore().isLeaveWeb) {
      const notification = new Notification('LumenIM 在线聊天', {
        dir: 'auto',
        lang: 'zh-CN',
        body: '您有新的消息请注意查收'
      })

      notification.onclick = () => {
        notification.close()
      }
    } else {
      window['$notification'].create({
        title: '消息通知',
        content: '您有新的消息请注意查收',
        duration: 3000
      })
    }
  }

  /**
   * 加载对接节点
   */
  addTalkItem() {
    let receiver_id = this.sender_id
    let talk_type = this.talk_type

    if (talk_type == 1 && this.receiver_id != this.getAccountId()) {
      receiver_id = this.receiver_id
    } else if (talk_type == 2) {
      receiver_id = this.receiver_id
    }

    ServeCreateTalkList({
      talk_type,
      receiver_id
    }).then(({ code, data }) => {
      if (code == 200) {
        let item = formatTalkItem(data)
        item.unread_num = 1
        useTalkStore().addItem(item)
      }
    })
  }

  /**
   * 插入对话记录
   */
  insertTalkRecord() {
    let record = this.resource

    // 群成员变化的消息，需要更新群成员列表
    if ([1102, 1103, 1104].includes(record.msg_type)) {
      useDialogueStore().updateGroupMembers()
    }

    useDialogueStore().addDialogueRecord(formatTalkRecord(this.getAccountId(), this.resource))

    if (!this.isCurrSender()) {
      // 推送已读消息
      setTimeout(() => {
        ws.emit('im.message.read', {
          receiver_id: this.sender_id,
          msg_ids: [this.resource.msg_id]
        })
      }, 1000)
    }

    // 获取聊天面板元素节点
    const el = document.getElementById('imChatPanel')
    if (!el) return

    // 判断的滚动条是否在底部
    const isBottom = Math.ceil(el.scrollTop) + el.clientHeight >= el.scrollHeight

    if (isBottom || record.user_id == this.getAccountId()) {
      nextTick(() => {
        el.scrollTop = el.scrollHeight + 1000
      })
    } else {
      useDialogueStore().setUnreadBubble()
    }

    useTalkStore().updateItem({
      index_name: this.getIndexName(),
      msg_text: this.getTalkText(),
      updated_at: parseTime(new Date())
    })

    if (this.talk_type == 1 && this.getAccountId() !== this.sender_id) {
      ServeClearTalkUnreadNum({
        talk_type: 1,
        receiver_id: this.sender_id
      })
    }
  }

  /**
   * 更新对话列表记录
   */
  updateTalkItem() {
    useTalkStore().updateMessage({
      index_name: this.getIndexName(),
      msg_text: this.getTalkText(),
      updated_at: parseTime(new Date())
    })
  }
}

export default Talk
