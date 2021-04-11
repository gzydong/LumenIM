export default {
  state: {
    // 对话来源[1:私聊;2:群聊]
    source: 0,

    // 接收者ID
    receive_id: 0,

    // 聊天记录
    records: [],

    // 对话索引（聊天对话的唯一索引）
    index_name: null,
  },
  mutations: {
    // 更新对话
    UPDATE_DIALOGUE_MESSAGE(state, resource) {
      state.records = []
      state.source = parseInt(resource.source)
      state.receive_id = parseInt(resource.receive_id)
      state.index_name =
        state.source === 0 || state.receive_id === 0
          ? null
          : resource.source + '_' + resource.receive_id
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
      Object.assign(state.records[resource.index], resource.item)
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
