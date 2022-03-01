export default {
  state: {
    // 对话来源[1:私聊;2:群聊]
    talk_type: 0,

    // 接收者ID
    receiver_id: 0,

    is_robot: 0,

    // 聊天记录
    records: [],

    // 对话索引（聊天对话的唯一索引）
    index_name: null,
  },
  mutations: {
    // 更新对话
    UPDATE_DIALOGUE_MESSAGE(state, resource) {
      state.records = []
      state.talk_type = parseInt(resource.talk_type)
      state.receiver_id = parseInt(resource.receiver_id)
      state.is_robot = parseInt(resource.is_robot)

      if (state.talk_type === 0 || state.receiver_id === 0) {
        state.index_name = null
      } else {
        state.index_name = resource.talk_type + '_' + resource.receiver_id
      }
    },

    // 数组头部压入对话记录
    UNSHIFT_DIALOGUE(state, records) {
      state.records.unshift(...records)
    },

    // 推送对话记录
    PUSH_DIALOGUE(state, record) {
      state.records.push(record)
    },

    // 更新对话记录
    UPDATE_DIALOGUE(state, resource) {
      for (const iterator of state.records) {
        if (iterator.id === resource.id) {
          Object.assign(iterator, resource)
          break
        }
      }
    },

    // 删除对话记录
    DELETE_DIALOGUE(state, index) {
      state.records.splice(index, 1)
    },

    BATCH_DELETE_DIALOGUE(state, ids) {
      ids.forEach(record_id => {
        let index = state.records.findIndex(item => item.id == record_id)
        if (index >= 0) state.records.splice(index, 1)
      })
    },

    // 数组头部压入对话记录
    SET_DIALOGUE(state, records) {
      state.records = records
    },
  },
}
