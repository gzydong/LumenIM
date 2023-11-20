const { contextBridge, ipcRenderer } = require('electron')

// 暴露方法给渲染进程调用
contextBridge.exposeInMainWorld('electron', {
  // 设置消息未读数
  setBadge: num => {
    ipcRenderer.send('ipc:set-badge', num == 0 ? '' : `${num}`)
  },
  // 获取窗口全屏状态
  getFullScreenStatus: () => {
    return ipcRenderer.sendSync('get-full-screen', '')
  },
  // 系统信息
  getAppPlatform: () => {
    return ipcRenderer.sendSync('app-info', '')
  },

  openLink: link => {
    ipcRenderer.send('ipc:open-link', link)
  },
})

// 窗口变化事件
ipcRenderer.on('full-screen', function (event, value) {
  // isFullScreenStatus = value == 'enter'

  document.dispatchEvent(
    new CustomEvent('full-screen-event', { detail: value })
  )
})

// 触发自定义事件
// document.dispatchEvent(new CustomEvent('myTestEvent', {num: i}))
// document.addEventListener('myTestEvent', e => {console.log(e)})
// 所有Node.js API都可以在预加载过程中使用。
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
