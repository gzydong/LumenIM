import Base from './base'

import { useDialogueStore } from '@/store'

/**
 * 键盘输入事件
 */
class Keyboard extends Base {
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
    const params = this.getTalkParams()

    // 判断当前是否正在对话
    if (!params.index_name) {
      return false
    }

    // 判断是否是私信
    if (params.talk_mode != 1) {
      return false
    }

    // 判断消息是否来当前对话
    if (params.to_from_id != this.resource.from_id) {
      return false
    }

    useDialogueStore().triggerKeyboard()
  }
}

export default Keyboard
