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

export function getEditorNodeInfo(editor: HTMLElement | null): AnalysisResp {
    let resp: AnalysisResp = {
        items: [],
        mentions: [],
        mentionUids: [],
        msgType: 1,
    }

    let nodes = editor ? editor.childNodes : []

    for (const node of nodes) {
        let preNode
        if (resp.items.length) {
            preNode = resp.items[resp.items.length - 1]
        }

        if (node.nodeName == "#text") {
            if (!node.textContent) continue

            if (preNode && preNode.type == 1) {
                preNode.content = preNode.content + node.textContent
                continue
            }

            resp.items.push({
                "type": 1,
                "content": node.textContent
            })

            continue
        }

        if (node.nodeName == "IMG" && node.className == "ed-emoji") {
            if (preNode && preNode.type == 1) {
                preNode.content = preNode.content + node.dataset.text
                continue
            }

            resp.items.push({
                "type": 1,
                "content": node.dataset.text
            })

            continue
        }

        if (node.nodeName == "SPAN" && node.className == "ed-mention") {
            resp.mentions.push({
                "name": node.textContent,
                "atid": node.dataset.atid,
            })

            if (preNode && preNode.type == 1) {
                preNode.content = preNode.content + node.textContent
                continue
            }

            resp.items.push({
                "type": 1,
                "content": node.textContent || ""
            })

            continue
        }

        if (node.nodeName == "IMG" && node.className == "ed-image") {
            resp.items.push({
                "type": 3,
                "content": node.currentSrc
            })
            continue
        }
    }

    if (resp.items.length > 1) {
        resp.msgType = 12
    }

    if (resp.items.length == 1) {
        resp.msgType = resp.items[0].type
    }

    // console.log(JSON.stringify(resp.items))

    return resp
}
