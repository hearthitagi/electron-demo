layui.use(['upload', 'element'], (upload, element) => {
    var $ = layui.$;
    // 制作多文件上传表格
    var uploadListIns = upload.render({
        elem: '#ID-upload-demo-files',
        elemList: $('#ID-upload-demo-files-list'), // 列表元素对象
        url: '', // 实际使用时改成您自己的上传接口即可。
        accept: 'file',
        multiple: false,
        number: 1,
        auto: false,
        // bindAction: '#ID-upload-demo-files-action',
        choose: function (obj) {
            var that = this;
            var files = this.files = obj.pushFile(); // 将每次选择的文件追加到文件队列
            // 读取本地文件
            obj.preview(function (index, file, result) {
                var tr = $(['<tr id="upload-' + index + '">',
                '<td>' + file.name + '</td>',
                '<td>' + (file.size / 1024).toFixed(1) + 'kb</td>',
                '<td><div class="layui-progress" lay-filter="progress-demo-' + index + '"><div class="layui-progress-bar" lay-percent=""></div></div></td>',
                    '<td>',
                    '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>',
                    '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>',
                    '</td>',
                    '</tr>'].join(''));
                // 单个重传
                tr.find('.demo-reload').on('click', async () => {
                    try {
                        const res = await window.win32Api.fetchApi('toMainPostApi', {
                            method: 'POST',
                            url: 'https://expmple.com',
                            headers: { 'Content-Type': 'application/octet-stream' },
                            filePath: file.path,
                        });
                        console.log(res);
                    } catch (error) {
                        console.log(`上传失败:${error}`);
                    }
                });
                // 删除
                tr.find('.demo-delete').on('click', function () {
                    delete files[index]; // 删除对应的文件
                    tr.remove(); // 删除表格行
                    // 清空 input file 值，以免删除后出现同名文件不可选
                    uploadListIns.config.elem.next()[0].value = '';
                });
                that.elemList.append(tr);
                element.render('progress'); // 渲染新加的进度条组件

                // 监听上传进度
                window.win32Affair.receive('upload-progress', (progress) => {
                    console.log(`Upload progress: ${progress}%`);
                    element.progress('progress-demo-' + index, progress + '%');
                });

                // 手动上传
                const submitDom = document.querySelector('#ID-upload-demo-files-action')
                const tampThat = that
                submitDom.addEventListener('click', async () => {
                    try {
                        const res = await window.win32Api.fetchApi('toMainPostApi', {
                            method: 'POST',
                            url: 'https://expmple.com',
                            headers: { 'Content-Type': 'application/octet-stream' },
                            filePath: file.path,
                        });
                        console.log(res);
                    } catch (error) {
                        let tr = tampThat.elemList.find('tr#upload-' + index);
                        let tds = tr.children();
                        // 显示重传
                        tds.eq(3).find('.demo-reload').removeClass('layui-hide');
                        console.log(`上传失败:${error}`);
                    }
                })
            });
        },
    });
});


const testBtnDom = document.querySelector('.test-btn')
const testApiBtnDom = document.querySelector('.testapi-btn')


testBtnDom.addEventListener('click', async () => {
    // 发送消息到主进程
    window.win32Affair.send('toMain', 'Electron');
    // 接收来自主进程的消息
    window.win32Affair.receive('fromMain', (data) => {
        console.log('Received from main:', data);
    });
})
testApiBtnDom.addEventListener('click', async () => {
    const getRes = await window.win32Api.fetchApi('toMainGetApi', {
        url: 'https://api.kuleu.com/api/suijimima',
        query: { ss_cd: 8 },
    });
    console.log(getRes);
    // 传JSON
    // const postRes = await window.win32Api.fetchApi('toMainPostApi', {
    //     method: 'POST',
    //     url:'https://expmple.com',
    //     body: JSON.stringify({ page: 1, count: 20, robotId: 1 }),
    //     headers: { 'Content-Type': 'application/json' },
    // })
    // console.log(postRes)
    // 传表单
    // const formData = {title: 'foo',body: 'bar',userId: 1}
    // const formBody = Object.keys(formData)
    //   .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]))
    //   .join('&');
    // const postFormRes = await window.win32Api.fetchApi('toMainPostApi', {
    //     method: 'POST',
    //     url:'https://expmple.com',
    //     body: formBody,
    //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // })
    // console.log(postFormRes)

})

