const baseUrl = 'https://192.168.2.14/backend-api'
const ipReg = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])){3}$/
const checkResult = document.getElementById('checkResult')
const ipDom = document.getElementById('ipInput')
const testBtnDom = document.getElementById('request-test')
const testMsg = document.getElementById('test-msg')

testBtnDom.addEventListener('click', async () => {
    const res = await window.electronAPI.request(`https://api.kuleu.com/api/suijimima`)
    console.log(res);
    testMsg.innerText = res.data.password_box[0]
})
document.getElementById('btn-request').addEventListener('click', async () => {
    if (!ipReg.test(ipDom.value)) {
        checkResult.innerText = 'ip格式不正确'
    }else{
        checkResult.innerText = ''
    }
    // const res = await window.electronAPI.request(`https://192.168.2.14/backend-api/api/getRobotList`)
    // const Paylod = {
    //     method: "POST",
    //     body: JSON.stringify({ page: 1, count: 20, robotId: 1 }),
    //     headers: { 'Content-Type': 'application/json' }
    // }
    // const res1 = await window.electronAPI.request(`https://192.168.2.14/backend-api/api/getAlarmAlert`, Paylod)
    // console.log(res1);
    // if (res1) {
    //     const element = document.getElementById("jiekou")
    //     element.innerText = text
    // }
});

