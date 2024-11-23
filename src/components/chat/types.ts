import { VNode } from 'vue'

export enum RoleEnum {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export enum MessageTypeEnum {
  TEXT = 'text',
  TIME = 'time',
  CUSTOM = 'custom'
}

export enum StatusEnum {
  SENDING = 'sending',
  SENT = 'sent',
  ERROR = 'error'
}

export enum AlignEnum {
  LEFT_RIGHT = 'leftRight',
  LEFT_ALIGN = 'left'
}

export interface IMessage {
  // 消息ID【唯一性】
  msg_id: string
  // 消息发送时间
  time: string
  // 发送者角色
  role: RoleEnum
  // 类型
  type?: MessageTypeEnum
  // 昵称
  name?: string
  // 头像
  avatar?: string
  // 发送状态-预留
  status?: StatusEnum
  // 是否引用消息
  quote?: {
    // 原消息ID
    quote_id: string
    // 消息内容
    content: string
  }
  // 文本消息内容，配合 type=text 使用
  content?: string
  // 自定义渲染组件（当同时传 render及content，会渲染render自定义组件）
  render?: () => VNode
}

export interface IChatItem {
  // 消息ID【唯一性】
  msg_id: string
  [key: string]: any
}

export interface ChatProps {
  // 对齐方式 leftRight 左右对齐 left 左对齐
  alignMode?: 'leftRight' | 'left'
  // 是否显示头像
  showAvatar?: boolean
  // 聊天记录列表
  items: IChatItem[]
  // 自定义渲染消息
  customRender: (item: any) => IMessage
  dataSourceMode?: 'custom' | 'pulldown' | 'pullup'
  // 加载更多数据
  onScrollLoadMore?: () => Promise<boolean>
  // 是否开启右键菜单
  contextMenu?: boolean
  // 右键菜单
  contextMenuOption?: (item: any) => IDropdownOption[]
  // 右键菜单回调
  contextMenuEvent?: (key: string) => void
  // 消息未读数
  unread?: number
  // 是否显示工具菜单
  showToolsMenus?: boolean
  // 是否开启多选模式
  multiSelectMode?: boolean
}

export interface ChatSimpleProps {
  // 聊天记录列表
  items: IChatItem[]
  // 自定义渲染消息
  customRender: (item: any) => IMessage
}

export interface IDropdown {
  options: any[]
  show: boolean
  x: number
  y: number
  item: any
}

export interface IDropdownOption {
  label: string
  key: string
  disabled?: boolean
}
