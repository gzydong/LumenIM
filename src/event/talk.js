import Base from './base'
import { nextTick } from 'vue'
import ws from '@/connect'
import { parseTime } from '@/utils/datetime'
import * as message from '@/constant/message'
import { formatTalkItem, palyMusic, formatTalkRecord } from '@/utils/talk'
import { isElectronMode } from '@/utils/common'
import { ServeClearTalkUnreadNum, ServeCreateTalk } from '@/api/chat'
import { useTalkStore, useDialogueStore, useSettingsStore } from '@/store'

/**
 * 好友状态事件
 */
class Talk extends Base {
  /**
   * 消息体
   */
  body

  /**
   * 接收者ID
   */
  to_from_id = 0

  /**
   * 发送者ID
   */
  from_id = 0

  /**
   * 聊天类型[1:私聊;2:群聊;]
   */
  talk_mode = 0

  /**
   * 初始化构造方法
   *
   * @param {Object} resource Socket消息
   */
  constructor(data) {
    super()

    const { to_from_id, from_id, talk_mode, body } = data

    Object.assign(this, { from_id, to_from_id, talk_mode, body })

    this.handle()
  }

  /**
   * 判断消息发送者是否来自于我
   * @returns
   */
  isCurrSender() {
    return this.from_id == this.getAccountId()
  }

  /**
   * 获取对话索引
   *
   * @return String
   */
  getIndexName() {
    return `${this.talk_mode}_${this.to_from_id}`
  }

  /**
   * 获取聊天列表左侧的对话信息
   */
  getTalkText() {
    let text = ''
    if (this.body.msg_type != message.ChatMsgTypeText) {
      text = message.ChatMsgTypeMapping[this.body.msg_type]
    } else {
      text = this.body.extra.content.replace(/<img .*?>/g, '')
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
    const findIndex = useTalkStore().findIndex(this.getIndexName())

    // 判断会话列表是否存在，不存在则创建
    if (findIndex == -1) {
      return this.addTalkItem()
    }

    // 判断当前是否正在和好友对话
    if (this.isTalk(this.talk_mode, this.to_from_id)) {
      this.insertTalkRecord()
    } else {
      this.updateTalkItem()
      this.play()
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
    ServeCreateTalk({
      talk_mode: this.talk_mode,
      to_from_id: this.to_from_id
    }).then(({ code, data }) => {
      if (code == 200) {
        useTalkStore().addItem({ ...formatTalkItem(data), unread_num: 1 })
      }
    })
  }

  /**
   * 插入对话记录
   */
  insertTalkRecord() {
    let record = this.body

    // 群成员变化的消息，需要更新群成员列表
    if ([1102, 1103, 1104].includes(record.msg_type)) {
      useDialogueStore().updateGroupMembers()
    }

    useDialogueStore().addDialogueRecord(formatTalkRecord(this.getAccountId(), this.body))

    // 获取聊天面板元素节点
    const el = document.getElementById('imChatPanel')
    if (!el) return

    // 判断的滚动条是否在底部
    const isBottom = Math.ceil(el.scrollTop) + el.clientHeight >= el.scrollHeight

    if (isBottom || this.isCurrSender()) {
      nextTick(() => {
        el.scrollTop = el.scrollHeight

        setTimeout(() => {
          el.scrollTop = el.scrollHeight
        }, 100)
      })
    } else {
      useDialogueStore().setUnreadBubble()
    }

    useTalkStore().updateMessage(
      {
        index_name: this.getIndexName(),
        msg_text: this.getTalkText(),
        updated_at: parseTime(new Date())
      },
      this.isCurrSender()
    )

    if (this.getAccountId() !== this.from_id) {
      ServeClearTalkUnreadNum({
        talk_mode: this.talk_mode,
        to_from_id: this.to_from_id
      })
    }
  }

  /**
   * 更新对话列表记录
   */
  updateTalkItem() {
    useTalkStore().updateMessage(
      {
        index_name: this.getIndexName(),
        msg_text: this.getTalkText(),
        updated_at: parseTime(new Date())
      },
      this.isCurrSender() || this.to_from_id == this.getAccountId()
    )
  }
}

export default Talk
