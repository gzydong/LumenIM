import { post, get, upload } from '@/utils/request'

export function queryChatList(params) {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/openai/chatList",
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
  return post('/api/v1/echo/openai/chatList', params)
}

export function createChat() {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/openai/createChat",
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
  return post('/api/v1/echo/openai/createChat')
}

export function queryChatContentList(params) {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/openai/chatContentListByPage",
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
  return post('/api/v1/echo/openai/chatContentListByPage', params)
}

export function queryPlugins() {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/openai/plugins",
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
  return post('/api/v1/echo/openai/plugins')
}

export function updateChatAiPlugin(params) {
  // return new Promise((resolve, reject) => {
    // chrome.runtime.sendMessage(
    //   {
    //     type: "post-data",
    //     url: "/echo/openai/updateChatAiPlugin",
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
  return post('/api/v1/echo/openai/updateChatAiPlugin', params)
}

export function callChat(params) {
  return post('/api/v1/copilot/chat', params)
}
