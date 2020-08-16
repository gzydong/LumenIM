import {
  post,
  get,
  upload
} from '@/utils/request';

//获取群信息服务接口
export const groupDetailServ = (data) => {
  return get('/api/group/detail', data);
}

//创建群聊服务接口
export const createGroupServ = (data) => {
  return post('/api/group/create', data);
}

// 修改群信息
export const editGroupServ = (data) => {
  return post('/api/group/edit', data);
}

//邀请好友加入群聊服务接口
export const inviteGroupServ = (data) => {
  return post('/api/group/invite', data);
}

//移除群聊成员服务接口
export const removeMembersGroupServ = (data) => {
  return post('/api/group/remove-members', data);
}

//管理员解散群聊服务接口
export const dismissGroupServ = (data) => {
  return post('/api/group/dismiss', data);
}

//用户退出群聊服务接口
export const secedeGroupServ = (data) => {
  return post('/api/group/secede', data);
}

//设置群聊名片服务接口
export const setGroupCardServ = (data) => {
  return post('/api/group/set-group-card', data);
}

//获取用户可邀请加入群组的好友列表
export const getInviteFriendsServ = (data) => {
  return get('/api/group/invite-friends', data);
}

// 获取群组成员列表
export const getGroupMembersServ = (data) => {
  return get('/api/group/members', data);
}

// 获取群组公告列表
export const getGroupNoticesServ = (data) => {
  return get('/api/group/notices', data);
}

// 编辑群公告
export const editNoticeServ = (data) => {
  return post('/api/group/edit-notice', data);
}