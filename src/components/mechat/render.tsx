import { RoleEnum, MessageTypeEnum, IMessage, StatusEnum } from '@/components/chat'
import { ITalkRecord } from '@/types/chat.ts'

// 消息类型渲染函数
const components = {
  1: (extra: any, _: any, role: string) => {
    return <text-message content={extra?.content as string} role={role} />
  },
  2: (extra: any) => {
    return <code-message lang={extra?.lang as string} code={extra?.code as string} />
  },
  3: (extra: any) => {
    return <image-message url={extra?.url as string} />
  },
  4: (extra: any) => {
    return <audio-message src={extra?.url as string} />
  },
  5: (extra: any) => {
    return (
      <video-message
        url={extra?.url as string}
        cover={extra?.cover as string}
        duration={extra?.duration as number}
        size={extra?.size as number}
      />
    )
  },
  6: (extra: any, message: ITalkRecord) => {
    // todo talk-mode  待修改
    return (
      <file-message
        filename={extra?.name as string}
        filesize={extra?.size as number}
        msg-id={message.msg_id}
        talk-mode={1}
      />
    )
  },
  9: (extra: any) => {
    return (
      <forward-message
        count={extra?.msg_ids.length as number}
        msg-ids={extra?.msg_ids as string[]}
        talk-mode={extra?.talk_type as number}
        items={
          extra.records.map((item: any) => {
            return {
              content: item.content as string,
              nickname: item.nickname as string
            }
          }) || []
        }
      />
    )
  },
  10: (extra: any) => {
    return (
      <login-message
        datetime={extra.datetime as string}
        ip={extra.ip as string}
        address={extra.address as string}
        agent={extra.agent as string}
        reason={extra.reason as string}
      />
    )
  },
  11: (extra: any) => {
    return <vote-message vote_id={extra.vote_id} />
  },
  12: (extra: any) => {
    const items = extra?.items?.map((item: any) => {
      return {
        type: item.type == 1 ? 'text' : 'image',
        content: item.content
      }
    })

    return <mixed-message items={items || []} />
  },
  13: (extra: any) => {
    return (
      <group-notice-message title={extra?.title as string} content={extra?.content as string} />
    )
  },
  1000: (extra: any) => {
    return <sys-text-message content={extra?.content as string} />
  },
  1101: (extra: any) => {
    const tpl = '{0} 创建了群聊，并邀请了 {1} 加入'
    return (
      <sys-text-tpl-message
        content={
          replacePlaceholders(tpl, {
            '{0}': new Member(extra?.owner_name, extra?.owner_id),
            '{1}': extra?.members?.map((item: any) => {
              return new Member(item.nickname, item.user_id)
            })
          }) as string
        }
      />
    )
  },
  1102: (extra: any) => {
    const tpl = '{0} 邀请了 {1} 加入群聊'
    return (
      <sys-text-tpl-message
        content={
          replacePlaceholders(tpl, {
            '{0}': new Member(extra?.owner_name, extra?.owner_id),
            '{1}': extra?.members?.map((item: any) => {
              return new Member(item.nickname, item.user_id)
            })
          }) as string
        }
      />
    )
  },
  1103: (extra: any) => {
    const tpl = '{0} 退出了群聊'
    return (
      <sys-text-tpl-message
        content={
          replacePlaceholders(tpl, {
            '{0}': new Member(extra?.owner_name, extra?.owner_id)
          }) as string
        }
      />
    )
  },
  1104: (extra: any) => {
    const tpl = '{0} 将 {1} 踢出群聊'
    return (
      <sys-text-tpl-message
        content={
          replacePlaceholders(tpl, {
            '{0}': new Member(extra?.owner_name, extra?.owner_id),
            '{1}': extra?.members?.map((item: any) => {
              return new Member(item.nickname, item.user_id)
            })
          }) as string
        }
      />
    )
  },
  1107: (extra: any) => {
    const tpl = '{0} 已开启全员禁言'
    return (
      <sys-text-tpl-message
        content={
          replacePlaceholders(tpl, {
            '{0}': new Member(extra?.owner_name, extra?.owner_id)
          }) as string
        }
      />
    )
  },
  1108: (extra: any) => {
    const tpl = '{0} 已关闭全员禁言'
    return (
      <sys-text-tpl-message
        content={
          replacePlaceholders(tpl, {
            '{0}': new Member(extra?.owner_name, extra?.owner_id)
          }) as string
        }
      />
    )
  },
  1109: (extra: any) => {
    const tpl = '{0} 将 {1} 禁言'
    return (
      <sys-text-tpl-message
        content={
          replacePlaceholders(tpl, {
            '{0}': new Member(extra?.owner_name, extra?.owner_id),
            '{1}': extra?.members?.map((item: any) => {
              return new Member(item.nickname, item.user_id)
            })
          }) as string
        }
      />
    )
  },
  1110: (extra: any) => {
    const tpl = '{0} 将 {1} 解除禁言'
    return (
      <sys-text-tpl-message
        content={
          replacePlaceholders(tpl, {
            '{0}': new Member(extra?.owner_name, extra?.owner_id),
            '{1}': extra?.members?.map((item: any) => {
              return new Member(item.nickname, item.user_id)
            })
          }) as string
        }
      />
    )
  }
}

function render(extra: any, message: ITalkRecord, role: string) {
  const msgType = message.msg_type as number
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

  return {
    role,
    msg_id: msg_id,
    type: MessageTypeEnum.CUSTOM,
    time: send_time,
    name: nickname,
    avatar: avatar,
    quote: quote,
    render: () => render(extra, chat, role),
    status:
      chat.status == 1 ? StatusEnum.SENT : chat.status == 2 ? StatusEnum.SENDING : StatusEnum.ERROR
  }
}

export class Member {
  name: string // 成员的名字
  uid: string // 成员的唯一标识符

  constructor(name: string, uid: string) {
    this.name = name
    this.uid = uid
  }

  toHTML(): string {
    // 将成员转换为 HTML 链接字符串
    return `<a data-uid="${this.uid}">${this.name}</a>`
  }
}

// 替换模板字符串中的占位符
// `{0} 修改了 {1} 的会员状态`
export function replacePlaceholders(
  template: string,
  data: Record<string, Member | Member[]>
): string {
  let result = template

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Member) {
      // 单个数据
      const member = value
      result = result.split(key).join(member.toHTML())
    } else if (Array.isArray(value) && value.every((item) => item instanceof Member)) {
      // 多个数据
      const parts = value.map((member) => member.toHTML()).join('、')
      result = result.split(key).join(parts)
    } else {
      // 其他类型的占位符处理
      result = result.split(key).join(`${value}`)
    }
  }
  return result
}
