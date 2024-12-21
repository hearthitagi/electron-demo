// preload.js
const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('win32Api', {
    fetchApi: (channel, data) => {
        const validChannels = ['toMainGetApi', 'toMainPostApi']; // 定义允许的通道
        if (validChannels.includes(channel)) {
            return ipcRenderer.invoke(channel, data);
        }
    },
})

// 使用 contextBridge 暴露受控的 API
contextBridge.exposeInMainWorld('win32Affair', {
    send: (channel, data) => {
        const validChannels = ['toMain']; // 定义允许的通道
        if (validChannels.includes(channel)) {
            return ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, callback) => {
        const validChannels = ['fromMain']; // 定义允许的通道
        if (validChannels.includes(channel)) {
            return ipcRenderer.on(channel, (event, ...args) => callback(...args));
        }
    },
});

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {

})