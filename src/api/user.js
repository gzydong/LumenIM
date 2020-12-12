import {
  post,
  get,
  upload
} from '@/utils/request';

//登录服务接口
export const ServeLogin = (data) => {
  return post('/api/v1/auth/login', data);
}

//注册服务接口
export const ServeRegister = (data) => {
  return post('/api/v1/auth/register', data);
}

//退出登录服务接口
export const ServeLogout = (data) => {
  return post('/api/v1/auth/logout', data);
}

//刷新登录Token服务接口
export const ServeRefreshToken = (data) => {
  return post('/api/v1/auth/refresh-token');
}

//修改密码服务接口
export const ServeEditPassword = (data) => {
  return post('/api/v1/users/change-password', data);
}

//修改手机号服务接口
export const ServeEditMobile = (data) => {
  return post('/api/v1/users/change-mobile', data);
}

//修改手机号服务接口
export const ServeEditEmail = (data) => {
  return post('/api/v1/users/change-email', data);
}

//发送手机号修改验证码服务接口
export const ServeSendMobileCode = (data) => {
  return post('/api/v1/users/send-mobile-code', data);
}

//发送找回密码验证码
export const ServeSendVerifyCode = (data) => {
  return post('/api/v1/auth/send-verify-code', data);
}

//找回密码服务
export const ServeForgetPassword = (data) => {
  return post('/api/v1/auth/forget-password', data);
}

//解除好友关系服务接口
export const ServeRemoveFriend = (data) => {
  return post('/api/v1/users/remove-friend', data);
}

//搜索用户信息服务接口
export const ServeSearchUser = (data) => {
  return post('/api/v1/users/search-user', data);
}

//修改好友备注服务接口
export const ServeFriendRemarkEdit = (data) => {
  return post('/api/v1/users/edit-friend-remark', data);
}

//修改个人信息服务接口
export const ServeEditUserSetup = (data) => {
  return post('/api/v1/users/edit-user-detail', data);
}

//查询用户信息服务接口
export const ServeFindUserDetail = () => {
  return get('/api/v1/users/detail');
}

//获取用户相关设置信息
export const ServeFindUserSetting = () => {
  return get('/api/v1/users/setting');
}

//查询好友申请未读数量服务接口
export const ServeFindFriendApplyNum = () => {
  return get('/api/v1/users/friend-apply-num');
}

//好友申请服务接口
export const ServeFriendApply = (data) => {
  return post('/api/v1/users/send-friend-apply', data);
}

//查询好友申请服务接口
export const ServeFindFriendApply = (data) => {
  return get('/api/v1/users/friend-apply-records', data);
}

//处理好友申请服务接口
export const ServeHandleFriendApply = (data) => {
  return post('/api/v1/users/handle-friend-apply', data);
}

//删除好友申请记录服务接口
export const ServeDeleteFriendApply = (data) => {
  return post('/api/v1/users/delete-friend-apply', data);
}

//获取好友列表服务接口
export const friendsServ = (data) => {
  return get('/api/v1/users/friends', data);
}

//查询用户群聊服务接口
export const ServeFindUserGroups = () => {
  return get('/api/v1/users/user-groups');
}

//发送邮箱验证码服务接口
export const ServeSendEmailCode = (data) => {
  return post('/api/v1/users/send-change-email-code', data);
}
