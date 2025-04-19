import { createApiCall } from './request.ts'

// 获取聊天列表服务接口
export const ServTalkList = createApiCall('/api/v1/talk/list')

// 聊天列表创建服务接口
export const ServTalkCreate = createApiCall<any, null>('/api/v1/talk/create')

// 删除聊天列表服务接口
export const ServTalkDelete = createApiCall<ServTalkDeleteRequest, null>('/api/v1/talk/delete')

// 对话列表置顶服务接口
export const ServTalkTopping = createApiCall<ServTalkToppingRequest, null>('/api/v1/talk/topping')

// 清除聊天消息未读数服务接口
export const ServTalkClearUnread = createApiCall('/api/v1/talk/clear-unread')

// 获取聊天记录服务接口
export const ServTalkRecords = createApiCall<ServTalkRecordsRequest, any>('/api/v1/talk/records')

// 查找用户聊天记录服务接口
export const ServTalkHistoryRecords = createApiCall('/api/v1/talk/history-records')

// 获取转发会话记录详情列表服务接口
export const ServTalkForwardRecords = createApiCall('/api/v1/talk/forward-records')

// 对话列表置顶服务接口
export const ServTalkDisturb = createApiCall('/api/v1/talk/disturb')

// 发送代码块消息服务接口
export const ServTalkMessageSend = createApiCall<ServTalkMessageSendRequest, null>(
  '/api/v1/talk/message/send'
)

// 撤回消息服务接口
export const ServTalkMessageRevoke = createApiCall<ServTalkMessageRevokeRequest, null>(
  '/api/v1/talk/message/revoke'
)

// 删除消息服务接口
export const ServTalkMessageDelete = createApiCall<ServTalkMessageDeleteRequest, any>(
  '/api/v1/talk/message/delete'
)

interface ServTalkRecordsRequest {
  cursor: number
  limit: number
  talk_mode: number
  to_from_id: number
}

interface ServTalkMessageDeleteRequest {
  msg_ids: string[]
  talk_mode: number
  to_from_id: number
}

interface ServTalkMessageSendRequest {
  type: string
  quote_id?: string
  body: any
  talk_mode: number
  to_from_id: number
  msg_id?: string
}

interface ServTalkMessageRevokeRequest {
  talk_mode: number
  to_from_id: number
  msg_id: string
}

interface ServTalkToppingRequest {
  talk_mode: number
  to_from_id: number
  action: number
}

interface ServTalkDeleteRequest {
  talk_mode: number
  to_from_id: number
}
