
//import * as API from "../api.mjs";
import * as WS_API from "../websocketServer.mjs";

window.onload = () => {
    WS_API.ws_connect_test(); //실시간 모니터링 코드
    img_direction_icon_append();
}

//Live Camera Section 양옆 direction 방향 생성
export const img_direction_icon_append = () => {
    let img_d_section = document.querySelectorAll(".img_direction");

    img_d_section.forEach((section_arr => {
        let obj_height = section_arr.offsetHeight;
        let i_c = ((obj_height-50)/50); //35 font size 기준으로 height 추정하여 계산함

        for(var i =0; i < i_c; i++){
            let v_icon = document.createElement("i");
            v_icon.className = "bi bi-caret-up-fill";
            v_icon.style.fontSize = "35px";
            section_arr.append(v_icon);
        }
    })) ;
}

//Live Camera정보 실시간 렌더링(이름, 길이, 두께1, 두께2, light curtain, 사진01, 사진02)
export const live_img_renewal = (cam01_path, cam02_path, m_len, m_thc01, m_thc02, m_lc) => {
    let cam = document.querySelector(".img_section").querySelectorAll("img");
    //모델명, 두께1-2, 길이, light curtain 받아옴
    let model_nm = document.querySelector("#result_name");
    let model_len = document.querySelector("#result_len");
    let model_thc01 = document.querySelector("#result_thc01");
    let model_thc02 = document.querySelector("#result_thc02");
    let model_lc = document.querySelector("#result_lc");
    cam[0].src = cam01_path;
    cam[1].src = cam02_path;
    model_nm.innerText="Model_name : " + "N/A";
    model_len.innerText="Model_length : " + m_len;
    model_thc01.innerText="Model_thick01 : " + m_thc01;
    model_thc02.innerText="Model_thick02 : " + m_thc02;
    model_lc.innerText="Model_LC : " + m_lc;
}


// 2022-09-26 일자로 코드 임시 이전
/* <script type="text/javascript">
$(document).ready(function() {
    const source = new EventSource("/Detect")
    source.onmessage = function(event) {
        const data = JSON.parse(event.data)

        document.getElementById("message").textContent = data.test_message
        document.getElementById("result_img").src="/static/image/" + data.test_img + ".png"
        document.getElementById("result_name").textContent = "Test Model : " + data.test_model_name
        document.getElementById("result_len").textContent = "Test Length : " + data.test_len_str + " ~ " + data.test_len_end + "m"

        if(window.chartObj!=undefined){
            window.chartObj.destroy()
        }
        window.chartObj = new Chart(document.getElementById("thickness_chart"),{
            type: 'line',
            data: {
                labels: data.test_graph.test_thick_len,
                datasets: [{
                    label: "두께",
                    borderColor: 'rgba(0, 0, 0, 0.5)',
                    data: data.test_graph.test_thick,
                    pointBackgroundColor: data.test_color,
                    pointBorderWidth: 2,
                    pointBorderColor: data.test_color,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    fill: false,
                }, {
                    borderColor: 'rgba(31, 224, 208, 0.17)',
                    backgroundColor: 'rgba(31, 224, 208, 0.17)',
                    data: [40,40,40,40,40,40,40,40,40,40,40],
                    radius: 0,
                    fill: '+1',
                }, {
                    borderColor: 'rgba(31, 224, 208, 0.17)',
                    data: [30,30,30,30,30,30,30,30,30,30,30],
                    radius: 0,
                    fill: false,
                }]
            },
            options: {
                responsive: false,

                scales: {
                    y: {
                        suggestedMin: 10,
                        suggestedMax: 60
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: data.test_len_str + ' ~ ' + data.test_len_end + 'm 두께 테스트 데이터',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: false
                    },
                }
            }
        });
    }
});
</script> */
