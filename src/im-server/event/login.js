import Base from './base'

/**
 * 好友状态事件
 */
class Login extends Base {
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
    this.getStoreInstance().commit('UPDATE_TALK_ITEM', {
      index_name: `1_${this.resource.user_id}`,
      is_online: this.resource.status,
    })
  }
}

export default Login
