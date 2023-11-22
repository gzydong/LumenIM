import { setComponents as Components } from '@/components/talk/message'
import Avatar from '@/components/base/Avatar.vue'

// 注册全局消息组件
export function setComponents(app) {
  Components(app)

  app.component('im-avatar', Avatar)
}
