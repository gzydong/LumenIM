import store from '@/store';
import {
    parseTime
} from '@/utils/functions';

/**
 * 通过对话索引查找对话列表下标
 * 
 * @param {String} index_name 
 */
export function findTalkIndex(index_name) {
    return store.state.talks.items.findIndex(
        (item) => item.index_name == index_name
    );
}

/**
 * 通过对话索引查找对话列表
 * 
 * @param {String} index_name 
 */
export function findTalk(index_name) {
    return store.state.talks.items.find(
        (item) => item.index_name == index_name
    );
}

/**
 * 格式化聊天对话列表数据
 *
 * @param {Object} params
 */
export function formateTalkItem(params) {
    let options = {
        id: 0,
        type: 1,
        index_name: "",
        name: "未设置昵称",
        remark_name: "",
        avatar: "",
        friend_id: 0,
        group_id: 0,
        group_members_num: 0,
        not_disturb: 0,
        is_top: 0,
        unread_num: 0,
        content: "......",
        draft_text: "",
        created_at: parseTime(new Date()),
    }

    Object.assign(options, params);
    options.index_name = options.type == 1 ? `${options.type}_${options.friend_id}` : `${options.type}_${options.group_id}`;

    return options;
}