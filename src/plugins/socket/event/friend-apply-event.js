import AppMessageEvent from './app-message-event'
import store from '@/store'

/**
 * 好友邀请消息处理
 */
class FriendApplyEvent extends AppMessageEvent {
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
    this.$notify({
      title: '好友申请',
      dangerouslyUseHTMLString: true,
      message:
        '<p style="color:red;margin-top:10px;">您有一条好友申请消息,请注意查收...</p>',
      duration: 0,
      type: 'info',
    })

    store.commit('INCR_APPLY_NUM')
  }
}

export default FriendApplyEvent
