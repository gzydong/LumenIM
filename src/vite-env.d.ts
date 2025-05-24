/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly ENV: string
  readonly VITE_RSA_PUBLIC_KEY: string
  readonly VITE_BASE_API: string
  readonly VITE_SOCKET_API: string
}

declare interface Window {
  $electron: {
    // 更新系统托盘未读数
    setBadge(value: number): void
    openLink(url: string): void
  }
}
