import { RoleEnum, MessageTypeEnum, IMessage, StatusEnum } from '@/components/chat'
import { ITalkRecord } from '@/types/chat.ts'
import { components } from './components.tsx'

function render(extra: any, message: ITalkRecord, role: string) {
  const msgType = message.msg_type
  return components[msgType]?.(extra, message, role) || <unknown-message msgType={msgType} />
}

export const formatChatMessage = (loginUserId: number, chat: ITalkRecord): IMessage => {
  const { msg_id, from_id, send_time, nickname, avatar, extra } = chat

  if (from_id == 0 || chat.msg_type >= 1000) {
    return {
      msg_id: msg_id,
      role: RoleEnum.SYSTEM,
      type: MessageTypeEnum.CUSTOM,
      time: send_time,
      render: () => render(extra, chat, RoleEnum.SYSTEM),
      status: StatusEnum.SENT
    }
  }

  if (chat.is_revoked == 1) {
    return {
      msg_id: msg_id,
      role: RoleEnum.SYSTEM,
      type: MessageTypeEnum.TEXT,
      time: send_time,
      content: '此消息已被撤回',
      status: StatusEnum.SENT
    }
  }

  const role = from_id != loginUserId ? RoleEnum.ASSISTANT : RoleEnum.USER

  const quote = chat?.quote
    ? {
        quote_id: chat.quote?.quote_id || '',
        content: chat.quote?.content || ''
      }
    : undefined

  let status = StatusEnum.SENT
  if ([2, 3].includes(chat.status)) {
    status = chat.status == 2 ? StatusEnum.SENDING : StatusEnum.ERROR
  }

  return {
    role,
    msg_id: msg_id,
    type: MessageTypeEnum.CUSTOM,
    time: send_time,
    name: nickname,
    avatar: avatar,
    quote: quote,
    render: () => render(extra, chat, role),
    status
  }
}
