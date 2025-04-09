export class Member {
  name: string // 成员的名字
  uid: string // 成员的唯一标识符

  constructor(name: string, uid: string) {
    this.name = name
    this.uid = uid
  }

  toHTML(): string {
    // 将成员转换为 HTML 链接字符串
    return `<a data-uid="${this.uid}">${this.name}</a>`
  }
}

// 替换模板字符串中的占位符
// `{0} 修改了 {1} 的会员状态`
export function replacePlaceholders(
  template: string,
  data: Record<string, Member | Member[]>
): string {
  let result = template

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Member) {
      // 单个数据
      const member = value
      result = result.split(key).join(member.toHTML())
    } else if (Array.isArray(value) && value.every((item) => item instanceof Member)) {
      // 多个数据
      const parts = value.map((member) => member.toHTML()).join('、')
      result = result.split(key).join(parts)
    } else {
      // 其他类型的占位符处理
      result = result.split(key).join(`${value}`)
    }
  }
  return result
}
