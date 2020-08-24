import AppMessageEvent from './app-message-event';

import {
  parseTime
} from '@/utils/functions';

import {
  clearChatUnreadNumServ
} from "@/api/chat";

/**
 * 聊天消息处理
 */
class TalkEvent extends AppMessageEvent {

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
    if (!this.inTalkPage()) {
      this.vm.$notify({
        message: '您有一条新的消息,请注意查收...',
        duration: 3000
      })

      this.vm.$store.commit('incrUnreadNum');
      return false;
    }

    let indexName = this.getIndexName();
    let idx = this.getIndex(indexName);
    if (this.isChatting(this.resource.source_type, this.resource.receive_user, this.resource.send_user)) {
      this.updateTalkRecord(idx);
    } else {
      this.updateTalkItem(idx);
    }
  }

  /**
   * 更新对话记录
   * 
   * @param {int} idx 聊天列表的索引 
   */
  updateTalkRecord(idx) {
    let record = this.resource.data;
    if (record.user_id == 0) {
      record.float = 'center';
    } else {
      record.float = record.user_id == this.getUserId ? 'right' : 'left';
    }

    this.vm.message.records.push(record);
    this.vm.$store.commit('setScrollHeight');
    this.vm.$store.commit({
      type: 'UPDATE_TALK_ITEM',
      key: idx,
      item: {
        msg_text: this.getTalkText(),
        updated_at: parseTime(new Date())
      }
    });

    // 更新未读消息
    clearChatUnreadNumServ({
      type: this.vm.message.source,
      receive: this.vm.message.receiveId
    });
  }

  /**
   * 更新对话列表记录
   * 
   * @param {int} idx 聊天列表的索引 
   */
  updateTalkItem(idx) {
    this.vm.$store.commit('incrUnreadNum');
    if (idx == -1) {
      // 对话列表不存在需请求后端...
      return;
    }

    this.vm.$store.commit({
      type: 'UPDATE_TALK_MESSAGE',
      key: idx,
      item: {
        msg_text: this.getTalkText(),
        updated_at: parseTime(new Date())
      }
    });
  }

  /**
   * 获取聊天列表左侧的对话信息
   */
  getTalkText() {
    let text = '';
    switch (this.resource.data.msg_type) {
      case 1:
        text = this.resource.data.content;
        break;
      case 2:
        text = '[文件消息]';
        break;
      case 4:
        text = '[会话记录]';
        break;
      case 5:
        text = '[代码块]';
        break;
    }

    return text;
  }

  /**
   * 判断用户是否打开对话页
   */
  inTalkPage() {
    let path = this.vm.$route.path;

    return !(path != '/message' && path != '/');
  }

  /**
   * 根据用户对话索引获取对话数组对应的key
   * 
   * @param {string} index_name 
   */
  getIndex(index_name) {
    return this.vm.$store.state.talks.items.findIndex(item => item.index_name == index_name);
  }

  /**
   * 通过消息获取消息对应的对话索引
   */
  getIndexName() {
    let message = this.resource;
    if (message.source_type == 2 || (message.source_type == 1 && message.send_user == this.getUserId)) {
      return `${message.source_type}_${message.receive_user}`;
    }

    return `${message.source_type}_${message.send_user}`;
  }
}

export default TalkEvent;
