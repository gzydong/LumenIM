/// <reference types="vite/client" />

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

declare module 'quill-image-uploader'

declare interface Window {
  $electron: {
    // 更新系统托盘未读数
    setBadge(value: number): void
    openLink(url: string): void
  }
}
