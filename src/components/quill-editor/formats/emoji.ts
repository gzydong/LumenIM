import Quill from 'quill'

const { EmbedBlot } = Quill.import('parchment')

class EmojiBlot extends EmbedBlot {
  static blotName = 'emoji'
  static tagName = 'img'
  static className = 'ed-emoji'

  static create(value: HTMLImageElement) {
    const node = super.create() as HTMLImageElement

    node.setAttribute('alt', value.alt)
    node.setAttribute('src', value.src)
    node.setAttribute('width', value.width.toString())
    node.setAttribute('height', value.height.toString())

    return node
  }

  static formats(node: HTMLImageElement) {
    return {
      alt: node.getAttribute('alt'),
      src: node.getAttribute('src'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    }
  }

  static value(node: HTMLImageElement) {
    // 主要在有初始值时起作用
    return {
      alt: node.getAttribute('alt'),
      src: node.getAttribute('src'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    }
  }
}

export default EmojiBlot
