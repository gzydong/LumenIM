import { h } from 'vue'
import { NAvatar } from 'naive-ui'
import { useTalkStore, useUserStore, useDialogueStore } from '@/store'
import { notifyIcon } from '@/constant/default'
import WsSocket from './plugins/ws-socket'
import EventTalk from './event/talk'
import EventKeyboard from './event/keyboard'
import EventLogin from './event/login'
import EventRevoke from './event/revoke'
import { getAccessToken, isLoggedIn } from './utils/auth'

const urlCallback = () => {
  if (!isLoggedIn()) {
    window.location.reload()
  }

  return `${import.meta.env.VITE_SOCKET_API}/wss/default.io?token=${getAccessToken()}`
}

class Connect {
  private conn: WsSocket

  constructor() {
    this.conn = new WsSocket(urlCallback, {
      onError: (evt: any) => {
        console.log('Websocket 连接失败回调方法', evt)
      },
      // Websocket 连接成功回调方法
      onOpen: () => {
        // 更新 WebSocket 连接状态
        useUserStore().updateSocketStatus(true)
        useTalkStore().loadTalkList()
      },
      // Websocket 断开连接回调方法
      onClose: () => {
        // 更新 WebSocket 连接状态
        useUserStore().updateSocketStatus(false)
      }
    })

    this.bindEvents()
  }

  /**
   * 连接
   */
  connect() {
    this.conn.connection()
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.conn.close()
  }

  /**
   * 连接状态
   * @returns WebSocket 连接状态
   */
  isConnect() {
    if (!this.conn.connect) return false

    return this.conn.connect.readyState === 1
  }

  /**
   * 推送事件消息
   * @param event 事件名
   * @param data  数据
   */
  emit(event: string, data: any) {
    this.conn.emit(event, data)
  }

  /**
   * 绑定监听消息事件
   */
  bindEvents() {
    this.onPing()
    this.onPong()
    this.onImMessage()
    this.onImMessageRead()
    this.onImContactStatus()
    this.onImMessageRevoke()
    this.onImMessageKeyboard()
  }

  onPing() {
    this.conn.on('ping', () => this.emit('pong', ''))
  }

  onPong() {
    this.conn.on('pong', () => {})
  }

  onImMessage() {
    this.conn.on('im.message', (data: any) => new EventTalk(data))
  }

  onImMessageRead() {
    this.conn.on('im.message.read', (data: any) => {
      const dialogueStore = useDialogueStore()

      if (dialogueStore.index_name !== `1_${data.sender_id}`) {
        return
      }

      const { msg_ids = [] } = data

      for (const msgid of msg_ids) {
        dialogueStore.updateDialogueRecord({ msg_id: msgid, is_read: 1 })
      }
    })
  }

  onImContactStatus() {
    // 好友在线状态事件
    this.conn.on('im.contact.status', (data: any) => new EventLogin(data))
  }

  onImMessageKeyboard() {
    // 好友键盘输入事件
    this.conn.on('im.message.keyboard', (data: any) => new EventKeyboard(data))
  }

  // 即将废弃
  onImMessageRevoke() {
    // 消息撤回事件
    this.conn.on('im.message.revoke', (data: any) => new EventRevoke(data))
  }

  onImContactApply() {
    // 好友申请事件
    this.conn.on('im.contact.apply', (data: any) => {
      window['$notification'].create({
        title: '好友申请通知',
        content: data.remark,
        description: `申请人: ${data.friend.nickname}`,
        meta: data.friend.created_at,
        avatar: () =>
          h(NAvatar, {
            size: 'small',
            round: true,
            src: notifyIcon,
            style: 'background-color:#fff;'
          }),
        duration: 3000
      })
      useUserStore().isContactApply = true
    })
  }

  onImGroupApply() {
    // 群申请消息
    this.conn.on('im.group.apply', () => {
      window['$notification'].create({
        title: '入群申请通知',
        content: '有新的入群申请，请注意查收',
        avatar: () =>
          h(NAvatar, {
            size: 'small',
            round: true,
            src: notifyIcon,
            style: 'background-color:#fff;'
          }),
        duration: 30000
      })

      useUserStore().isGroupApply = true
    })
  }

  onEventError() {
    this.conn.on('event_error', (data: any) => {
      window['$message'] && window['$message'].error(JSON.stringify(data))
    })
  }
}

// 导出单例
export default new Connect()
