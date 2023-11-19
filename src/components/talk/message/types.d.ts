export interface TextExtra {
    lang: string
    code: string
}

export interface CodeExtra {
    lang: string
    code: string
}

export interface FileExtra {
    drive: number
    name: string
    path: string
    suffix: string
    size: number
}

export interface ForwardExtra {
    msg_ids: number[];
    receiver_id: number;
    records: {
        nickname: string;
        text: string;
    }[];
    talk_type: number;
    user_id: number;
}

export interface GroupNoticeExtra {
    owner_id: number;
    owner_name: string;
    title: number;
    content: string;
}

export interface Data {
    float: string;
    content: string
}

export interface VideoExtra {
    cover: string;
    url: string
    duration: number
    size: number
}

export interface MixedExtra {
    items: {
        type: number;
        content: string;
        link: string;
    }[];
}