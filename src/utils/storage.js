class Storage {
  // 缓存前缀
  prefix = ''

  // 缓存驱动
  storage = localStorage

  constructor(prefix = '', storage) {
    this.prefix = prefix
    this.storage = storage
  }

  cacheKey(key) {
    return `${this.prefix}_${key}`.toUpperCase()
  }

  get(key, def = '') {
    const item = this.storage.getItem(this.cacheKey(key))

    if (!item) return def

    try {
      const { value, expire } = JSON.parse(item)

      // 在有效期内直接返回
      if (expire === null || expire >= Date.now()) {
        return value
      }

      this.remove(key)
    } catch (e) {}

    return def
  }

  /**
   * 设置缓存
   *
   * @param {String} key // 缓存KEY
   * @param {Any} value // 缓存值
   * @param {Number|null} expire // 缓存时间单位秒
   */
  set(key, value, expire = 60 * 60 * 24) {
    this.storage.setItem(
      this.cacheKey(key),
      JSON.stringify({
        value,
        expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
      })
    )
  }

  remove(key) {
    this.storage.removeItem(this.cacheKey(key))
  }

  clear() {
    this.storage.clear()
  }
}

export default Storage

export const storage = new Storage('im', localStorage)
