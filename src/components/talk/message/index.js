import { defineAsyncComponent } from 'vue'

export function setComponents(app) {
  // 动态导出当前目录下的组件
  const modules = import.meta.glob(['./*.vue', './system/*.vue'])

  for (const [key, value] of Object.entries(modules)) {
    const name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
    app.component(name, defineAsyncComponent(value))
  }
}
