import {
  post,
  get,
  upload
} from '@/utils/request';

//获取聊天列表服务接口
export const chatListsServ = (data) => {
  return get('/api/talk/list', data);
}

//聊天列表创建服务接口
export const chatListCrateServ = (data) => {
  return post('/api/talk/create', data);
}

//删除聊天列表服务接口
export const delChatItemServ = (data) => {
  return post('/api/talk/delete', data);
}

//对话列表置顶服务接口
export const topChatItemServ = (data) => {
  return post('/api/talk/topping', data);
}

//清除聊天消息未读数服务接口
export const clearChatUnreadNumServ = (data) => {
  return post('/api/talk/update-unread-num', data);
}

//获取聊天记录服务接口
export const chatRecordsServ = (data) => {
  return get('/api/talk/records', data);
}

//撤回消息服务接口
export const revokeRecordsServ = (data) => {
  return post('/api/talk/revoke-records', data);
}

//删除消息服务接口
export const removeRecordsServ = (data) => {
  return post('/api/talk/remove-records', data);
}

//转发消息服务接口
export const forwardRecordsServ = (data) => {
  return post('/api/talk/forward-records', data);
}

//获取转发会话记录详情列表服务接口
export const getForwardRecordsServ = (data) => {
  return get('/api/talk/get-forward-records', data);
}

//对话列表置顶服务接口
export const setNotDisturbServ = (data) => {
  return post('/api/talk/set-not-disturb', data);
}

//发送聊天图片服务接口
export const sendChatImgServ = (data) => {
  return upload('/api/talk/upload-talk-img', data);
}

//查找用户聊天记录服务接口
export const findChatRecordsServ = (data) => {
  return get('/api/talk/find-chat-records', data);
}

//查找用户聊天记录服务接口
export const searchChatRecordsServ = (data) => {
  return get('/api/talk/search-chat-records', data);
}

export const getRecordsContextServ = (data) => {
  return get('/api/talk/get-records-context', data);
}
