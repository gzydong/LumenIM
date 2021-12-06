import Base from './base'

/**
 * 键盘输入事件
 */
class Keyboard extends Base {
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
    let params = this.getTalkParams()

    // 判断当前是否正在对话
    if (params.index_name === null) {
      return false
    }

    // 判断是否是私信
    if (params.talk_type != 1) {
      return false
    }

    // 判断消息是否来当前对话
    if (params.receiver_id != this.resource.sender_id) {
      return false
    }

    let store = this.getStoreInstance()

    store.commit('UPDATE_KEYBOARD_EVENT')
  }
}

export default Keyboard
