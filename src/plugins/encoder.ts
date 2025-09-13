import * as CryptoJS from 'crypto-js'
import * as snappy from 'snappyjs'

// 标志位定义
enum FlagPos {
  FlagCompressed = 0,
  FlagEncrypted = 1
}

interface ICompress {
  compress(data: Uint8Array): Uint8Array
  decompress(data: Uint8Array): Uint8Array
}

interface IEncrypter {
  encrypt(data: Uint8Array): Uint8Array
  decrypt(data: Uint8Array): Uint8Array
}

export class SnappyCompressor implements ICompress {
  compress(data: Uint8Array): Uint8Array {
    return snappy.compress(data)
  }

  decompress(data: Uint8Array): Uint8Array {
    return snappy.uncompress(data)
  }
}

export class AESCBCEncrypter implements IEncrypter {
  private key: CryptoJS.lib.WordArray
  private iv: CryptoJS.lib.WordArray

  constructor(keyStr: string, ivStr: string) {
    this.key = CryptoJS.enc.Utf8.parse(keyStr)
    this.iv = CryptoJS.enc.Utf8.parse(ivStr)
  }

  encrypt(data: Uint8Array): Uint8Array {
    const wordArray = CryptoJS.lib.WordArray.create(data.buffer)
    const encrypted = CryptoJS.AES.encrypt(wordArray, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    const ciphertext = encrypted.ciphertext
    const result = new Uint8Array(ciphertext.sigBytes)
    for (let i = 0; i < result.length; i++) {
      result[i] = (ciphertext.words[Math.floor(i / 4)] >> (24 - 8 * (i % 4))) & 0xff
    }

    return result
  }

  decrypt(data: Uint8Array): Uint8Array {
    const cipherWordArray = CryptoJS.lib.WordArray.create(data)
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherWordArray } as any, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    const bytes = decrypted.toString(CryptoJS.enc.Latin1)
    const result = new Uint8Array(bytes.length)
    for (let i = 0; i < bytes.length; i++) {
      result[i] = bytes.charCodeAt(i)
    }

    return result
  }
}

interface Packet {
  Cmd: number
  Msgid: bigint
  Payload: any
}

export class Encoder {
  private compressor?: ICompress
  private encrypter?: IEncrypter
  private decoder: TextDecoder
  private encoder: TextEncoder

  constructor(compressor?: ICompress, encrypter?: IEncrypter) {
    this.compressor = compressor
    this.encrypter = encrypter
    this.decoder = new TextDecoder()
    this.encoder = new TextEncoder()
  }

  pack(packet: Packet): Uint8Array {
    let flags = 0

    let body = this.encoder.encode(JSON.stringify(packet.Payload))

    // 压缩
    if (this.compressor) {
      body = this.compressor.compress(body)
      flags = this.setBit(flags, FlagPos.FlagCompressed)
    }

    // 加密
    if (this.encrypter) {
      body = this.encrypter.encrypt(body)
      flags = this.setBit(flags, FlagPos.FlagEncrypted)
    }

    const buf = new Uint8Array(16 + body.byteLength)
    const view = new DataView(buf.buffer)

    // 写入 Cmd (int32)
    view.setInt32(0, packet.Cmd, false) // 大端序

    // 写入 Flags (uint32)
    view.setUint32(4, flags, false)

    // 写入 MsgId (uint64)
    const high = Number(packet.Msgid >> BigInt(32))
    const low = Number(packet.Msgid & BigInt(0xffffffff))
    view.setUint32(8, high, false)
    view.setUint32(12, low, false)

    // 写入 Payload
    buf.set(body, 16)

    return buf
  }

  unpack(data: Uint8Array): Packet {
    const view = new DataView(data as ArrayBuffer)
    const buf = new Uint8Array(data)

    if (data.byteLength < 16) {
      throw new Error('Data too short')
    }

    const cmd = view.getInt32(0, false) // Cmd
    const flags = view.getUint32(4, false) // Flags
    const high = view.getUint32(8, false)
    const low = view.getUint32(12, false)
    const msgid = BigInt(high) * BigInt(0x100000000) + BigInt(low)

    const offset = 16
    let payload = buf.slice(offset)

    // 先解密
    if (this.hasBit(flags, FlagPos.FlagEncrypted)) {
      if (!this.encrypter) {
        throw new Error('Decryptor not available')
      }

      payload = this.encrypter.decrypt(payload)
    }

    // 后解压
    if (this.hasBit(flags, FlagPos.FlagCompressed)) {
      if (!this.compressor) {
        throw new Error('Decompressor not available')
      }
      payload = this.compressor.decompress(payload)
    }

    try {
      const body = this.decoder.decode(payload)

      return {
        Cmd: cmd,
        Msgid: msgid,
        Payload: JSON.parse(body)
      }
    } catch (e) {
      console.error(e, data)
      throw new Error('Invalid JSON')
    }
  }

  private setBit(flag: number, pos: FlagPos): number {
    return flag | (1 << pos)
  }

  private hasBit(flag: number, pos: FlagPos): boolean {
    return (flag & (1 << pos)) !== 0
  }
}
