import { post, get, upload } from '@/utils/request'

export function queryModelList(data={}) {
  return post('/api/v1/echo/embedding/modelList', data)
  // return new Promise((resolve, reject) => {
  //   chrome.runtime.sendMessage(
  //     {
  //       type: "post-data",
  //       url: "/echo/embedding/modelList",
  //     },
  //     (response) => {
  //       if (!response.status) {
  //         resolve(response.data);
  //       } else {
  //         reject(response);
  //       }
  //     }
  //   );
  // });
}

export function queryChatList(params) {
  return post('/api/v1/echo/embedding/chatList', params)
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/embedding/chatList",
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
}

export function queryChatContentList(params) {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/embedding/chatContentList",
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
  return post('/api/v1/echo/embedding/chatContentList', params)
}

export function queryCollectModelList() {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/embedding/collectModelList",
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
  return post('/api/v1/echo/embedding/collectModelList')
}

// /echo/embedding/chatCompletion
export function queryChatCompletion(params) {
  return get('/api/v1/echo/embedding/chatCompletion', params)
}

