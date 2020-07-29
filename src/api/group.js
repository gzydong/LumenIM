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

//设置群聊名片服务接口
export const getGroupMembersServ = (data) => {
  return get('/api/group/get-group-members', data);
}
