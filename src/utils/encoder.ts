import { uncompress, compress } from 'snappyjs'

class Encoder {
  private textDecoder: TextDecoder

  constructor() {
    this.textDecoder = new TextDecoder()
  }

  decode(buffer: Uint8Array) {
    const view = new DataView(buffer.buffer)

    const cmd = view.getUint32(0, false)
    const compress = view.getUint32(4, false)
    const msgid = Number(view.getBigInt64(8, false))

    const length = view.getUint32(16, false)

    let bufPayload = new Uint8Array(buffer.buffer, 20, length)
    if (compress) {
      try {
        console.log('解压前:', bufPayload)
        bufPayload = uncompress(bufPayload)
        console.log('解压后:', bufPayload)
      } catch (e) {
        console.error('Snappy 解压失败', e)
      }
    }

    let payload = ''

    try {
      payload = this.textDecoder.decode(bufPayload)
      payload = JSON.parse(payload)
    } catch (e) {
      console.error('JSON 解析失败', e)
    }

    return { cmd, msgid, payload }
  }

  encode(cmd: number, msgid: string, payload: any, compressPayload: boolean = false): Uint8Array {
    const textEncoder = new TextEncoder()
    const rawPayload = textEncoder.encode(JSON.stringify(payload))

    let payloadData = rawPayload
    let compressFlag = 0

    if (compressPayload) {
      try {
        payloadData = compress(rawPayload)
        compressFlag = 1
      } catch (e) {
        console.error('Snappy 压缩失败', e)
      }
    }

    const totalLength = 20 + payloadData.length
    const buffer = new ArrayBuffer(totalLength)
    const view = new DataView(buffer)

    // 写入 cmd (Uint32)
    view.setUint32(0, cmd, false)

    // 设置压缩标志
    view.setUint32(4, compressFlag, false)

    // 写入 msgid (转换为 BigInt)
    view.setBigUint64(8, BigInt(msgid), false)

    // 写入 payload length
    view.setUint32(16, payloadData.length, false)

    // 写入 payload 数据
    const uint8Buffer = new Uint8Array(buffer)
    uint8Buffer.set(payloadData, 20)

    return uint8Buffer
  }
}

export default new Encoder()
