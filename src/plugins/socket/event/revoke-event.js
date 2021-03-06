import AppMessageEvent from './app-message-event';

/**
 * 好友邀请消息处理
 */
class RevokeEvent extends AppMessageEvent {

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
    if (!this.isChatting(this.resource.source, this.resource.receive_id, this.resource.user_id)) {
      return false;
    }

    let record_id = this.resource.record_id;
    let idx = this.vm.message.records.findIndex((item) => item.id == record_id);

    this.vm.message.records[idx].is_revoke = 1;
  }
}

export default RevokeEvent;