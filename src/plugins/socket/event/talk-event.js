import Vue from 'vue';
import store from '@/store';
import AppMessageEvent from './app-message-event';
import {
  parseTime
} from '@/utils/functions';
import {
  formateTalkItem,
  findTalkIndex
} from '@/utils/talk';
import {
  ServeClearTalkUnreadNum,
  ServeCreateTalkList
} from "@/api/chat";

/**
 * 聊天消息处理
 */
class TalkEvent extends AppMessageEvent {

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
    if (!this.isTalkPage()) {
      this.$notify({
        message: '您有一条新的消息,请注意查收...',
        duration: 3000
      });

      store.commit('INCR_UNREAD_NUM');
      return false;
    }

    let indexName = this.getIndexName();
    let idx = findTalkIndex(indexName);

    // 判断消息来源是否在对话列表中...
    if (idx == -1) {
      this.loadTalkItem();
      return;
    }

    if (this.isChatting(this.resource.source_type, this.resource.receive_user, this.resource.send_user)) {
      this.updateTalkRecord(idx);
    } else {
      this.updateTalkItem(idx);
    }
  }

  /**
   * 更新对话记录
   * 
   * @param {Number} idx 聊天列表的索引 
   */
  updateTalkRecord(idx) {
    let record = this.resource.data;
    record.float = (record.user_id == 0) ? 'center' : (record.user_id == this.UserId ? 'right' : 'left');

    store.commit("PUSH_DIALOGUE", record);

    // 获取聊天面板元素节点
    let elChatPanel = document.getElementById("lumenChatPanel");

    // 判断的滚动条是否在底部
    let isBottom = (Math.ceil(elChatPanel.scrollTop) + elChatPanel.clientHeight) >= elChatPanel.scrollHeight

    if (isBottom || record.user_id == this.UserId) {
      Vue.nextTick(() => {
        // 更新聊天面板滚动条置底
        elChatPanel.scrollTop = elChatPanel.scrollHeight;
      });
    } else {
      store.commit('SET_TLAK_UNREAD_MESSAGE', {
        content: this.getTalkText(),
        nickname: record.nickname
      });
    }

    store.commit('UPDATE_TALK_ITEM', {
      index: idx,
      item: {
        msg_text: this.getTalkText(),
        updated_at: parseTime(new Date())
      }
    });

    if (this.resource.data.source == 1 && this.UserId !== this.resource.data.user_id) {
      // 更新未读消息
      ServeClearTalkUnreadNum({
        type: store.state.dialogue.source,
        receive: store.state.dialogue.receive_id
      });
    }
  }

  /**
   * 更新对话列表记录
   * 
   * @param {int} idx 聊天列表的索引 
   */
  updateTalkItem(idx) {
    store.commit('INCR_UNREAD_NUM');
    if (idx == -1) {
      // 对话列表不存在需请求后端...
      return;
    }

    store.commit('UPDATE_TALK_MESSAGE', {
      index: idx,
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
    let text = this.resource.data.content;
    switch (this.resource.data.msg_type) {
      case 2:
        let file_type = this.resource.data.file.file_type
        text = file_type == 1 ? '[图片消息]' : '[文件消息]';
        break;
      case 4:
        text = '[会话记录]';
        break;
      case 5:
        text = '[代码消息]';
        break;
    }

    return text;
  }

  /**
   * 判断用户是否打开对话页
   */
  isTalkPage() {
    let path = window.location.pathname
    return !(path != '/message' && path != '/');
  }

  /**
   * 通过消息获取消息对应的对话索引
   */
  getIndexName() {
    let message = this.resource;
    if (message.source_type == 2 || (message.source_type == 1 && message.send_user == this.UserId)) {
      return `${message.source_type}_${message.receive_user}`;
    }

    return `${message.source_type}_${message.send_user}`;
  }

  /**
   * 加载对接节点
   */
  loadTalkItem() {
    let receive_id = 0;
    let type = this.resource.source_type;
    if (type == 2 || this.resource.send_user == this.UserId) {
      receive_id = this.resource.receive_user;
    } else {
      receive_id = this.resource.send_user;
    }

    ServeCreateTalkList({
      type,
      receive_id
    }).then(res => {
      if (res.code == 200) {
        res.data.talkItem.unread_num = res.data.talkItem.unread_num + 1;
        store.commit('INSERT_TALK_ITEM', formateTalkItem(res.data.talkItem));
      }
    });
  }
}

export default TalkEvent;