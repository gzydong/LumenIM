import { post, get, upload } from '@/utils/request'

// 获取聊天列表服务接口
export const ServeGetTalkList = (data = {}) => {
  return get('/api/v1/talk/list', data)
}

// 聊天列表创建服务接口
export const ServeCreateTalkList = (data = {}) => {
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
  return post('/api/v1/talk/unread/clear', data)
}

// 获取聊天记录服务接口
export const ServeTalkRecords = (data = {}) => {
  return get('/api/v1/talk/records', data)
}

// 获取转发会话记录详情列表服务接口
export const ServeGetForwardRecords = (data = {}) => {
  return get('/api/v1/talk/records/forward', data)
}

// 对话列表置顶服务接口
export const ServeSetNotDisturb = (data = {}) => {
  return post('/api/v1/talk/disturb', data)
}

// 查找用户聊天记录服务接口
export const ServeFindTalkRecords = (data = {}) => {
  return get('/api/v1/talk/records/history', data)
}

// 搜索用户聊天记录服务接口
export const ServeSearchTalkRecords = (data = {}) => {
  return get('/api/v1/talk/search-chat-records', data)
}

export const ServeGetRecordsContext = (data = {}) => {
  return get('/api/v1/talk/get-records-context', data)
}

// 发送代码块消息服务接口
export const ServePublishMessage = (data = {}) => {
  return post('/api/v1/talk/message/publish', data)
}

// 发送聊天文件服务接口
export const ServeSendTalkFile = (data = {}) => {
  return post('/api/v1/talk/message/file', data)
}

// 撤回消息服务接口
export const ServeRevokeRecords = (data = {}) => {
  return post('/api/v1/talk/message/revoke', data)
}

// 删除消息服务接口
export const ServeRemoveRecords = (data = {}) => {
  return post('/api/v1/talk/message/delete', data)
}

// 收藏表情包服务接口
export const ServeCollectEmoticon = (data = {}) => {
  return post('/api/v1/talk/message/collect', data)
}

export const ServeSendVote = (data = {}) => {
  return post('/api/v1/talk/message/vote', data)
}

export const ServeConfirmVoteHandle = (data = {}) => {
  return post('/api/v1/talk/message/vote/handle', data)
}
