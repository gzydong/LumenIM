// 会话列表
export interface ISessionRecord {
    index_name: string
    id: number
    talk_type: number
    receiver_id: number
    name: string
    avatar: string
    remark: string
    is_disturb: number
    is_online: number
    is_robot: number
    is_top: number
    msg_text: string
    unread_num: number
    updated_at: string
}

// 消息记录
export interface IMessageRecord {
    id: number
    sequence: number
    msg_id: string
    talk_type: number
    msg_type: number
    user_id: number
    receiver_id: number
    nickname: string
    avatar: string
    is_revoke: number
    is_mark: number
    is_read: number
    content: string
    created_at: string
    extra: any
    isCheck: boolean
    send_status: number
    float: string
}