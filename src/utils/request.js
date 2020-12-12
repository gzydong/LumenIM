import axios from 'axios';
import config from '@/config/config'
import {
  getToken,
  removeAll
} from '@/utils/auth';

import {
  Notification
} from 'element-ui';

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: config.api_url,

  // 请求超时时间
  timeout: 20000
});

/**
 * 异常拦截处理器
 * 
 * @param {*} error 
 */
const errorHandler = (error) => {
  // 判断是否是响应错误信息
  if (error.response) {
    if (error.response.status == 401) {
      removeAll()
      location.reload();
    } else {
      Notification({
        message: '网络异常,请稍后再试...',
        position: 'top-right'
      });
    }
  }

  return Promise.reject(error);
}

// 请求拦截器
request.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config
}, errorHandler);

// 响应拦截器
request.interceptors.response.use((response) => {
  return response.data;
}, errorHandler);

/**
 * 发送 get 请求
 * @param {string} url
 * @param {object} data
 * @param {object} options
 * @returns {Promise<any>}
 */
export const get = (url, data = {}, options = {}) => {
  return request({
    url,
    params: data,
    method: 'get',
    ...options
  });
}

/**
 * 发送 post 请求
 * @param {string} url
 * @param {object} data
 * @param {object} options
 * @returns {Promise<any>}
 */
export const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data: data,
    ...options
  });
}

export const upload = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data: data,
    ...options
  });
}
