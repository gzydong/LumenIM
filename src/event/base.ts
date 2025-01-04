import { useUserStore, useDialogueStore } from '@/store'
import router from '@/router'

class Base {
  /**
   * 初始化
   */
  constructor() {}

  /**
   * 获取当前登录用户的ID
   */
  getAccountId(): number {
    return useUserStore().uid
  }

  getTalkParams(): { talk_mode: number; to_from_id: number; index_name: string } {
    const dialogueStore = useDialogueStore()

    const { talk_mode, to_from_id } = dialogueStore.target

    return {
      talk_mode,
      to_from_id,
      index_name: dialogueStore.index_name
    }
  }

  /**
   * 判断消息是否来自当前对话
   *
   * @param {Number} talk_mode 聊天消息类型[1:私信;2:群聊;]
   * @param {Number} to_from_id 发送者ID
   */
  isTalk(talk_mode: number, to_from_id: number): boolean {
    const params = this.getTalkParams()

    return params.to_from_id == to_from_id && talk_mode == params.talk_mode
  }

  /**
   * 判断用户是否打开对话页
   */
  isTalkPage(): boolean {
    return ['/message', '/'].includes(router.currentRoute.value.path)
  }
}

export default Base
