import Base from './base'
import { nextTick } from 'vue'
import socket from '@/socket'
import { parseTime } from '@/utils/datetime'
import { WebNotify } from '@/utils/notification'
import {
  formatTalkItem,
  findTalkIndex,
  palyMusic,
  formatTalkRecord,
} from '@/utils/talk'
import { ServeClearTalkUnreadNum, ServeCreateTalkList } from '@/api/chat'
import { useTalkStore } from '@/store/talk'
import { useDialogueStore } from '@/store/dialogue'
import { useNotifyStore } from '@/store/notify'

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
    let text = this.resource.content

    switch (this.resource.msg_type) {
      case 2:
        text = '[文件消息]'
        break
      case 3:
        text = '[会话记录]'
        break
      case 4:
        text = '[代码消息]'
        break
      case 8:
        text = '[系统通知] 账号登录提醒！'
        break
    }

    return text
  }

  // 播放提示音
  play() {
    // 客户端有消息提示
    if (window.electron) {
      return
    }

    useNotifyStore().isPromptTone && palyMusic()
  }

  handle() {
    // TODO 需要做消息去重处理

    if (!this.isCurrSender()) {
      // 判断消息是否来自于我自己，否则会提示消息通知
      this.showMessageNocice()
    }

    // 判断会话列表是否存在，不存在则创建
    if (findTalkIndex(this.getIndexName()) == -1) {
      return this.addTalkItem()
    }

    // 判断当前是否正在和好友对话
    if (this.isTalk(this.talk_type, this.receiver_id, this.sender_id)) {
      this.insertTalkRecord()
    } else {
      this.play()
      this.updateTalkItem()
    }
  }

  /**
   * 显示消息提示
   * @returns
   */
  showMessageNocice() {
    if (useNotifyStore().isLeaveWeb) {
      if (useNotifyStore().isWebNotify) {
        WebNotify('LumenIM 在线聊天', {
          dir: 'auto',
          lang: 'zh-CN',
          body: '您有新的消息请注意查收！！！',
        })
      }
    } else {
      $notification.create({
        title: '消息通知',
        content: '您有新的消息请注意查收！！！',
        duration: 3000,
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
      receiver_id,
    }).then(({ code, data }) => {
      if (code == 200) {
        useTalkStore().addItem(formatTalkItem(data))
        this.play()
      }
    })
  }

  /**
   * 插入对话记录
   */
  insertTalkRecord() {
    let record = this.resource

    useDialogueStore().addDialogueRecord(
      formatTalkRecord(this.getAccountId(), this.resource)
    )

    if (!this.isCurrSender()) {
      // 推送已读消息
      setTimeout(() => {
        socket.emit('im.message.read', {
          receiver_id: this.sender_id,
          msg_id: [this.resource.id],
        })
      }, 1000)
    }

    // 获取聊天面板元素节点
    let el = document.getElementById('lumenChatPanel')

    // 判断的滚动条是否在底部
    let isBottom = Math.ceil(el.scrollTop) + el.clientHeight >= el.scrollHeight

    if (isBottom || record.user_id == this.getAccountId()) {
      nextTick(() => {
        el.scrollTop = el.scrollHeight + 1000
      })
    } else {
      useDialogueStore().setUnreadBubble(1)
    }

    useTalkStore().updateItem({
      index_name: this.getIndexName(),
      msg_text: this.getTalkText(),
      updated_at: parseTime(new Date()),
    })

    if (this.talk_type == 1 && this.getAccountId() !== this.sender_id) {
      ServeClearTalkUnreadNum({
        talk_type: 1,
        receiver_id: this.sender_id,
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
      updated_at: parseTime(new Date()),
    })
  }
}

export default Talk
