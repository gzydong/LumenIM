import Base from './base'

/**
 * 好友邀请消息处理
 */
class GroupJoin extends Base {
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
      message: '您有一条入群消息通知,请注意查收...',
      duration: 5000,
    })
  }
}

export default GroupJoin
