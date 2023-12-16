import { Delta } from '@vueup/vue-quill'

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

function removeLeadingNewlines(str: string) {
  return str.replace(/^[\n\s]+/, '')
}

function removeTrailingNewlines(str: string) {
  return str.replace(/[\n\s]+$/, '')
}

export function deltaToMessage(delta: Delta): AnalysisResp {
  const resp: AnalysisResp = {
    items: [],
    mentions: [],
    mentionUids: [],
    quoteId: '',
    msgType: 1
  }

  for (const iterator of delta.ops) {
    const insert: any = iterator.insert

    let node: any = null
    if (resp.items.length) {
      node = resp.items[resp.items.length - 1]
    }

    if (typeof insert === 'string') {
      if (!insert || insert == '\n') continue

      if (node && node.type == 1) {
        node.content = node.content + insert
        continue
      }

      resp.items.push({
        type: 1,
        content: insert
      })

      continue
    }

    // @好友
    if (insert && insert.mention) {
      const mention = insert.mention

      resp.mentions.push({
        name: `${mention.denotationChar}${mention.value}`,
        atid: parseInt(mention.id)
      })

      if (node && node.type == 1) {
        node.content = node.content + ` ${mention.denotationChar}${mention.value}`
        continue
      }

      resp.items.push({
        type: 1,
        content: `${mention.denotationChar}${mention.value}`
      })

      continue
    }

    // 图片
    if (insert && insert.image) {
      resp.items.push({
        type: 3,
        content: insert.image
      })
      continue
    }

    // 表情
    if (insert && insert.emoji) {
      const { emoji } = insert

      if (node && node.type == 1) {
        node.content = node.content + emoji.alt
        continue
      }

      resp.items.push({
        type: 1,
        content: emoji.alt
      })

      continue
    }

    if (insert && insert.quote) {
      resp.quoteId = insert.quote.id
      continue
    }
  }

  // 去除前后多余空格
  if (resp.items.length) {
    if (resp.items[0].type == 1) {
      resp.items[0].content = removeLeadingNewlines(resp.items[0].content)
    }

    if (resp.items[resp.items.length - 1].type == 1) {
      resp.items[resp.items.length - 1].content = removeTrailingNewlines(
        resp.items[resp.items.length - 1].content
      )
    }
  }

  if (resp.items.length > 1) {
    resp.msgType = 12
  }

  if (resp.items.length == 1) {
    resp.msgType = resp.items[0].type
  }

  resp.mentionUids = resp.mentions.map((item) => item.atid)

  return resp
}

export function deltaToString(delta: Delta): string {
  let content = ''

  for (const o of delta.ops) {
    const insert: any = o.insert

    if (typeof insert === 'string') {
      if (!insert || insert == '\n') continue

      content += insert
      continue
    }

    // @好友
    if (insert && insert.mention) {
      const { mention } = insert
      content += ` ${mention.denotationChar}${mention.value} `
      continue
    }

    // 图片
    if (insert && insert.image) {
      content += '[图片]'
      continue
    }

    // 表情
    if (insert && insert.emoji) {
      content += insert.emoji.alt
      continue
    }
  }

  return content
}

export function isEmptyDelta(delta: Delta): boolean {
  return delta.ops.length == 1 && delta.ops[0].insert == '\n'
}
