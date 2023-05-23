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

export interface Data {
    float: string;
    content: string
}