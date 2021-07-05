import AppMessageEvent from './app-message-event'
import store from '@/store'

/**
 * 好友邀请消息处理
 */
class RevokeEvent extends AppMessageEvent {
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
      !this.isChatting(
        this.resource.talk_type,
        this.resource.receiver_id,
        this.resource.sender_id
      )
    ) {
      return false
    }

    let index = store.state.dialogue.records.findIndex(
      item => item.id == this.resource.record_id
    )

    store.commit('UPDATE_DIALOGUE', {
      index,
      item: {
        is_revoke: 1,
      },
    })
  }
}

export default RevokeEvent
