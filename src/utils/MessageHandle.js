import {
  dateFormat
} from '@/utils/functions';

/**
 * WebSocket 连接类
 */
class MessageHandle {

  /**
   * 包装聊天对话列表数据
   *
   * @param {Object} obj
   */
  getDialogueObj(obj) {
    return Object.assign({
      id: 0,
      type: 0,
      friend_id: 0,
      group_id: 0,
      avatar: "",
      name: "",
      remark_name: "",
      unread_num: 0,
      msg_text: "......",
      created_at: dateFormat("YYYY/mm/dd HH:MM:SS", new Date()),
    }, obj);
  }

  /**
   * 包装聊天记录消息
   *
   * @param {Object} obj 聊天消息
   */
  getDialogueRecordObj(obj) {
    return Object.assign({
      user_id: 0, //发送消息的用户ID
      receive_id: 0, //接收用户ID(或接收群的ID)
      float: 'center', //消息浮动类型
      source: 1, //聊天类型 1:私聊 2:群聊
      msg_type: 1, //消息类型 1:文本消息 2:图片消息 3:文件消息 4:视频 5:系统提示好友入群消息 6:系统提示好友退群消息
      text_msg: '', //消息文本
      send_time: '', //消息发送时间
      avatar: '', //发送者用户头像
      nickname: '', //发送者账号昵称
      nickname_remarks: '' //好友备注(或群聊昵称)
    }, obj);
  }

  /**
   * 人性化显示时间
   *
   * @param {Object} datetime
   */
  beautifyTime(datetime) {
    datetime = datetime.replace(/-/g, "/");

    //当前时间戳
    let time = new Date();
    let outTime = new Date(datetime);
    if (/^[1-9]\d*$/.test(datetime)) {
      outTime = new Date(parseInt(datetime) * 1000);
    }

    if (time.getTime() < outTime.getTime()) {
      return dateFormat("YYYY/mm/dd", outTime);
    }

    if (time.getFullYear() != outTime.getFullYear()) {
      return dateFormat("YYYY/mm/dd", outTime);
    }

    if (time.getMonth() != outTime.getMonth()) {
      return dateFormat("mm/dd", outTime);
    }

    if (time.getDate() != outTime.getDate()) {
      let day = outTime.getDate() - time.getDate();
      if (day > 0) {
        return dateFormat("mm-dd", outTime);
      }

      if (day == -1) {
        return dateFormat("昨天 HH:MM", outTime);
      }

      if (day == -2) {
        return dateFormat("前天 HH:MM", outTime);
      }

      return dateFormat("mm-dd", outTime);
    }

    if (time.getHours() != outTime.getHours()) {
      return dateFormat("HH:MM", outTime);
    }

    let minutes = outTime.getMinutes() - time.getMinutes();
    if (minutes == 0) {
      return '刚刚';
    }

    minutes = Math.abs(minutes)
    return `${minutes}分钟前`;
  }

  /**
   * 数组倒叙排序
   *
   * @param {Object} prop 指定倒叙的字段名
   */
  sortCompare(prop) {
    return function(obj1, obj2) {
      let val1 = obj1[prop];
      let val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }

      if (val1 > val2) return -1;
      if (val1 < val2) return 1;
      return 0;
    }
  }

  /**
   * 处理接受消息
   *
   * @param {Object} message 接受聊天消息
   */
  handle(message, indexNameInfo, userInfo) {
    //判断是否属于系统消息
    if (message.send_user == 0) {
      return MessageHandle.getDialogueRecordObj({
        msg_type: message.msg_type,
        receive_id: message.receive_user,
        send_time: message.send_time,
        source: message.source_type,
        text_msg: message.content
      });
    }

    let avatar = '';
    if (message.send_user == userInfo.uid) {
      avatar = userInfo.avatar;
    } else if (message.source_type == 1) {
      avatar = indexNameInfo.avatar;
    } else {
      avatar = message.sendUserInfo.avatar || '';
    }

    return this.getDialogueRecordObj({
      avatar: avatar,
      float: message.send_user == userInfo.uid ? 'right' : 'left',
      msg_type: message.msg_type,
      nickname: message.sendUserInfo.nickname,
      nickname_remarks: message.sendUserInfo.remark_nickname,
      receive_id: message.receive_user,
      send_time: message.send_time,
      source: message.source_type,
      text_msg: message.content,
      user_id: message.send_user
    });
  }
}

export default MessageHandle = new MessageHandle();
