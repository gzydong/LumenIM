import { App } from 'vue'
import { setComponents as Components } from '@/components/talk/message'
import Avatar from '@/components/base/Avatar.vue'

export { setupDirective } from '@/directive'

// 注册全局消息组件
export function setComponents(app: App) {
  Components(app)

  app.component('im-avatar', Avatar)
}
