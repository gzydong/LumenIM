import Base from './base'
import { useDialogueStore, useTalkStore } from '@/store'
import { parseTime } from '@/utils/datetime'

/**
 * 好友状态事件
 */
class Revoke extends Base {
  /**
   * @var resource 资源
   */
  resource

  /**
   * 发送者ID
   */
  sender_id = 0

  /**
   * 接收者ID
   */
  receiver_id = 0

  /**
   * 聊天类型[1:私聊;2:群聊;]
   */
  talk_type = 0

  /**
   * 初始化构造方法
   *
   * @param {Object} resource Socket消息
   */
  constructor(resource) {
    super()

    this.resource = resource
    this.sender_id = resource.sender_id
    this.receiver_id = resource.receiver_id
    this.talk_type = resource.talk_type
    this.msg_id = resource.msg_id

    this.handle()
  }

  /**
   * 判断消息发送者是否来自于我
   * @returns
   */
  isCurrSender() {
    return this.sender_id == this.getAccountId()
  }

  /**
   * 获取对话索引
   *
   * @return String
   */
  getIndexName() {
    if (this.talk_type == 2) {
      return `${this.talk_type}_${this.receiver_id}`
    }

    let receiver_id = this.isCurrSender() ? this.receiver_id : this.sender_id

    return `${this.talk_type}_${receiver_id}`
  }

  handle() {
    useTalkStore().updateItem({
      index_name: this.getIndexName(),
      msg_text: this.resource.text,
      updated_at: parseTime(new Date())
    })

    // 判断当前是否正在和好友对话
    if (!this.isTalk(this.talk_type, this.receiver_id, this.sender_id)) {
      return
    }

    useDialogueStore().updateDialogueRecord({
      msg_id: this.msg_id,
      is_revoke: 1
    })
  }
}

export default Revoke
