const testMsgDom = document.getElementById('test-msg')

const ipReg = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])){3}$/
const ipDom = document.getElementById('ipInput')
const runShDom = document.getElementById("run-sh")
const modifyHostsDom = document.getElementById("modify-hosts")
const resResultDom = document.getElementById("resResult")
let styleSheet = document.styleSheets[0];
// 去除空行
function removeEmptyLines(str) {
    return str.replace(/^\s*$/gm, '').replace(/\n{2,}/g, '\n');
}
// 重启
runShDom.addEventListener('click', async () => {
    try {
        const res = await window.electronAPI.runCommond(ipDom.value)
        resResultDom.style.display = 'block'
        resResultDom.innerText += removeEmptyLines(res)
    } catch (error) {
        resResultDom.style.display = 'block'
        resResultDom.innerText += removeEmptyLines(`${error}`)
    }

})
// 修改ip
modifyHostsDom.addEventListener('click', async () => {
    try {
        if (!ipReg.test(ipDom.value)) {
            for (let i = 0; i < styleSheet.cssRules.length; i++) {
                let rule = styleSheet.cssRules[i];
                if (rule.selectorText === '#inputWrap::after') {
                    rule.style.content = '"ip格式不正确"'; // 修改 content 属性
                }
            }
        } else {
            const res = await window.electronAPI.modifyFiles(ipDom.value)
            resResultDom.style.display = 'block'
            resResultDom.innerText += removeEmptyLines(res)
            console.log(removeEmptyLines(res))
        }
    } catch (error) {
        resResultDom.style.display = 'block'
        resResultDom.innerText += removeEmptyLines(`${error}`)
        console.log(removeEmptyLines(`${error}`))
    }

});
// 失焦验证ip
ipDom.addEventListener('blur', () => {
    if (ipReg.test(ipDom.value)) {
        for (let i = 0; i < styleSheet.cssRules.length; i++) {
            let rule = styleSheet.cssRules[i];
            if (rule.selectorText === '#inputWrap::after') {
                rule.style.content = '""'; // 修改 content 属性
            }
        }
    }
})
// 获取焦点清空返回信息
ipDom.addEventListener('focus', () => {
    for (let i = 0; i < styleSheet.cssRules.length; i++) {
        let rule = styleSheet.cssRules[i];
        if (rule.selectorText === '#inputWrap::after') {
            rule.style.content = '""'; // 修改 content 属性
        }
    }
    resResultDom.innerText = ''
    resResultDom.style.display = 'none'
})

//接口测试
testBtnDom.addEventListener('click', async () => {
    const res = await window.electronAPI.request(`https://api.kuleu.com/api/suijimima`)
    console.log(res);
    testMsgDom.innerText = res.data.password_box[0]
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
})
