const { app, BrowserWindow, Menu } = require('electron')
const path = require('node:path')
app.commandLine.appendSwitch('ignore-certificate-errors') // 忽略证书错误

const createWindow = () => {
  Menu.setApplicationMenu(null)
  // 根据不同的操作系统选择不同的 preload 文件
  let preloadPath = '';
  switch (process.platform) {
    case 'win32': // Windows
      preloadPath = path.join(__dirname, 'platform/win32/win32Preload.js');
      break;
    case 'linux': // Linux
      preloadPath = path.join(__dirname, 'platform/linux/linuxPreload.js');
      break;
  }
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath,  // 动态选择 preload 文件
      contextIsolation: true, // 必须启用上下文隔离
      nodeIntegration: false, // 禁用 Node.js 集成
    }
  })

  // 加载 index.html
  if (process.platform === 'win32') {
    mainWindow.loadFile('./paltform/win32/win32.html')
    // 打开开发工具
    mainWindow.webContents.openDevTools()
  } else if (process.platform === 'linux') {
    mainWindow.loadFile('./paltform/linux/linux.html')
  }
}
app.whenReady().then(() => {
  createWindow()
  // macOS
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// win linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


// 在当前文件中你可以引入所有的主进程代码 也可以拆分成几个文件，然后用 require 导入。
let platformCode
if (process.platform === 'win32') {
  platformCode = require('./paltform/win32/win32Main.js')
} else if (process.platform === 'linux') {
  platformCode = require('./paltform/linux/linuxMain.js')
}
platformCode()

