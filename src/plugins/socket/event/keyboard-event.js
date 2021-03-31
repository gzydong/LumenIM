import AppMessageEvent from './app-message-event';
import store from '@/store';

/**
 * 好友邀请消息处理
 */
class KeyboardEvent extends AppMessageEvent {

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
    if (store.state.dialogue.index_name == null) return false;

    this.isShow() && store.commit('UPDATE_KEYBOARD_EVENT');
  }

  isShow() {
    let [source, receive_id] = store.state.dialogue.index_name.split("_");

    return !(source == 2 || receive_id != this.resource.send_user);
  }
}


export default KeyboardEvent;