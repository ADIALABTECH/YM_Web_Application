
import * as API from "../api.mjs";
import * as WS_API from "../websocketServer.mjs";
import * as LOADING from "./loading.mjs";
import * as HightChart from "../highcharts.mjs";
import * as COMMON from "../common.mjs";

window.onload = () => {
    WS_API.ws_coonnect_live_inspector(); //실시간 모니터링 코드01
    WS_API.ws_coonnect_live_inspector_img(); //실시간 모니터링 코드02
    img_direction_icon_append();
    WS_API.ws_connect_change_thk();
    LOADING.showPage();
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
export const live_img_renewal = (m_len, m_calc_thk, m_year, m_nm) => {
    let cam = document.querySelector(".img_section").querySelectorAll("img");
    //모델명, 두께1-2, 길이, light curtain 받아옴
    let model_nm = document.querySelector("#result_name");
    let model_len = document.querySelector("#result_len");
    let model_thc01 = document.querySelector("#result_thc01");
    let model_date = document.querySelector("#result_year");
    model_nm.innerText="측정중인 Model 이름 : " + m_nm;
    model_len.innerText="측정중인 Model 길이 : " + m_len + "(m)";
    model_thc01.innerText="측정중인 Model 두께 : " + m_calc_thk + "(mm)";
    model_date.innerText="측정시간 : " + m_year;
}

//Live Camera정보 실시간 렌더링(이름, 길이, 두께1, 두께2, light curtain, 사진01, 사진02)
export const live_img_render = (cam01_path, cam02_path) => {
    let cam = document.querySelector(".img_section").querySelectorAll("img");
    cam[0].src = "\\" + cam01_path;
    cam[1].src = "\\" + cam02_path;
}

