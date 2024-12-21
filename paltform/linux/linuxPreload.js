const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('linuxApi', {
    commandApi: (channel, data) => {
        const validChannels = ['modify-files']; // 定义允许的通道
        if (validChannels.includes(channel)) {
            return ipcRenderer.invoke(channel, data);
        }
    },
})

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {

})