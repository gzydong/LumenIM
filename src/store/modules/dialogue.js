export default {
    state: {
        // 对话来源[1:私聊;2:群聊]
        source: 0,

        // 接收者ID
        receive_id: 0,

        // 聊天记录
        records: [],

        // 对话索引（聊天对话的唯一索引）
        index_name: '',
    },
    mutations: {
        // 设置对话列表
        SET_TALK_ITEM(state, resource) {
            state.items = resource.items;
        },

        // 更新对话者
        UPDATE_DIALOGUE_MESSAGE(state, resource) {
            state.records = [];
            state.source = parseInt(resource.source);
            state.receiveId = parseInt(resource.receive_id);
            state.index_name = resource.source + '_' + resource.receive_id;
        },
    },
}