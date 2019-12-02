import {
  post,
  get,
  upload
} from '@/utils/request.js'

//登录请求接口
export const loginApi = (data) => {
  return post('/api/auth/login', data);
}

//注册请求接口
export const registerApi = (data) => {
  return post('/api/auth/register', data);
}

//退出登录接口
export const logoutApi = (data) => {
  return post('/api/auth/logout', data);
}

//用户好友列表
export const friendsApi = (data) => {
  return get('/api/user/friends', data);
}

//获取用户聊天记录列表
export const chatListsApi = (data) => {
  return get('/api/chat/chat-list', data);
}

//获取私信或群聊的聊天记录
export const chatRecordsApi = (data) => {
  return get('/api/chat/chat-records', data);
}


//用户修改密码接口
export const changePwdApi = (data) => {
  return post('/api/user/change-password', data);
}

//查询用户信息接口
export const searchUserApi = (data) => {
  return post('/api/user/search-user', data);
}

//修改好友备注昵称接口
export const friendRemarkApi = (data) => {
  return post('/api/user/edit-friend-remark', data);
}

//创建用户聊天列表
export const crateChatListApi = (data) => {
  return post('/api/chat/create-chat-list', data);
}

export const refreshToken = (data) => {
  return post('/api/auth/refresh-token');
}

//修改用户个人信息
export const editUserSetupApi = (data) => {
  return post('/api/user/edit-user-detail', data);
}

//获取用户个人信息
export const getUserDetailApi = () => {
  return get('/api/user/detail');
}



//获取请求添加好友申请记录接口
export const friendApplyRecords = () => {
  return get('/api/user/friend-apply-records');
}

//发送请求添加好友申请接口
export const sendFriendApplyApi = (data) => {
  return post('/api/user/send-friend-apply', data);
}

//处理好友申请接口
export const handleFriendApplyApi = (data) => {
  return post('/api/user/handle-friend-apply', data);
}








//获取用户的群聊列表接口
export const userGroups = () => {
  return get('/api/user/user-groups');
}

//获取聊天群信息
export const groupDetail = (data) => {
  return get('/api/chat/group-detail', data);
}

//退出群聊
export const dismissGroup = (data) => {
  return post('/api/chat/dismiss-group-chat', data);
}

// 创建群聊接口
export const createGroupChatApi = (data) => {
  return post('/api/chat/launch-group-chat', data);
}

//邀请群聊接口
export const inviteGroupMember = (data) =>{
  return post('/api/chat/invite-group-chat', data);
}

//获取聊天好友
export const groupChatMemebers = (data) => {
  return get('/api/chat/get-chat-member',data);
}




//上传头像裁剪图片
export const uploadFileStream = (data) =>{
  return post('/api/upload/file-stream', data);
}


//更新用户消息未读数
export const updateChatUnreadNumApi = (data)=>{
 return get('/api/chat/update-chat-unread-num',data);
}

//获取好友申请未读数量
export const friendApplyNumApi = ()=>{
 return get('/api/user/friend-apply-num');
}


//设置用户群名片
export const setUserGroupCardApi = (data) =>{
  return post('/api/chat/set-group-card', data);
}

//上传图片接口
export const uploadImgApi = (data)=>{
  return upload('/api/upload/img',data);
}