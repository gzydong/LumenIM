"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendEmoticonServ = exports.sendChatImgServ = exports.sendFileServ = exports.sendCodeBlockServ = exports.getRecordsContextServ = exports.searchChatRecordsServ = exports.findChatRecordsServ = exports.setNotDisturbServ = exports.getForwardRecordsServ = exports.forwardRecordsServ = exports.removeRecordsServ = exports.revokeRecordsServ = exports.chatRecordsServ = exports.clearChatUnreadNumServ = exports.topChatItemServ = exports.delChatItemServ = exports.chatListCrateServ = exports.chatListsServ = void 0;

var _request = require("@/utils/request");

//获取聊天列表服务接口
var chatListsServ = function chatListsServ(data) {
  return (0, _request.get)('/api/talk/list', data);
}; //聊天列表创建服务接口


exports.chatListsServ = chatListsServ;

var chatListCrateServ = function chatListCrateServ(data) {
  return (0, _request.post)('/api/talk/create', data);
}; //删除聊天列表服务接口


exports.chatListCrateServ = chatListCrateServ;

var delChatItemServ = function delChatItemServ(data) {
  return (0, _request.post)('/api/talk/delete', data);
}; //对话列表置顶服务接口


exports.delChatItemServ = delChatItemServ;

var topChatItemServ = function topChatItemServ(data) {
  return (0, _request.post)('/api/talk/topping', data);
}; //清除聊天消息未读数服务接口


exports.topChatItemServ = topChatItemServ;

var clearChatUnreadNumServ = function clearChatUnreadNumServ(data) {
  return (0, _request.post)('/api/talk/update-unread-num', data);
}; //获取聊天记录服务接口


exports.clearChatUnreadNumServ = clearChatUnreadNumServ;

var chatRecordsServ = function chatRecordsServ(data) {
  return (0, _request.get)('/api/talk/records', data);
}; //撤回消息服务接口


exports.chatRecordsServ = chatRecordsServ;

var revokeRecordsServ = function revokeRecordsServ(data) {
  return (0, _request.post)('/api/talk/revoke-records', data);
}; //删除消息服务接口


exports.revokeRecordsServ = revokeRecordsServ;

var removeRecordsServ = function removeRecordsServ(data) {
  return (0, _request.post)('/api/talk/remove-records', data);
}; //转发消息服务接口


exports.removeRecordsServ = removeRecordsServ;

var forwardRecordsServ = function forwardRecordsServ(data) {
  return (0, _request.post)('/api/talk/forward-records', data);
}; //获取转发会话记录详情列表服务接口


exports.forwardRecordsServ = forwardRecordsServ;

var getForwardRecordsServ = function getForwardRecordsServ(data) {
  return (0, _request.get)('/api/talk/get-forward-records', data);
}; //对话列表置顶服务接口


exports.getForwardRecordsServ = getForwardRecordsServ;

var setNotDisturbServ = function setNotDisturbServ(data) {
  return (0, _request.post)('/api/talk/set-not-disturb', data);
}; //查找用户聊天记录服务接口


exports.setNotDisturbServ = setNotDisturbServ;

var findChatRecordsServ = function findChatRecordsServ(data) {
  return (0, _request.get)('/api/talk/find-chat-records', data);
}; //查找用户聊天记录服务接口


exports.findChatRecordsServ = findChatRecordsServ;

var searchChatRecordsServ = function searchChatRecordsServ(data) {
  return (0, _request.get)('/api/talk/search-chat-records', data);
};

exports.searchChatRecordsServ = searchChatRecordsServ;

var getRecordsContextServ = function getRecordsContextServ(data) {
  return (0, _request.get)('/api/talk/get-records-context', data);
}; //发送代码块消息服务接口


exports.getRecordsContextServ = getRecordsContextServ;

var sendCodeBlockServ = function sendCodeBlockServ(data) {
  return (0, _request.post)('/api/talk/send-code-block', data);
};

exports.sendCodeBlockServ = sendCodeBlockServ;

var sendFileServ = function sendFileServ(data) {
  return (0, _request.post)('/api/talk/send-file', data);
}; //发送聊天图片服务接口


exports.sendFileServ = sendFileServ;

var sendChatImgServ = function sendChatImgServ(data) {
  return (0, _request.upload)('/api/talk/send-image', data);
};

exports.sendChatImgServ = sendChatImgServ;

var sendEmoticonServ = function sendEmoticonServ(data) {
  return (0, _request.post)('/api/talk/send-emoticon', data);
};

exports.sendEmoticonServ = sendEmoticonServ;