import { post, get } from '@/utils/request'

// 修改密码服务接口
export const ServeUpdatePassword = (data) => {
  return post('/api/v1/users/change/password', data)
}

// 修改手机号服务接口
export const ServeUpdateMobile = (data) => {
  return post('/api/v1/users/change/mobile', data)
}

// 修改手机号服务接口
export const ServeUpdateEmail = (data) => {
  return post('/api/v1/users/change/email', data)
}

// 修改个人信息服务接口
export const ServeUpdateUserDetail = (data) => {
  return post('/api/v1/users/change/detail', data)
}

// 查询用户信息服务接口
export const ServeGetUserDetail = () => {
  return get('/api/v1/users/detail')
}

// 获取用户相关设置信息
export const ServeGetUserSetting = () => {
  return get('/api/v1/users/setting')
}

// 获取用户相关系统配置信息
export const ServeGetUserConfig = () => {
  return get('/api/v1/users/config')
}

// 获取用户相关系统配置信息分组
export const ServeGetUserConfigGroup = () => {
  return get('/api/v1/users/config/group')
}

// 修改配置服务接口
export const ServeUpdateConfig = (data) => {
  return post('/api/v1/users/config', data)
}

export function fetchUserInfo() {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "get-user-data",
    //   },
    //   (response) => {
    //     if (response && !response.status) {
    //       resolve(response.data);
    //     } else {
    //       reject(response);
    //     }
    //   }
    // );
  // });
  return get('/api/v1/users/detail')
}

export function fetchLogin(params) {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "user-login",
    // url: "/users/login",
    //     params,
    //   },
    //   (response) => {
    //     if (!response.status) {
    //       resolve(response.data);
    //     } else {
    //       reject(response);
    //     }
    //   }
    // );
  // });
  return post('/api/v1/users/login', params)
}

export function fetchRegister(params) {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/user/register",
    //     params,
    //   },
    //   (response) => {
    //     if (response && !response.status) {
    //       resolve(response.data);
    //     } else {
    //       reject(response);
    //     }
    //   }
    // );
  // });
  return post('/api/v1/users/register', params)
}

export function fetchUpdateUser(params) {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/user/update",
    //     params,
    //   },
    //   (response) => {
    //     if (response && !response.status) {
    //       resolve(response.data);
    //     } else {
    //       reject(response);
    //     }
    //   }
    // );
  // });
  return post('/api/v1/users/update', params)
}

export function fetchSendSms(params) {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/user/sendSms",
    //     params,
    //   },
    //   (response) => {
    //     if (response && !response.status) {
    //       resolve(response.data);
    //     } else {
    //       reject(response);
    //     }
    //   }
    // );
  // });
  return post('/api/v1/users/sendSms', params)
}

export function queryAppVersion(params) {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/checkVersion",
    //     params,
    //   },
    //   (response) => {
    //     if (!response.status) {
    //       resolve(response.data);
    //     } else {
    //       reject(response);
    //     }
    //   }
    // );
  // });
  return post('/api/v1/echo/checkVersion', params)
}
