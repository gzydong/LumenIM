import { createApiCall } from './request.ts'

export const ServGroupList = createApiCall('/api/v1/group/list')

export const ServGroupOvertList = createApiCall('/api/v1/group/overt-list')

export const ServGroupDetail = createApiCall('/api/v1/group/detail')

export const ServGroupCreate = createApiCall('/api/v1/group/create')

export const ServeGroupUpdate = createApiCall('/api/v1/group/update')

export const ServGroupInvite = createApiCall('/api/v1/group/invite')

export const ServGroupMemberRemove = createApiCall('/api/v1/group/member/remove')

export const ServGroupDismiss = createApiCall('/api/v1/group/dismiss')

export const ServGroupMute = createApiCall('/api/v1/group/mute')

export const ServGroupOvert = createApiCall('/api/v1/group/overt')

export const ServGroupSecede = createApiCall('/api/v1/group/secede')

export const ServGroupMemberUpdateRemark = createApiCall('/api/v1/group/member/update-remark')

export const ServGroupInviteList = createApiCall('/api/v1/group/invite-list')

export const ServGroupMemberList = createApiCall('/api/v1/group/member/list')

export const ServGroupNoticeList = createApiCall('/api/v1/group/notice/list')

export const ServGroupNoticeUpdate = createApiCall('/api/v1/group/notice/edit')

export const ServGroupApplyList = createApiCall('/api/v1/group/apply/list')

export const ServGroupApplyAll = createApiCall('/api/v1/group/apply/all')

export const ServGroupApplyDecline = createApiCall('/api/v1/group/apply/decline')

export const ServGroupApplyAgree = createApiCall('/api/v1/group/apply/agree')

export const ServGroupApplyCreate = createApiCall('/api/v1/group/apply/create')

export const ServGroupApplyUnread = createApiCall('/api/v1/group/apply/unread')

export const ServGroupTransfer = createApiCall('/api/v1/group/transfer')

export const ServGroupAssignAdmin = createApiCall('/api/v1/group/assign-admin')

export const ServGroupMemberMute = createApiCall('/api/v1/group/member-mute')

export const ServGroupVoteCreate = createApiCall('/api/v1/group/vote/create')

export const ServGroupVoteSubmit = createApiCall('/api/v1/group/vote/submit')

export const ServGroupVoteDetail = createApiCall('/api/v1/group/vote/detail')
