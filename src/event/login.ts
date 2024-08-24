import Base from './base'
import { useTalkStore, useDialogueStore } from '@/store'

/**
 * 好友状态事件
 */
class Login extends Base {
  /**
   * @var resource 资源
   */
  private resource: any

  /**
   * 初始化构造方法
   *
   * @param {Object} resource Socket消息
   */
  constructor(resource: any) {
    super()

    this.resource = resource

    this.handle()
  }

  private handle() {
    useTalkStore().updateItem({
      index_name: `1_${this.resource.user_id}`,
      is_online: this.resource.status
    })

    if (this.isTalk(1, this.resource.user_id)) {
      useDialogueStore().setOnlineStatus(this.resource.status === 1)
    }
  }
}

export default Login
