import { App } from 'vue'

import {
  // create naive ui
  create,
  // component
  NButton,
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NAvatar,
  NIcon,
  NInput,
  NSpin,
  NEmpty,
  NModal,
  NTag,
  NSpace
} from 'naive-ui'

// 按需全局安装组件
const naive = create({
  components: [
    NButton,
    NLayout,
    NLayoutSider,
    NLayoutHeader,
    NLayoutContent,
    NLayoutFooter,
    NAvatar,
    NIcon,
    NInput,
    NSpin,
    NEmpty,
    NModal,
    NTag,
    NSpace
  ]
})

export function setupNaive(app: App) {
  app.use(naive)
}
