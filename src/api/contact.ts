import { createApiCall, EmptyRequest } from './request.ts'

// 使用高阶函数生成具体的API调用函数
export const ServContactList = createApiCall<EmptyRequest, ServContactListResponse>(
  '/api/v1/contact/list'
)

export const ServContactDelete = createApiCall<{ user_id: number }, null>('/api/v1/contact/delete')

export const ServContactEditRemark = createApiCall<{ user_id: number; remark: string }, null>(
  '/api/v1/contact/edit-remark'
)

export const ServContactSearch = createApiCall<{ mobile: string }, ServContactSearchResponse>(
  '/api/v1/contact/search'
)

export const ServContactApplyCreate = createApiCall<{ user_id: number; remark: string }, null>(
  '/api/v1/contact/apply/create'
)

export const ServContactApplyRecords = createApiCall<EmptyRequest, any>(
  '/api/v1/contact/apply/records'
)

export const ServContactApplyAccept = createApiCall<{ apply_id: number; remark: string }, null>(
  '/api/v1/contact/apply/accept'
)

export const ServContactApplyDecline = createApiCall<{ apply_id: number; remark: string }, null>(
  '/api/v1/contact/apply/decline'
)

export const ServContactApplyUnreadNum = createApiCall<EmptyRequest, { unread_num: number }>(
  '/api/v1/contact/apply/unread-num'
)

export const ServContactDetail = createApiCall<{ user_id: number }, ServContactDetailResponse>(
  '/api/v1/contact/detail'
)

export const ServContactGroupList = createApiCall<EmptyRequest, ServContactGroupListResponse>(
  '/api/v1/contact/group/list'
)

export const ServContactMoveGroup = createApiCall<
  { user_id: number; group_id: number },
  ServContactGroupListResponse
>('/api/v1/contact/move-group')

export const ServContactGroupUpdate = createApiCall<
  { items: { id: number; name: string; sort: number }[] },
  null
>('/api/v1/contact/group/update')

export const ServContactOnlineStatus = createApiCall<
  { user_id: number },
  { online_status: string }
>('/api/v1/contact/online-status')

// 定义响应类型接口
export interface ServContactSearchResponse {
  user_id: number
  mobile: string
  nickname: string
  avatar: string
  motto: string
  email: string
  gender: number
}

export interface ServContactListResponse {
  items: ServContactListResponseItem[]
}

export interface ServContactListResponseItem {
  user_id: number
  nickname: string
  avatar: string
  motto: string
  gender: number
  group_id: number
  remark: string
}

export interface ServContactDetailResponse {
  avatar: string
  contact_group_id: number
  contact_remark: string
  email: string
  gender: number
  mobile: string
  motto: string
  nickname: string
  online_status: string
  relation: number
  user_id: number
}

export interface ServContactGroupListResponse {
  items: {
    name: string
    count: number
    sort: number
    id: number
  }[]
}
