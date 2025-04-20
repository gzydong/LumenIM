/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_RSA_PUBLIC_KEY: string
  // 更多环境变量...
}

declare interface Window {
  $electron: {
    // 更新系统托盘未读数
    setBadge(value: number): void
    openLink(url: string): void
  }
}
