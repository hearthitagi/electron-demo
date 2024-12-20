const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const { spawn } = require('child_process');
const path = require('node:path')
const { net } = require('electron')
const fs = require('fs');


const createWindow = () => {
  Menu.setApplicationMenu(null)
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
  if (process.platform === 'win32') {
    mainWindow.loadFile('./paltform/win32/win32.html')
  }else if(process.platform === 'linux'){
    mainWindow.loadFile('./paltform/linux/linux.html')
  }
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

// 在当前文件中你可以引入所有的主进程代码 也可以拆分成几个文件，然后用 require 导入。
ipcMain.handle('modify-files', dealFiles) //修改文件

// 修改文件
async function dealFiles(event, ip) {
  const hostsPath = '/etc/hosts';
  const domain = 'www.example.com'
  const filePath = '/opt/docker/images/.env';
  const dir = path.dirname(filePath);
  let hostsData = ''; //hosts
  let envData = '';//env
  // env确保目录存在
  const ensureDirectoryExists = async (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      return new Promise((resolve, reject) => {
        reject('/opt/docker/images目录不存在')
      })
    }

  };
  // env文件处理
  const updateEnvFile = async (filePath, targetIp) => {
    if (fs.existsSync(filePath)) {
      // 文件存在，读取内容
      envData = fs.readFileSync(filePath, { encoding: 'utf8' });
      // 正则匹配 `FTP_EXPODE_IP` 的值
      const regex = /^FTP_EXPODE_IP=.*$/m;
      if (regex.test(envData)) {
        // 替换 IP 地址
        envData = envData.replace(regex, `FTP_EXPODE_IP=${targetIp}`);
      } else {
        // 如果文件中没有 `FTP_EXPODE_IP`，追加一行
        envData += `\nFTP_EXPODE_IP=${targetIp}`;
      }
    } else {
      // 文件不存在，初始化内容
      envData = `FTP_EXPODE_IP=${targetIp}`;
    }
  };
  // host文件处理
  const dealHostFile = async (hostsPath, ip) => {
    fs.readFile(hostsPath, 'utf8', (err, data) => {
      if (err) {
        return new Promise((resolve, reject) => {
          reject(`读取 hosts 文件失败: ${err}`)
        })
      }
      // 检查是否已存在相同的域名
      const regex = new RegExp(`^.*\\s+${domain}$`, 'm');
      if (regex.test(data)) {
        // 替换现有的 IP
        hostsData = data.replace(regex, `${ip} www.pulong.com`);
      } else {
        // 添加新的记录
        hostsData = data + `\n${ip} www.pulong.com`;
      }
    });
  }

  // 处理env
  await ensureDirectoryExists(dir); // 确保目录存在
  await updateEnvFile(filePath, ip); // 更新或写入文件
  // 处理hosts
  await dealHostFile(hostsPath, ip)

  // 写入新内容
  const result = await dialog.showMessageBox({
    type: 'warning',
    buttons: ['修改ip', '修改ip并重启'],
    title: '修改提醒',
    message: '请注意，修改ip影响较大，请慎重修改!!!是否确认修改ip，并重启应用'
  })
  if (result.response === 1) {
    return new Promise((resolve, reject) => {
      // 返回信息
      let stdoutData = '';
      let stderrData = '';
      // hosts
      const hostsCommand = `echo "${hostsData}" | tee ${hostsPath}`;
      // env
      const envCommand = `echo "${envData}" | tee ${filePath}`
      // 修改ip并重启
      const changeIPAndRestartCommand = `set -e; ${hostsCommand} && ${envCommand} && cd /opt/pl_robot/images/ && docker-compose down && docker-compose up -d`
      const command = spawn('pkexec', ['sh', '-c', changeIPAndRestartCommand]);
      command.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });
      command.stderr.on('data', (data) => {
        stderrData += data.toString();
      });
      command.on('close', (code) => {
        if (code === 0) {
          dialog.showMessageBox({
            type: 'info',
            message: '执行成功',
            buttons: ['确认'],
          })
          resolve(stderrData)
        } else {
          dialog.showMessageBox({
            type: 'error',
            message: '执行失败',
            buttons: ['确认'],
          })
          reject(stderrData)
        }
      });
    })
  } else if (result.response === 0) {
    return new Promise((resolve, reject) => {
      // 返回信息
      let stdoutData = '';
      let stderrData = '';
      // hosts
      const hostsCommand = `echo "${hostsData}" | tee ${hostsPath}`;
      // env
      const envCommand = `echo "${envData}" | tee ${filePath}`
      // 修改ip
      const changeIpCommand = `set -e; ${hostsCommand} && ${envCommand}`
      const command = spawn('pkexec', ['sh', '-c', changeIpCommand]);
      command.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });
      command.stderr.on('data', (data) => {
        stderrData += data.toString();
      });
      command.on('close', (code) => {
        if (code === 0) {
          dialog.showMessageBox({
            type: 'info',
            message: '修改成功',
            buttons: ['确认'],
          })
          resolve(stdoutData)
        } else {
          dialog.showMessageBox({
            type: 'error',
            message: '修改失败',
            buttons: ['确认'],
          })
          reject(stderrData)
        }
      });
    })
  }
}


// 接口请求
ipcMain.handle('http-request', handleRequest)
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