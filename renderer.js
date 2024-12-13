const baseUrl = 'https://192.168.2.14/backend-api'


document.getElementById('btn-request').addEventListener('click', async () => {
    console.log(123);
    // const res = await window.electronAPI.request(`https://192.168.2.14/backend-api/api/getRobotList`)
    const res = await window.electronAPI.request(`https://api.kuleu.com/api/suijimima`)
    console.log(res);
    if (res) {
        const element = document.getElementById("jiekou")
        
        element.innerText = res.data.password_box[0]
    }

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

