import { defineAsyncComponent, App } from 'vue'

export function installComponent(app: App) {
  // 动态导出当前目录下的组件
  const modules = import.meta.glob<{ default: any }>(['./*.vue'])

  for (const [key, value] of Object.entries(modules)) {
    const name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
    app.component(
      name,
      defineAsyncComponent(() => value().then((mod) => mod.default))
    )
  }
}
