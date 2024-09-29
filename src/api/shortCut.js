import { post, get, upload } from '@/utils/request'

export function fetchAddShortCut(params) {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/shortcut/add",
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
  return post('/api/v1/echo/shortcut/add', params)
}

export function fetchShortCutList() {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/shortcut/list",
    //     params: {},
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
  return post('/api/v1/echo/shortcut/list')
}

export function fetchShortCutDetail(params) {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/shortcut/detail",
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
  return post('/api/v1/echo/shortcut/detail', params)
}

export function fetchUpdateShortCut(params) {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/shortcut/update",
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
  return post('/api/v1/echo/shortcut/update', params)
}
