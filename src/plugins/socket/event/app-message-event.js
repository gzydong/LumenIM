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
   * @param {Number} source 聊天消息类型（1：私聊，2：群聊）
   * @param {Number} receive_id 接收者ID
   * @param {Number} user_id 发送者ID
   */
  isChatting(source, receive_id, user_id) {
    if (source != store.state.dialogue.source) {
      return false
    } else if (source == 1) {
      if (store.state.dialogue.receive_id == receive_id) {
        return true
      } else if (store.state.dialogue.receive_id == user_id) {
        return true
      }
    } else if (source == 2) {
      if (
        store.state.dialogue.receive_id == receive_id ||
        store.state.dialogue.receive_id == this.UserId
      ) {
        return true
      }
    }

    return false
  }
}

export default AppMessageEvent
