
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { net } = require('electron')


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    }
  })

  // 加载 index.html
  mainWindow.loadFile('index.html')

  // 打开开发工具
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // macOS
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// win linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
app.commandLine.appendSwitch('ignore-certificate-errors') // 忽略证书错误

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。

ipcMain.handle('http-request', handleRequest)

async function handleRequest(event, ...args) {
  console.log("zhuwenjian=======",...args);
  
  try {
    if (args.length === 2) {
      const response = await net.fetch(args[0], args[1])
      if (response.ok) {
        return response.json()
      } else {
        return '接口请求错误'
      }
    } else if (args.length === 1) {
      console.log("woshi2");
      
      const response = await net.fetch(args[0])
      console.log(response);
      if (response.ok) {
        return response.json()
      } else {
        return '接口请求错误'
      }
    }
  } catch (error) {
    return error
  }
}