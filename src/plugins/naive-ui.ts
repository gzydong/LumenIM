import { App } from 'vue'

import { create } from 'naive-ui'

// 按需全局安装组件
const naive = create({})

export function setupNaive(app: App) {
  app.use(naive)
}
