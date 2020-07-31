import AppMessageEvent from './app-message-event';

import {
  parseTime,
  packTalkRecord
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
    this.vm.message.records.push(this.packTalkRecord(this.resource));

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
      this.vm.$store.commit('TRIGGER_TALK_ITEMS_LOAD', true);
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
    if (this.resource.msg_type == 1) {
      text = this.resource.data.content;
    } else if (this.resource.msg_type == 2 && this.resource.data.file_type == 1) {
      text = '[图片消息]';
    } else if (this.resource.msg_type == 2 && this.resource.data.file_type == 3) {
      text = '[文件消息]';
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

  /**
   * 通过接收消息包装谈话记录
   *
   * @param {Object} message 消息
   */
  packTalkRecord(message) {
    let float = message.send_user == 0 ? 'center' : (message.send_user == this.getUserId ? 'right' : 'left');

    return packTalkRecord({
      id: message.data.id,
      avatar: message.data.avatar,
      float: float,
      msg_type: message.data.msg_type,
      nickname: message.data.nickname,
      friend_remarks: message.data.friend_remarks,
      receive_id: message.data.receive_id,
      send_time: message.data.send_time,
      source: message.source_type,
      content: message.data.content,
      user_id: message.data.user_id,

      file_original_name: message.data.file_original_name,
      file_size: message.data.file_size,
      file_suffix: message.data.file_suffix,
      file_type: message.data.file_type,
      file_url: message.data.file_url,

      is_code: message.data.is_code ? message.data.is_code : 0,
      code_lang: message.data.code_lang ? message.data.code_lang : '',
      is_revoke: message.data.is_revoke,

      forward_id: message.data.forward_id,
      forward_info: message.data.forward_info,

      //群通知(1:入群通知  2:退群通知)
      group_notify: message.data.group_notify,
    });
  }
}

export default TalkEvent;
