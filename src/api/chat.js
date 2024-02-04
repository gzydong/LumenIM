import { post, get, upload } from './request'

// 获取聊天列表服务接口
export const ServeGetTalkList = (data = {}) => {
  return get('/api/v1/talk/list', data)
}

// 聊天列表创建服务接口
export const ServeCreateTalk = (data = {}) => {
  return post('/api/v1/talk/create', data)
}

// 删除聊天列表服务接口
export const ServeDeleteTalkList = (data = {}) => {
  return post('/api/v1/talk/delete', data)
}

// 对话列表置顶服务接口
export const ServeTopTalkList = (data = {}) => {
  return post('/api/v1/talk/topping', data)
}

// 清除聊天消息未读数服务接口
export const ServeClearTalkUnreadNum = (data = {}) => {
  return post('/api/v1/talk/clear-unread', data)
}

// 获取聊天记录服务接口
export const ServeTalkRecords = (data = {}) => {
  return get('/api/v1/talk/records', data)
}

// 查找用户聊天记录服务接口
export const ServeFindTalkRecords = (data = {}) => {
  return get('/api/v1/talk/history-records', data)
}

// 获取转发会话记录详情列表服务接口
export const ServeGetForwardRecords = (data = {}) => {
  return get('/api/v1/talk/forward-records', data)
}

// 对话列表置顶服务接口
export const ServeSetNotDisturb = (data = {}) => {
  return post('/api/v1/talk/disturb', data)
}

// 发送代码块消息服务接口
export const ServePublishMessage = (data = {}) => {
  return post('/api/v1/talk/message/send', data)
}

// 撤回消息服务接口
export const ServeRevokeRecords = (data = {}) => {
  return post('/api/v1/talk/message/revoke', data)
}

// 删除消息服务接口
export const ServeRemoveRecords = (data = {}) => {
  return post('/api/v1/talk/message/delete', data)
}
