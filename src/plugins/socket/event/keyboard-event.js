import AppMessageEvent from './app-message-event'
import store from '@/store'

/**
 * 好友邀请消息处理
 */
class KeyboardEvent extends AppMessageEvent {
  /**
   * @var resource 资源
   */
  resource

  /**
   * 初始化构造方法
   *
   * @param {Object} resource Socket消息
   */
  constructor(resource) {
    super()

    this.resource = resource
  }

  handle() {
    if (store.state.dialogue.index_name == null) return false

    this.isShow() && store.commit('UPDATE_KEYBOARD_EVENT')
  }

  isShow() {
    let [talk_type, receiver_id] = store.state.dialogue.index_name.split('_')

    return !(talk_type == 2 || receiver_id != this.resource.sender_id)
  }
}

export default KeyboardEvent
