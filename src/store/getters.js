const getters = {
  // 用户登录状态
  loginStatus: state => state.user.loginStatus,

  // socket 连接状态
  socketStatus: state => state.socketStatus,
}

export default getters;