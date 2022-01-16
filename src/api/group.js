import { post, get } from '@/utils/request'

// 查询用户群聊服务接口
export const ServeGetGroups = () => {
  return get('/api/v1/group/list')
}

// 获取群信息服务接口
export const ServeGroupDetail = data => {
  return get('/api/v1/group/detail', data)
}

// 创建群聊服务接口
export const ServeCreateGroup = data => {
  return post('/api/v1/group/create', data)
}

//  修改群信息
export const ServeEditGroup = data => {
  return post('/api/v1/group/setting', data)
}

// 邀请好友加入群聊服务接口
export const ServeInviteGroup = data => {
  return post('/api/v1/group/invite', data)
}

// 移除群聊成员服务接口
export const ServeRemoveMembersGroup = data => {
  return post('/api/v1/group/member/remove', data)
}

// 管理员解散群聊服务接口
export const ServeDismissGroup = data => {
  return post('/api/v1/group/dismiss', data)
}

// 用户退出群聊服务接口
export const ServeSecedeGroup = data => {
  return post('/api/v1/group/secede', data)
}

// 修改群聊名片服务接口
export const ServeUpdateGroupCard = data => {
  return post('/api/v1/group/member/remark', data)
}

// 获取用户可邀请加入群组的好友列表
export const ServeGetInviteFriends = data => {
  return get('/api/v1/group/member/invites', data)
}

//  获取群组成员列表
export const ServeGetGroupMembers = data => {
  return get('/api/v1/group/member/list', data)
}

//  获取群组公告列表
export const ServeGetGroupNotices = data => {
  return get('/api/v1/group/notice/list', data)
}

//  编辑群公告
export const ServeEditGroupNotice = data => {
  return post('/api/v1/group/notice/edit', data)
}
