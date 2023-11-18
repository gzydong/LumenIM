import { Delta } from 'quill'

interface Item {
    type: number
    content: string
}

interface AnalysisResp {
    items: Item[]
    mentions: any[]
    mentionUids: number[]
    msgType: number // 1 文本；2：图片；3图文混合消息
    quoteId: string // 引用的消息ID
}

function removeLeadingNewlines(str) {
    return str.replace(/^[\n\s]+/, '');
}


function removeTrailingNewlines(str) {
    return str.replace(/[\n\s]+$/, '');
}

export function deltaToMessage(delta: Delta): AnalysisResp {
    let resp: AnalysisResp = {
        items: [],
        mentions: [],
        mentionUids: [],
        quoteId: "",
        msgType: 1,
    }

    for (const iterator of delta.ops) {
        let node: any = null
        if (resp.items.length) {
            node = resp.items[resp.items.length - 1]
        }

        if (typeof (iterator.insert) === "string") {
            if (!iterator.insert || iterator.insert == "\n") continue

            if (node && node.type == 1) {
                node.content = node.content + iterator.insert
                continue
            }

            resp.items.push({
                "type": 1,
                "content": iterator.insert
            })

            continue
        }

        // @好友
        if (iterator.insert.mention) {
            let mention = iterator.insert.mention

            resp.mentions.push({
                "name": `${mention.denotationChar}${mention.value}`,
                "atid": parseInt(mention.id),
            })

            if (node && node.type == 1) {
                node.content = node.content + ` ${mention.denotationChar}${mention.value}`
                continue
            }

            resp.items.push({
                "type": 1,
                "content": `${mention.denotationChar}${mention.value}`
            })

            continue
        }

        // 图片
        if (iterator.insert.image) {
            resp.items.push({
                "type": 3,
                "content": iterator.insert.image
            })
            continue
        }

        // 表情
        if (iterator.insert.emoji) {
            let emoji = iterator.insert.emoji

            if (node && node.type == 1) {
                node.content = node.content + emoji.alt
                continue
            }

            resp.items.push({
                "type": 1,
                "content": emoji.alt
            })

            continue
        }

        if (iterator.insert.quote) {
            resp.quoteId = iterator.insert.quote.id
            continue
        }
    }

    // 去除前后多余空格
    if (resp.items.length) {
        if (resp.items[0].type == 1) {
            resp.items[0].content = removeLeadingNewlines(resp.items[0].content)
        }

        if (resp.items[resp.items.length - 1].type == 1) {
            resp.items[resp.items.length - 1].content = removeTrailingNewlines(resp.items[resp.items.length - 1].content)
        }
    }

    if (resp.items.length > 1) {
        resp.msgType = 12
    }

    if (resp.items.length == 1) {
        resp.msgType = resp.items[0].type
    }

    resp.mentionUids = resp.mentions.map(item => item.atid)

    return resp
}


export function deltaToString(delta: Delta): string {
    let content = ''

    for (const o of delta.ops) {
        if (typeof (o.insert) === "string") {
            if (!o.insert || o.insert == "\n") continue

            content += o.insert
            continue
        }

        // @好友
        if (o.insert.mention) {
            let mention = o.insert.mention
            content += ` ${mention.denotationChar}${mention.value} `
            continue
        }

        // 图片
        if (o.insert.image) {
            content += '[图片]'
            continue
        }

        // 表情
        if (o.insert.emoji) {
            content += o.insert.emoji.alt
            continue
        }
    }

    return content
}