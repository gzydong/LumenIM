import {
  post,
  get,
  upload
} from '@/utils/request';

//登录服务接口
export const loginServ = (data) => {
  return post('/api/auth/login', data);
}

//注册服务接口
export const registerServ = (data) => {
  return post('/api/auth/register', data);
}

//退出登录服务接口
export const logoutServ = (data) => {
  return post('/api/auth/logout', data);
}

//刷新登录Token服务接口
export const refreshTokenServ = (data) => {
  return post('/api/auth/refresh-token');
}

//修改密码服务接口
export const editPasswordServ = (data) => {
  return post('/api/user/change-password', data);
}

//修改手机号服务接口
export const editMobileServ = (data) => {
  return post('/api/user/change-mobile', data);
}

//修改手机号服务接口
export const editEmailServ = (data) => {
  return post('/api/user/change-email', data);
}

//发送手机号修改验证码服务接口
export const sendMobileCodeServ = (data) => {
  return post('/api/user/send-mobile-code', data);
}

//发送找回密码验证码
export const sendVerifyCodeServ = (data) => {
  return post('/api/auth/send-verify-code', data);
}

//找回密码服务
export const forgetPasswordServ = (data) => {
  return post('/api/auth/forget-password', data);
}

//解除好友关系服务接口
export const removeFriendServ = (data) => {
  return post('/api/user/remove-friend', data);
}

//搜索用户信息服务接口
export const searchUserServ = (data) => {
  return post('/api/user/search-user', data);
}

//修改好友备注服务接口
export const friendRemarkEditServ = (data) => {
  return post('/api/user/edit-friend-remark', data);
}

//修改个人信息服务接口
export const editUserSetupServ = (data) => {
  return post('/api/user/edit-user-detail', data);
}

//查询用户信息服务接口
export const findUserDetailServ = () => {
  return get('/api/user/detail');
}

//获取用户相关设置信息
export const findUserSettingServ = () => {
  return get('/api/user/setting');
}


//查询好友申请未读数量服务接口
export const findFriendApplyNumServ = () => {
  return get('/api/user/friend-apply-num');
}

//好友申请服务接口
export const friendApplyServ = (data) => {
  return post('/api/user/send-friend-apply', data);
}

//查询好友申请服务接口
export const findFriendApplyServ = (data) => {
  return get('/api/user/friend-apply-records', data);
}

//处理好友申请服务接口
export const handleFriendApplyServ = (data) => {
  return post('/api/user/handle-friend-apply', data);
}

//删除好友申请记录服务接口
export const deleteFriendApplyServ = (data) => {
  return post('/api/user/delete-friend-apply', data);
}

//获取好友列表服务接口
export const friendsServ = (data) => {
  return get('/api/user/friends', data);
}

//查询用户群聊服务接口
export const findUserGroupsServ = () => {
  return get('/api/user/user-groups');
}

//发送邮箱验证码服务接口
export const sendEmailCodeServ = (data) => {
  return post('/api/user/send-change-email-code', data);
}
