export const GenderOptions = [
  {
    label: '未知',
    value: '0',
  },
  {
    label: '男',
    value: '1',
  },
  {
    label: '女',
    value: '2',
  },
]

export const defAvatar = new URL(
  `../assets/image/default-avatar.jpg`,
  import.meta.url
).href

export const notifyIcon = new URL(`../assets/image/notify.png`, import.meta.url)
  .href

export const defBanner = new URL(
  `../assets/image/default-user-banner.png`,
  import.meta.url
).href