module.exports = () => {
    const { dialog, ipcMain, net } = require('electron')
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
        let response;
        const { method, url, body, headers, filePath } = arg;
        if (filePath) {
            const fileStream = fs.createReadStream(filePath);
            const fileSize = fs.statSync(filePath).size;
            let uploadedSize = 0;
            // 使用 Transform 流计算上传进度
            const progressStream = new (require('stream').Transform)({
                transform(chunk, encoding, callback) {
                    uploadedSize += chunk.length;
                    const progress = Math.min((uploadedSize / fileSize) * 100, 100);
                    event.sender.send('upload-progress', progress); // 向渲染进程发送进度
                    callback(null, chunk);
                },
            });
            response = await net.fetch(url, { method, headers,
                body: fileStream.pipe(progressStream),
            });
        } else {
            response = await net.fetch(url, { method, body, headers });
        }
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