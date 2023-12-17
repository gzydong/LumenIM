import Base from './base'
import { useTalkStore, useDialogueStore } from '@/store'

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

    this.handle()
  }

  handle() {
    useTalkStore().updateItem({
      index_name: `1_${this.resource.user_id}`,
      is_online: this.resource.status
    })

    if (this.isTalk(1, this.resource.user_id, this.getAccountId())) {
      useDialogueStore().setOnlineStatus(this.resource.status == 1)
    }
  }
}

export default Login
