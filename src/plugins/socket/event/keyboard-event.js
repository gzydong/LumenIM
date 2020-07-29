import AppMessageEvent from './app-message-event';

/**
 * 好友邀请消息处理
 */
class KeyboardEvent extends AppMessageEvent {

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
    if (this.vm.message.index_name == '') return false;

    if (this.isShow()) {
      this.vm.$store.commit('incrInputEvent');
    }
  }

  isShow() {
    let [source, receive_id] = this.vm.message.index_name.split("_");

    return !(source == 2 || receive_id != this.resource.send_user);
  }
}


export default KeyboardEvent;
