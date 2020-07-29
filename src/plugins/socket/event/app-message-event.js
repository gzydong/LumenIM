// 引入应用的App实例
import vm from '@/main';

/**
 * 处理App消息
 */
class AppMessageEvent {

  vm;

  constructor() {
    this.vm = vm;
  }

  /**
   * 获取当前登录用户的ID
   */
  get getUserId() {
    return this.vm.$store.state.user.uid;
  }

  /**
   * 判断消息是否来自当前对话
   * 
   * @param {int} source 聊天消息类型（1：私聊，2：群聊）
   * @param {int} receive_id 接收者ID
   * @param {int} user_id 发送者ID
   */
  isChatting(source, receive_id, user_id) {
    if (source != this.vm.message.source) {
      return false;
    } else if (source == 1) {
      if (this.vm.message.receiveId == receive_id) {
        return true;
      } else if (this.vm.message.receiveId == user_id) {
        return true;
      }
    } else if (source == 2) {
      if (this.vm.message.receiveId == receive_id || this.vm.message.receiveId == this.getUserId) {
        return true;
      }
    }

    return false;
  }
}

export default AppMessageEvent;
