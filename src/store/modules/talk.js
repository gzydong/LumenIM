import {
  getSort,
  getMutipSort,
} from "@/utils/functions";

const Talk = {
  state: {
    //用户对话列表
    items: [],

    //对话列表重载状态
    heavyLoad: false,
  },
  getters: {
    // 过滤所有置顶对话列表
    topItems: state => {
      return state.items.filter((item) => {
        return item.is_top == 1;
      });
    },
    talkItems: state => {
      return state.items.sort(
        getMutipSort([
          getSort(function (a, b) {
            return a.unread_num > b.unread_num;
          }),
          getSort(function (a, b) {
            return a.updated_at > b.updated_at;
          }),
        ])
      );
    },
    // 消息未读数总计
    unreadNum: state => {
      return state.items.reduce((total, item) => {
        return total + parseInt(item.unread_num);
      }, 0);
    },
    talkNum: state => {
      return state.items.length;
    },
  },
  mutations: {
    // 设置对话列表
    SET_TALK_ITEM(state, payload) {
      state.items = payload.items;
    },

    // 更新对话节点
    UPDATE_TALK_ITEM(state, payload) {
      if (state.items[payload.key]) {
        Object.assign(state.items[payload.key], payload.item);
      }
    },

    // 新增对话节点
    INSERT_TALK_ITEM(state, payload) {
      state.items.push(payload.item);
    },

    // 移除对话节点
    REMOVE_TALK_ITEM(state, index_name) {
      for (let i in state.items) {
        if (state.items[i].index_name === index_name) {
          state.items.splice(i, 1);
          break;
        }
      }
    },

    // 更新对话节点在线状态
    UPDATE_TALK_ONLINE_STATUS(state, data) {
      if (!state.items[data.key]) return false;

      state.items[data.key].online = parseInt(data.status);
    },

    // 更新对话消息
    UPDATE_TALK_MESSAGE(state, payload) {
      if (!state.items[payload.key]) return false;

      state.items[payload.key].msg_text = payload.item.msg_text.replace(/<\/?.+?>/g, "") || '[表情]';
      state.items[payload.key].unread_num++;
      state.items[payload.key].updated_at = payload.item.updated_at;
    },

    // 清空对话的未读数
    CLEAR_TLAK_UNREAD_NUM(state, index) {
      state.items[index].unread_num = 0;
    },

    // 触发对话列表重新加载
    TRIGGER_TALK_ITEMS_LOAD(state, status = false) {
      state.heavyLoad = status;
    },

    // 更新消息数组的key 更新 duration 字段数据
    UPDATA_MESSAGE_DURATION(state, data) {
      state.list[data.index].duration = data.duration
    }
  },
}

export default Talk;