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
export const ChatMsgSysGroupNoticeCreate = 1111 // 创建群公告
export const ChatMsgSysGroupNoticeUpdate = 1112 // 更新群公告
export const ChatMsgSysGroupTransfer = 1113 // 变更群主

function components() {
  let components = {}
  components[ChatMsgTypeText] = 'text-message'
  components[ChatMsgTypeCode] = 'code-message'
  components[ChatMsgTypeImage] = 'image-message'
  components[ChatMsgTypeAudio] = 'audio-message'
  components[ChatMsgTypeFile] = 'file-message'
  components[ChatMsgTypeForward] = 'forward-message'
  components[ChatMsgTypeLogin] = 'login-message'
  components[ChatMsgTypeVote] = 'vote-message'
  components[ChatMsgSysText] = 'sys-text-message'
  components[ChatMsgSysGroupCreate] = 'sys-group-create-message'
  components[ChatMsgSysGroupMemberJoin] = 'sys-group-join-message'
  components[ChatMsgSysGroupMemberQuit] = 'sys-group-member-quit-message'
  components[ChatMsgSysGroupMemberKicked] = 'sys-group-member-kicked-message'
  components[ChatMsgSysGroupMemberMuted] = 'sys-group-member-muted-message'
  components[ChatMsgSysGroupMemberCancelMuted] =
    'sys-group-member-cancel-muted-message'
  components[ChatMsgSysGroupTransfer] = 'sys-group-transfer-message'

  return components
}

// 消息类型 - 消息组件 映射关系
export const MessageComponents = components()

// 可转发的消息类型
export const ForwardableMessageType = [
  ChatMsgTypeText,
  ChatMsgTypeCode,
  ChatMsgTypeImage,
  ChatMsgTypeAudio,
  ChatMsgTypeVideo,
  ChatMsgTypeFile,
  ChatMsgTypeLocation,
  ChatMsgTypeCard,
]
