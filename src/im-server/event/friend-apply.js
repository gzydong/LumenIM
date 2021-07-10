import Base from './base'
import store from '@/store'
import router from '@/router'

/**
 * 好友邀请消息处理
 */
class FriendApply extends Base {
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
    store.commit('INCR_APPLY_NUM')

    this.$notify({
      title: '好友申请',
      dangerouslyUseHTMLString: true,
      message: `<p style="color:red;margin-top:10px;">您有一条好友申请消息,请注意查收...</p>`,
      duration: 0,
      type: 'info',
      customClass: 'pointer',
      onClick: function() {
        store.commit('SET_APPLY_NUM', 0)
        router.push({
          path: '/contacts/apply',
          query: { t: new Date().getTime() },
        })
        this.close()
      },
    })
  }
}

export default FriendApply
