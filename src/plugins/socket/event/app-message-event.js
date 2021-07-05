import store from '@/store'
import { Notification } from 'element-ui'

/**
 * 处理App消息
 */
class AppMessageEvent {
  /**
   * 初始化
   */
  constructor() {
    this.$notify = Notification
  }

  /**
   * 获取当前登录用户的ID
   */
  get UserId() {
    return store.state.user.uid
  }

  /**
   * 判断消息是否来自当前对话
   *
   * @param {Number} talk_type 聊天消息类型（1：私聊，2：群聊）
   * @param {Number} receiver_id 接收者ID
   * @param {Number} sender_id 发送者ID
   */
  isChatting(talk_type, receiver_id, sender_id) {
    if (talk_type != store.state.dialogue.talk_type) {
      return false
    } else if (talk_type == 1) {
      if (store.state.dialogue.receiver_id == receiver_id) {
        return true
      } else if (store.state.dialogue.receiver_id == sender_id) {
        return true
      }
    } else if (talk_type == 2) {
      if (
        store.state.dialogue.receiver_id == receiver_id ||
        store.state.dialogue.receiver_id == this.UserId
      ) {
        return true
      }
    }

    return false
  }
}

export default AppMessageEvent
