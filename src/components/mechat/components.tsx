import { ITalkRecord } from '@/types/chat.ts'
import * as chat from '@/constant/chat.ts'
import { Member, replacePlaceholders } from './utils.ts'

// 自定义消息渲染
// 消息类型:渲染函数
export const components = {
  [chat.ChatMsgTypeText]: (extra: any, _: any, role: string) => {
    return <text-message content={extra?.content as string} role={role} />
  },
  [chat.ChatMsgTypeCode]: (extra: any) => {
    return <code-message lang={extra?.lang as string} code={extra?.code as string} />
  },
  [chat.ChatMsgTypeImage]: (extra: any) => {
    return <image-message url={extra?.url as string} />
  },
  [chat.ChatMsgTypeAudio]: (extra: any) => {
    return <audio-message src={extra?.url as string} />
  },
  [chat.ChatMsgTypeVideo]: (extra: any) => {
    return (
      <video-message
        url={extra?.url as string}
        cover={extra?.cover as string}
        duration={extra?.duration as number}
        size={extra?.size as number}
      />
    )
  },
  [chat.ChatMsgTypeFile]: (extra: any, message: ITalkRecord) => {
    return (
      <file-message
        filename={extra?.name as string}
        filesize={extra?.size as number}
        msg-id={message.msg_id}
      />
    )
  },
  [chat.ChatMsgTypeForward]: (extra: any) => {
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
  [chat.ChatMsgTypeLogin]: (extra: any) => {
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
  [chat.ChatMsgTypeVote]: (extra: any) => {
    return <vote-message vote_id={extra.vote_id} />
  },
  [chat.ChatMsgTypeMixed]: (extra: any) => {
    const items = extra?.items?.map((item: any) => {
      return {
        type: item.type == 1 ? 'text' : 'image',
        content: item.content
      }
    })

    return <mixed-message items={items || []} />
  },
  [chat.ChatMsgTypeGroupNotice]: (extra: any) => {
    return (
      <group-notice-message title={extra?.title as string} content={extra?.content as string} />
    )
  },
  [chat.ChatMsgSysText]: (extra: any) => {
    return <sys-text-message content={extra?.content as string} />
  },
  [chat.ChatMsgSysGroupCreate]: (extra: any) => {
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
  [chat.ChatMsgSysGroupMemberJoin]: (extra: any) => {
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
  [chat.ChatMsgSysGroupMemberQuit]: (extra: any) => {
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
  [chat.ChatMsgSysGroupMemberKicked]: (extra: any) => {
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
  [chat.ChatMsgSysGroupMuted]: (extra: any) => {
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
  [chat.ChatMsgSysGroupCancelMuted]: (extra: any) => {
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
  [chat.ChatMsgSysGroupMemberMuted]: (extra: any) => {
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
  [chat.ChatMsgSysGroupMemberCancelMuted]: (extra: any) => {
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
