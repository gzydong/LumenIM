import { h } from 'vue'
import { NAvatar } from 'naive-ui'
import { useTalkStore, useUserStore } from '@/store'
import { notifyIcon } from '@/constant/default'
import WsSocket from './plugins/websocket'
import EventTalk from './event/talk'
import EventKeyboard from './event/keyboard'
import EventRevoke from './event/revoke'
import { getToken, isLogin } from './utils/auth'

const urlCallback = () => {
  if (!isLogin()) {
    window.location.reload()
  }

  return `${import.meta.env.VITE_SOCKET_API}/wss/default.io?token=${getToken()}`
}

class Connect {
  private conn: WsSocket

  constructor() {
    this.conn = new WsSocket(urlCallback, {
      onError: () => {
        // console.error('WebSocket 连接失败:', evt)
      },
      onOpen: () => {
        useUserStore().updateSocketStatus(true)
        useTalkStore().loadTalkList()
      },
      onClose: () => {
        useUserStore().updateSocketStatus(false)
      }
    })

    this.bindEvents()
  }

  connect() {
    this.conn.connection()
  }

  disconnect() {
    this.conn.close()
  }

  isConnect() {
    return this.conn.connect?.readyState === WebSocket.OPEN
  }

  emit(event: string, data: any) {
    this.conn.emit(event, data)
  }

  bindEvents() {
    this.onPing()
    this.onPong()
    this.onImMessage()
    this.onImMessageKeyboard()
    this.onImMessageRevoke()
    this.onImContactApply()
    this.onImGroupApply()
    this.onEventError()

    this.conn.on('webrtc_answer', () => {})
    this.conn.on('webrtc_ice_candidate', () => {})
    this.conn.on('webrtc_offer', () => {})
  }

  onPing() {
    this.conn.on('ping', () => this.emit('pong', ''))
  }

  onPong() {
    this.conn.on('pong', () => {})
    this.conn.on('connect', () => {})
  }

  onImMessage() {
    this.conn.on('im.message', (data: any) => new EventTalk(data))
  }

  onImMessageKeyboard() {
    this.conn.on('im.message.keyboard', (data: any) => new EventKeyboard(data))
  }

  onImMessageRevoke() {
    this.conn.on('im.message.revoke', (data: any) => new EventRevoke(data))
  }

  onImContactApply() {
    this.conn.on('im.contact.apply', (data: any) => {
      window['$notification']?.create({
        title: '好友申请通知',
        content: data.remark,
        description: `申请人: ${data.nickname}`,
        meta: data.apply_time,
        avatar: () =>
          h(NAvatar, {
            size: 'small',
            round: true,
            src: notifyIcon,
            style: 'background-color:#fff;'
          }),
        duration: 10000
      })

      useUserStore().isContactApply = true
    })
  }

  onImGroupApply() {
    this.conn.on('im.group.apply', () => {
      window['$notification']?.create({
        title: '入群申请通知',
        content: '有新的入群申请，请注意查收',
        avatar: () =>
          h(NAvatar, {
            size: 'small',
            round: true,
            src: notifyIcon,
            style: 'background-color:#fff;'
          }),
        duration: 10000
      })

      useUserStore().isGroupApply = true
    })
  }

  onEventError() {
    this.conn.on('event_error', (data: any) => {
      console.error('WebSocket事件错误:', data)
      window['$message']?.error(`错误代码: ${data.error_code} - ${data.error_message}`)
    })
  }
}

// 导出单例
export default new Connect()
