import { App } from 'vue'
import Avatar from '@/components/basic/Avatar.vue'
import { installComponent } from '@/components/mechat/component'

export { setupDirective } from '@/directive'

// 注册全局消息组件
export function setComponents(app: App) {
  installComponent(app)

  app.component('im-avatar', Avatar)
}
