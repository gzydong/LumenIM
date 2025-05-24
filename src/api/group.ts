import { createApi } from './request.ts'

export const ServGroupList = createApi('/api/v1/group/list')

export const ServGroupOvertList = createApi('/api/v1/group/overt-list')

export const ServGroupDetail = createApi('/api/v1/group/detail')

export const ServGroupCreate = createApi('/api/v1/group/create')

export const ServeGroupUpdate = createApi('/api/v1/group/update')

export const ServGroupInvite = createApi('/api/v1/group/invite')

export const ServGroupMemberRemove = createApi('/api/v1/group/member/remove')

export const ServGroupDismiss = createApi('/api/v1/group/dismiss')

export const ServGroupMute = createApi('/api/v1/group/mute')

export const ServGroupOvert = createApi('/api/v1/group/overt')

export const ServGroupSecede = createApi('/api/v1/group/secede')

export const ServGroupMemberUpdateRemark = createApi('/api/v1/group/member/update-remark')

export const ServGroupInviteList = createApi('/api/v1/group/invite-list')

export const ServGroupMemberList = createApi('/api/v1/group/member/list')

export const ServGroupNoticeList = createApi('/api/v1/group/notice/list')

export const ServGroupNoticeUpdate = createApi('/api/v1/group/notice/edit')

export const ServGroupApplyList = createApi('/api/v1/group/apply/list')

export const ServGroupApplyAll = createApi('/api/v1/group/apply/all')

export const ServGroupApplyDecline = createApi('/api/v1/group/apply/decline')

export const ServGroupApplyAgree = createApi('/api/v1/group/apply/agree')

export const ServGroupApplyCreate = createApi('/api/v1/group/apply/create')

export const ServGroupApplyUnread = createApi('/api/v1/group/apply/unread')

export const ServGroupTransfer = createApi('/api/v1/group/transfer')

export const ServGroupAssignAdmin = createApi('/api/v1/group/assign-admin')

export const ServGroupMemberMute = createApi('/api/v1/group/member-mute')

export const ServGroupVoteCreate = createApi('/api/v1/group/vote/create')

export const ServGroupVoteSubmit = createApi('/api/v1/group/vote/submit')

export const ServGroupVoteDetail = createApi('/api/v1/group/vote/detail')
