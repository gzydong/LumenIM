// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron')
const path = require('path')

const { shell } = require('electron')

const NODE_ENV = process.env.NODE_ENV

function loadHtmlUrl() {
  return NODE_ENV === 'development'
    ? `http://localhost:${process.env.PROT}`
    : `file://${path.join(__dirname, '../dist/index.html')}`
}

function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  })

  // 加载 index.html
  win.loadURL(loadHtmlUrl())

  // 打开开发工具
  if (NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }

  // 进入全屏模式
  win.on('enter-full-screen', function () {
    win.webContents.send('full-screen', 'enter')
  })

  // 退出全屏模式
  win.on('leave-full-screen', function () {
    win.webContents.send('full-screen', 'leave')
  })

  ipcMain.on('get-full-screen', (e, data) => {
    e.returnValue = win.isFullScreen()
  })

  ipcMain.on('app-info', (e, data) => {
    e.returnValue = {
      platform: process.platform,
      version: app.getVersion(),
      appPath: app.getAppPath(),
    }
  })
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
// 也可以拆分成几个文件，然后用 require 导入。

ipcMain.on('ipc:set-badge', async (event, num) => {
  if (process.platform === 'darwin') {
    app.dock.setBadge(num > 99 ? '99+' : num)
  }
})

ipcMain.on('ipc:open-link', async (event, link) => {
  // Open a link in the default browser
  shell.openExternal(link)
})
