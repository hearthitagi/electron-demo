const testBtnDom = document.querySelector('.test-btn')
const testApiBtnDom = document.querySelector('.testapi-btn')


testBtnDom.addEventListener('click', async() => {
    // 发送消息到主进程
    window.win32Affair.send('toMain', 'Electron');

    // 接收来自主进程的消息
    window.win32Affair.receive('fromMain', (data) => {
        console.log('Received from main:', data);
    });
})
testApiBtnDom.addEventListener('click', async() => {
    const getRes = await window.win32Api.fetchApi('toMainGetApi', {
        url:'https://api.kuleu.com/api/suijimima',
        query:{ ss_cd: 8 },
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

