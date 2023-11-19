class ImSDK {
  /**
   * 发送文本消息
   *
   * @param {*} data
   */
  sendText(data = {}) {}

  /**
   * 发送图片消息
   *
   * @param {*} data
   */
  sendImage(data = {}) {}

  /**
   * 发送图片消息
   *
   * @param {*} data
   */
  sendFile(data = {}) {}

  /**
   * 发送代码消息
   *
   * @param {*} data
   */
  sendCode(data = {}) {}

  /**
   * 发送投票消息
   *
   * @param {*} data
   */
  sendVote(data = {}) {}

  /**
   * 发送位置消息
   *
   * @param {*} data
   */
  sendLocation(data = {}) {}

  /**
   * 发送表情包
   *
   * @param {*} data
   */
  sendEmoticon(data = {}) {}

  /**
   * 发送键盘消息
   */
  sendKeyboardMsg() {}
}

export default new ImSDK()
