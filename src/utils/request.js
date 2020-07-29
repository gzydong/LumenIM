import axios from 'axios';
// 引入qs模块，用来序列化post类型的数据，后面会提到
import qs from 'qs';
import {
  getToken,
  removeAll
} from '@/utils/auth';

import {
  Notification
} from 'element-ui';

// 创建 axios 实例
const instance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
});

// http request拦截器
instance.interceptors.request.use(function (config) {
  config.headers['Authorization'] = 'Bearer ' + getToken();
  return config;
}, function (error) {
  return Promise.reject(error);
});


/**
 * 定义公共请求方法
 * 
 * @param {object} option 请求参数
 */
export const request = (option) => {
  return new Promise((resolve, reject) => {
    instance(option).then(response => {
      if (response && response.status == 200) {
        resolve(response.data);
      } else {
        reject(response);
      }
    }).catch(error => {
      if (error.response && error.response.status == 401) {
        removeAll()
        location.reload();
      } else {
        Notification({
          message: '网络异常,请稍后再试...',
          position: 'top-right'
        });
      }

      reject(error);
    })
  })
}

/**
 * 发送 get 请求
 * @param {string} url
 * @param {object} data
 * @param {object} options
 * @returns {Promise<any>}
 */
export const get = (url, data = {}, options = {}) => {
  const params = {
    url,
    params: data,
    method: 'get',
    ...options
  }

  return request(params);
}

/**
 * 发送 post 请求
 * @param {string} url
 * @param {object} data
 * @param {object} options
 * @returns {Promise<any>}
 */
export const post = (url, data = {}, options = {}) => {
  data = qs.stringify(data);
  const params = {
    url,
    data,
    method: 'post',
    ...options
  }

  return request(params);
}

/**
 * 发送上传文件 post 请求
 * @param {string} url
 * @param {object} data
 * @param {object} options
 * @returns {Promise<any>}
 */
export const upload = (url, data = {}, options = {}) => {
  const params = {
    url,
    data,
    method: 'post',
    ...options
  }

  return request(params);
}