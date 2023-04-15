import * as message from '@/components/talk/message'

// 注册全局消息组件
export function setComponents(app) {
  for (const key in message) {
    app.component(key, message[key])
  }
}
