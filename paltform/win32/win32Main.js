module.exports = () => {
    const { dialog, ipcMain } = require('electron')
    const { spawn } = require('child_process');
    const path = require('node:path')
    const fs = require('fs');

    ipcMain.handle('toMainGetApi', getRequest) // 接口请求
    ipcMain.handle('toMainPostApi', postRequest) // 接口请求

    async function getRequest(event, arg) {
        const { url, query } = arg;
        // 构建 URL 查询参数
        const queryString = new URLSearchParams(query).toString();
        const fullUrl = `${url}?${queryString}`;
        const response = await net.fetch(fullUrl); // 发送 GET 请求
        const data = await response.json(); // 假设返回 JSON 数据
        return data
    }

    async function postRequest(event, arg) {
        const { method, url, body, headers } = arg;
        const response = await net.fetch(url, { method, body, headers }); // 发送 POST 请求
        const data = await response.json(); // 假设返回 JSON 数据
        return data
    }
    


    // 接收来自渲染进程的消息
    ipcMain.on('toMain', (event, data) => {
        console.log('Received from renderer:', data);

        // 发送消息到渲染进程
        event.sender.send('fromMain', `Hello, ${data}`);
    });

}

