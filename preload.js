// preload.js
window.require = require;
const { contextBridge, ipcRenderer } = require('electron/renderer')


contextBridge.exposeInMainWorld('electronAPI', {
    request: (...response) => ipcRenderer.invoke('http-request', ...response),
    modifyFiles: (...response) => ipcRenderer.invoke('modify-files', ...response),
})

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {

})