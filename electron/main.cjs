// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, ipcMain, Tray, Menu, MenuItem } = require('electron')
const path = require('path')

const { shell } = require('electron')

const isMac = process.platform === 'darwin'

const NODE_ENV = process.env.NODE_ENV

function loadHtmlUrl() {
  return NODE_ENV === 'development'
    ? `http://localhost:${process.env.PROT}`
    : `file://${path.join(__dirname, '../dist/index.html')}`
}

let mainWindow = null
let willQuitApp = false

// 隐藏主窗口
const hideMainWindow = () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.hide()
  }
}

// 展示主窗口
const showMainWindow = () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show()
  }
}

const initMenu = () => {
  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about', label: `关于 ${app.name}` },
              {
                label: '检查更新',
                click: () => {
                  mainWindow && mainWindow.webContents.send('check-update')
                }
              },
              { label: '代理设置' },
              { role: 'services', label: '设置' },
              { role: 'hide', label: `隐藏 ${app.name}` },
              { role: 'hideOthers', label: '隐藏其它应用' },
              { role: 'quit', label: `退出 ${app.name}` }
            ]
          }
        ]
      : []),
    // { role: 'fileMenu' }
    // { role: 'editMenu' }
    // { role: 'viewMenu' }
    {
      label: '显示',
      submenu: [
        { role: 'reload', label: '刷新' },
        { role: 'toggleDevTools', label: '开发调试工具' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'zoom', label: '缩放' },
        ...(isMac
          ? [{ type: 'separator' }, { role: 'front', label: '前置所有窗口' }]
          : [{ role: 'close', label: '关闭' }])
      ]
    },
    {
      role: 'help',
      label: '帮助',
      submenu: [
        {
          label: '了解更多',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://github.com/gzydong/LumenIM')
          }
        }
      ]
    }
  ]

  // const menu = Menu.buildFromTemplate(template)
  // Menu.setApplicationMenu(menu)
}

function createMainWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true
    }
  })

  // 加载 index.html
  mainWindow.loadURL(loadHtmlUrl())

  // 进入全屏模式
  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.send('full-screen', 'enter')
  })

  // 退出全屏模式
  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send('full-screen', 'leave')
  })

  mainWindow.on('close', (e) => {
    if (process.platform !== 'darwin') {
      // 非macOS平台，直接关闭
      return app.quit()
    }

    // 如果此时，应用并没有被退出，则终止默认行为，并且隐藏主窗口
    if (willQuitApp === false) {
      e.preventDefault()
      hideMainWindow()
    } else {
      mainWindow = null
    }
  })
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createMainWindow()

  app.on('activate', () => {
    // 修改激活应用操作
    if (!mainWindow) {
      createMainWindow()
    } else {
      showMainWindow()
    }
  })

  initMenu()
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 当app退出之前，将flag设置为truw
app.on('before-quit', () => (willQuitApp = true))

// 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
// 也可以拆分成几个文件，然后用 require 导入。
ipcMain.on('get-full-screen', (e, data) => {
  e.returnValue = mainWindow.isFullScreen()
})

ipcMain.on('app-info', (e, data) => {
  e.returnValue = {
    platform: process.platform,
    version: app.getVersion(),
    appPath: app.getAppPath()
  }
})

ipcMain.on('ipc:set-badge', async (event, num) => {
  if (process.platform === 'darwin') {
    app.dock.setBadge(num > 99 ? '99+' : num)
  }
})

ipcMain.on('ipc:open-link', async (event, link) => {
  // Open a link in the default browser
  shell.openExternal(link)
})
