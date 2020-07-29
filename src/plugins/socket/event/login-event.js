import AppMessageEvent from './app-message-event';

/**
 * 好友邀请消息处理
 */
class LoginEvent extends AppMessageEvent {

  // 处理数据
  resource;

  /**
   * 初始化构造方法
   * 
   * @param {object} resource Socket消息
   */
  constructor(resource) {
    super();

    this.resource = resource;
  }

  handle() {
    this.vm.$store.dispatch("updateFriendStatus", `${this.resource.status}_${this.resource.user_id}`);
  }
}


export default LoginEvent;
