import Base from './base'
import store from '@/store'

/**
 * 撤销消息处理
 */
class Revoke extends Base {
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
    if (
      this.isTalk(
        this.resource.talk_type,
        this.resource.receiver_id,
        this.resource.sender_id
      )
    ) {
      store.commit('UPDATE_DIALOGUE', {
        id: this.resource.record_id,
        is_revoke: 1,
      })
    }
  }
}

export default Revoke
