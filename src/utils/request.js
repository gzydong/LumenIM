import axios from 'axios';
import qs from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到
import auth from '@/utils/auth'
import {
  Notification
} from 'element-ui';

axios.defaults.timeout = 10000;
axios.defaults.baseURL = process.env.API_URL; //填写域名

// http request拦截器 添加一个请求拦截器
axios.interceptors.request.use(function(config) {
  config.headers['Authorization'] = 'Bearer ' + auth.getToken();
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  return config;
}, function(error) {
  return Promise.reject(error);
});


// axios.interceptors.response.use(success, async (error) => {
//  let {status} = error.response;
//   if (status == 401) {
//       let res = await getrefreshToken(refreshToken);
//       window.localstorage.token = res.token;
//       return axios.request(error.config);
//   }
//   return Promise.reject()
// })
// async function doRequest (error) {
//   const accessToken = await store.dispatch('refreshToken');
//   config.headers.Authorization = accessToken;
//   const res = await axios.request(error.response.config);
//   return res
// }




export const request = (option) => {
  return new Promise((resolve, reject) => {
    axios(option).then(v => {
      if (v && v.status == 200) {
        if (v.data.code == 401) {
          auth.remove();
        }
        resolve(v.data);
      } else {
        reject(v);
      }
    }).catch(err => {
      Notification({
        title: '温馨提示:',
        message: '接口或处理逻辑出错,...',
        position: 'bottom-right'
      });


      console.log(err,err.response)
      reject(err);
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
    ...options
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
    ...options
  }

  return request(params)
}


export const upload = (url, data = {},options = {})=>{
  const params = {
    url,
    data,
    method: 'post',
    ...options
  }

  return request(params)
}
