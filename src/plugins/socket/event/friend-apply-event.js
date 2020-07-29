import AppMessageEvent from './app-message-event';

/**
 * 好友邀请消息处理
 */
class FriendApplyEvent extends AppMessageEvent {

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
    this.vm.$notify({
      message: '您有一条好友申请消息,请注意查收...',
      duration: 3000
    });

    this.vm.$store.commit('incrApplyNum');
  }
}


export default FriendApplyEvent;
