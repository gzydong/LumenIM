import {
    post,
    get
} from '@/utils/request';

//获取好友列表服务接口
export const ServeGetContacts = (data) => {
    return get('/api/v1/contacts/list', data);
}

//好友申请服务接口
export const ServeCreateContact = (data) => {
    return post('/api/v1/contacts/add', data);
}

//解除好友关系服务接口
export const ServeDeleteContact = (data) => {
    return post('/api/v1/contacts/delete', data);
}

//修改好友备注服务接口
export const ServeEditContactRemark = (data) => {
    return post('/api/v1/contacts/edit-remark', data);
}

//查询好友申请未读数量服务接口
export const ServeFindFriendApplyNum = () => {
    return get('/api/v1/contacts/apply-unread-num');
}

//查询好友申请服务接口
export const ServeGetContactApplyRecords = (data) => {
    return get('/api/v1/contacts/apply-records', data);
}

//处理好友申请服务接口
export const ServeHandleFriendApply = (data) => {
    return post('/api/v1/contacts/accept-invitation', data);
}

//删除好友申请记录服务接口
export const ServeDeleteContactApply = (data) => {
    return post('/api/v1/contacts/delete-apply', data);
}

//搜索联系人
export const ServeSearchContact = (data) => {
    return get('/api/v1/contacts/search',data);
}