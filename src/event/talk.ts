import Base from './base'
import { nextTick } from 'vue'
import { parseTime } from '@/utils/datetime'
import * as message from '@/constant/message'
import type { ISession } from '@/types/chat'
import { formatTalkItem, playMusic, formatTalkRecord } from '@/utils/talk'
import { isElectronMode } from '@/utils/electron'
import { ServeClearTalkUnreadNum, ServeCreateTalk } from '@/api/chat'
import { toApi } from '@/api'
import { useTalkStore, useDialogueStore, useSettingsStore } from '@/store'

/**
 * 好友状态事件
 */
class Talk extends Base {
  /**
   * 消息体
   */
  body: any

  /**
   * 接收者ID
   */
  to_from_id: number = 0

  /**
   * 发送者ID
   */
  from_id: number = 0

  /**
   * 聊天类型[1:私聊;2:群聊;]
   */
  talk_mode: number = 0

  /**
   * 初始化构造方法
   *
   * @param {Object} resource Socket消息
   */
  constructor(data: any) {
    super()

    const { to_from_id, from_id, talk_mode, body } = data

    Object.assign(this, { from_id, to_from_id, talk_mode, body })

    this.handle()
  }

  /**
   * 判断消息发送者是否来自于我
   * @returns
   */
  isCurrSender(): boolean {
    return this.from_id == this.getAccountId()
  }

  /**
   * 获取对话索引
   *
   * @return String
   */
  getIndexName(): string {
    return `${this.talk_mode}_${this.to_from_id}`
  }

  /**
   * 获取聊天列表左侧的对话信息
   */
  getTalkText(): string {
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

    useSettingsStore().isPromptTone && playMusic()
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

      if (useSettingsStore().isLeaveWeb) {
        this.showMessageNocice()
      }
    } else {
      this.updateTalkItem()
      this.play()
      this.showMessageNocice()
    }
  }

  /**
   * 显示消息提示
   * @returns
   */
  showMessageNocice() {
    const notification = new Notification('LumenIM 在线聊天', {
      dir: 'auto',
      lang: 'zh-CN',
      body: '您有新的聊天消息请注意查收!'
    })

    notification.onclick = () => {
      notification.close()
    }
  }

  /**
   * 加载对接节点
   */
  async addTalkItem() {
    const { code, data } = await toApi(ServeCreateTalk, {
      talk_mode: this.talk_mode,
      to_from_id: this.to_from_id
    })

    if (code !== 200) return

    useTalkStore().addItem({ ...formatTalkItem(data), unread_num: 1 } as ISession)
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

    useTalkStore().updateMessage(
      {
        index_name: this.getIndexName(),
        msg_text: this.getTalkText(),
        updated_at: parseTime(new Date()) as string
      },
      this.isCurrSender()
    )

    if (this.getAccountId() !== this.from_id) {
      ServeClearTalkUnreadNum({
        talk_mode: this.talk_mode,
        to_from_id: this.to_from_id
      })
    }

    this.scrollToBottom()
  }

  // 将面板滚动条滚动到最底部
  scrollToBottom() {
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
  }

  /**
   * 更新对话列表记录
   */
  updateTalkItem() {
    useTalkStore().updateMessage(
      {
        index_name: this.getIndexName(),
        msg_text: this.getTalkText(),
        updated_at: parseTime(new Date()) as string
      },
      this.isCurrSender() || this.to_from_id == this.getAccountId()
    )
  }
}

export default Talk
