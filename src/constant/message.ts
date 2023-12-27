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
export const ChatMsgSysGroupNotice = 1111 // 编辑群公告
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
  [ChatMsgSysGroupMemberCancelMuted]: '[群成员解除禁言消息]',
  [ChatMsgSysGroupNotice]: '[群公告]'
}

// 消息类型 - 消息组件 映射关系
export const MessageComponents = {
  [ChatMsgTypeText]: 'text-message',
  [ChatMsgTypeImage]: 'image-message',
  [ChatMsgTypeAudio]: 'audio-message',
  [ChatMsgTypeVideo]: 'video-message',
  [ChatMsgTypeFile]: 'file-message',
  [ChatMsgTypeLocation]: 'location-message',
  [ChatMsgTypeCard]: 'user-card-message',
  [ChatMsgTypeForward]: 'forward-message',
  [ChatMsgTypeLogin]: 'login-message',
  [ChatMsgTypeVote]: 'vote-message',
  [ChatMsgTypeCode]: 'code-message',
  [ChatMsgTypeMixed]: 'mixed-message',
  [ChatMsgTypeGroupNotice]: 'group-notice-message',
  [ChatMsgSysText]: 'sys-text-message',
  [ChatMsgSysGroupCreate]: 'sys-group-create-message',
  [ChatMsgSysGroupMemberJoin]: 'sys-group-join-message',
  [ChatMsgSysGroupMemberQuit]: 'sys-group-member-quit-message',
  [ChatMsgSysGroupMemberKicked]: 'sys-group-member-kicked-message',
  // [ChatMsgSysGroupMessageRevoke]: '[撤回消息]',
  // [ChatMsgSysGroupDismissed]: '[群解散消息]',
  [ChatMsgSysGroupMuted]: 'sys-group-muted-message',
  [ChatMsgSysGroupCancelMuted]: 'sys-group-cancel-muted-message',
  [ChatMsgSysGroupMemberMuted]: 'sys-group-member-muted-message',
  [ChatMsgSysGroupMemberCancelMuted]: 'sys-group-member-cancel-muted-message',
  [ChatMsgSysGroupTransfer]: 'sys-group-transfer-message'
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
