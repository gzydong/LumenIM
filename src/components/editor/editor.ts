interface Item {
    type: number
    content: string
}

interface AnalysisResp {
    items: Item[]
    mentions: any[]
    mentionUids: number[]
    msgType: number // 1 文本；2：图片；3图文混合消息
}

export function getEditorNodeInfo(delta): AnalysisResp {
    let resp: AnalysisResp = {
        items: [],
        mentions: [],
        mentionUids: [],
        msgType: 1,
    }

    for (const iterator of delta.ops) {
        let preNode
        if (resp.items.length) {
            preNode = resp.items[resp.items.length - 1]
        }

        if (typeof (iterator.insert) === "string") {
            if (!iterator.insert || iterator.insert == "\n") continue

            if (preNode && preNode.type == 1) {
                preNode.content = preNode.content + iterator.insert
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
            console.log(iterator.insert.mention)

            let mention = iterator.insert.mention

            resp.mentions.push({
                "name": `${mention.denotationChar}${mention.value}`,
                "atid": mention.id,
            })

            if (preNode && preNode.type == 1) {
                preNode.content = preNode.content + ` ${mention.denotationChar}${mention.value}`
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

            if (preNode && preNode.type == 1) {
                preNode.content = preNode.content + emoji.alt
                continue
            }

            resp.items.push({
                "type": 1,
                "content": emoji.alt
            })

            continue
        }
    }

    if (resp.items.length > 0) {
        if (resp.items[0].type == 1 && resp.items[0].content == "\n") {
            resp.items.shift()
        }

        if (resp.items[resp.items.length - 1].type == 1 && resp.items[resp.items.length - 1].content == "\n") {
            resp.items.pop()
        }
    }

    if (resp.items.length > 1) {
        resp.msgType = 12
    }

    if (resp.items.length == 1) {
        resp.msgType = resp.items[0].type
    }

    return resp
}
