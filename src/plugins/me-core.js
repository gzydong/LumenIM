import * as message from '@/components/talk/message'
import Avatar from '@/components/base/Avatar.vue'

// 注册全局消息组件
export function setComponents(app) {
  for (const key in message) {
    app.component(key, message[key])
  }

  app.component('im-avatar', Avatar)
}
