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
      title:'好友申请',
      dangerouslyUseHTMLString:true,
      message: '<p style="color:red;margin-top:10px;">您有一条好友申请消息,请注意查收...</p>',
      duration: 0,
      type:'info',
    });

    this.vm.$store.commit('incrApplyNum');
  }
}


export default FriendApplyEvent;
