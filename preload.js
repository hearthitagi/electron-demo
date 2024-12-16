
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const { exec } = require('child_process');
const path = require('node:path')
const { net } = require('electron')
const fs = require('fs');
const hostsPath = '/etc/hosts';


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
ipcMain.handle('http-request', handleRequest) // 接口请求
ipcMain.handle('modify-files', modifyHosts) //修改hosts
ipcMain.handle('run-sh', runScript) //执行和脚本

// 修改hosts
function modifyHosts(event, newEntry) {
  console.log(newEntry);
  // 读取原始内容
  fs.readFile(hostsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('读取 hosts 文件失败:', err);
      return;
    }

    // 检查是否已存在相同的条目
    if (data.replace(/\s+/g, '').includes(newEntry.replace(/\s+/g, ''))) {
      console.log('ip已被映射，请换用其他ip。');
      return;
    }

    // 写入新内容
    dialog.showMessageBox({
      type: 'warning',
      buttons: ['取消', '继续'],
      defaultId: 1,
      title: '权限提示',
      message: '修改系统文件需要管理员权限，是否继续？'
    }).then(result => {
      if (result.response === 1) {
        modifyHostsWithSudo(newEntry)
      }
    });
  });
}
function modifyHostsWithSudo(newEntry) {
  const command = `echo "${newEntry}" | sudo tee -a /etc/hosts`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行命令失败: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`错误输出: ${stderr}`);
      return;
    }
    console.log(`成功输出: ${stdout}`);
  });
}

// 执行脚本
function runScript(scriptPath) {
  exec(`sudo bash ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行失败: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`错误: ${stderr}`);
      return;
    }
    console.log(`输出: ${stdout}`);
  });
}

// 接口请求
async function handleRequest(event, ...args) {
  try {
    if (args.length === 2) {
      const response = await net.fetch(args[0], args[1])
      if (response.ok) {
        return response.json()
      } else {
        return '接口请求错误'
      }
    } else if (args.length === 1) {
      console.log(args);

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