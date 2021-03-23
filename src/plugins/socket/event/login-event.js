import AppMessageEvent from './app-message-event';
import store from '@/store';
/**
 * 好友邀请消息处理
 */
class LoginEvent extends AppMessageEvent {

  resource;

  /**
   * 初始化构造方法
   * 
   * @param {Object} resource Socket消息
   */
  constructor(resource) {
    super();

    this.resource = resource;
  }

  handle() {
    store.dispatch("ACT_UPDATE_FRIEND_STATUS", {
      status: this.resource.status,
      friendId: parseInt(this.resource.user_id)
    });
  }
}


export default LoginEvent;