import axios from 'axios';
import qs from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到
import auth from '@/utils/auth.js'
import {
  Notification
} from 'element-ui';


axios.defaults.timeout = 10000;

// axios.defaults.baseURL = 'http://192.168.6.60:92'; //填写域名
axios.defaults.baseURL = 'http://47.105.180.123:9501'; //填写域名
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// http request拦截器 添加一个请求拦截器
axios.interceptors.request.use(function(config) {
  config.headers['Authorization'] = 'Bearer ' + auth.getToken();
  return config;
}, function(error) {
  return Promise.reject(error);
});

export const request = (option) => {
  return new Promise((resolve, reject) => {
    axios(option).then(v => {
      if (v && v.status == 200) {
        if (v.data.code == 401) {
          auth.removeToken();
          auth.removeSid();
        }
        resolve(v.data);
      } else {
        reject(v);
      }
    }).catch(e => {
      Notification({
        title: '温馨提示:',
        message: '接口或处理逻辑出错,...',
        position: 'bottom-right'
      });
      reject(e);
    })
  })
}

/**
 * 发送get 请求
 * @param {string} url
 * @param {object} data
 * @param {object} options
 * @returns {Promise<any>}
 */
export const get = (url, data = {}, options = {}) => {
  const params = {
    url,
    params:data,
    method: 'get',
    ...options,
  }

  return request(params)
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
    ...options,
  }

  return request(params)
}
