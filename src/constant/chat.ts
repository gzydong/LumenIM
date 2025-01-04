export enum ChatMsgStatus {
  // 消息状态
  Sending = 1, // 发送中
  Sent = 2, // 已发送
  Failed = 3, // 发送失败
  Revoke = 4 // 已撤回
}

export enum TalkModeEnum {
  // 聊天类型
  Single = 1, // 单聊
  Group = 2 // 群聊
}

export const ChatMsgTypeText = 1 // 文本消息
export const ChatMsgTypeCode = 2 // 代码消息
export const ChatMsgTypeImage = 3 // 图片文件
export const ChatMsgTypeAudio = 4 // 语音文件
export const ChatMsgTypeVideo = 5 // 视频文件
export const ChatMsgTypeFile = 6 // 其它文件
export const ChatMsgTypeLocation = 7 // 位置消息
export const ChatMsgTypeCard = 8 // 名片消息
export const ChatMsgTypeForward = 9 // 转发消息
export const ChatMsgTypeLogin = 10 // 登录消息
export const ChatMsgTypeVote = 11 // 投票消息
export const ChatMsgTypeMixed = 12 // 混合消息
export const ChatMsgTypeGroupNotice = 13 // 群公告消息

export const ChatMsgSysText = 1000 // 系统文本消息
export const ChatMsgSysGroupCreate = 1101 // 创建群聊消息
export const ChatMsgSysGroupMemberJoin = 1102 // 加入群聊消息
export const ChatMsgSysGroupMemberQuit = 1103 // 群成员退出群消息
export const ChatMsgSysGroupMemberKicked = 1104 // 踢出群成员消息
export const ChatMsgSysGroupMessageRevoke = 1105 // 管理员撤回成员消息
export const ChatMsgSysGroupDismissed = 1106 // 群解散
export const ChatMsgSysGroupMuted = 1107 // 群禁言
export const ChatMsgSysGroupCancelMuted = 1108 // 群解除禁言
export const ChatMsgSysGroupMemberMuted = 1109 // 群成员禁言
export const ChatMsgSysGroupMemberCancelMuted = 1110 // 群成员解除禁言
export const ChatMsgSysGroupTransfer = 1113 // 变更群主

export const ChatMsgTypeMapping = {
  [ChatMsgTypeText]: '[文本消息]',
  [ChatMsgTypeImage]: '[图片消息]',
  [ChatMsgTypeAudio]: '[语音消息]',
  [ChatMsgTypeVideo]: '[视频消息]',
  [ChatMsgTypeFile]: '[文件消息]',
  [ChatMsgTypeLocation]: '[位置消息]',
  [ChatMsgTypeCard]: '[名片消息]',
  [ChatMsgTypeForward]: '[转发消息]',
  [ChatMsgTypeLogin]: '[登录消息]',
  [ChatMsgTypeVote]: '[投票消息]',
  [ChatMsgTypeCode]: '[代码消息]',
  [ChatMsgTypeMixed]: '[图文消息]',
  [ChatMsgTypeGroupNotice]: '[群公告]',
  [ChatMsgSysText]: '[系统消息]',
  [ChatMsgSysGroupCreate]: '[创建群消息]',
  [ChatMsgSysGroupMemberJoin]: '[加入群消息]',
  [ChatMsgSysGroupMemberQuit]: '[退出群消息]',
  [ChatMsgSysGroupMemberKicked]: '[踢出群消息]',
  [ChatMsgSysGroupMessageRevoke]: '[撤回消息]',
  [ChatMsgSysGroupDismissed]: '[群解散消息]',
  [ChatMsgSysGroupMuted]: '[群禁言消息]',
  [ChatMsgSysGroupCancelMuted]: '[群解除禁言消息]',
  [ChatMsgSysGroupMemberMuted]: '[群成员禁言消息]',
  [ChatMsgSysGroupMemberCancelMuted]: '[群成员解除禁言消息]'
}

// 可转发的消息类型
export const ForwardableMessageType = [
  ChatMsgTypeText,
  ChatMsgTypeCode,
  ChatMsgTypeImage,
  ChatMsgTypeAudio,
  ChatMsgTypeVideo,
  ChatMsgTypeFile,
  ChatMsgTypeLocation,
  ChatMsgTypeCard
]
