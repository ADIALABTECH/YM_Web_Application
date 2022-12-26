import * as API from "../api.mjs";
import * as LOADING from "./loading.mjs";
//import * as WS_API from "../websocketServer.mjs";
let search_id = 1;
let search_page = 1;
let search_total_page = 0;
let search_arr = {};
let search_pum = 1500;
let total_cnt = 0;
let total_ng = 0;
let ng_percent = "N/A %";

window.onload = () => {
    LOADING.showPage();
    let today = new Date();   
    let input_list = document.querySelector("#search_control").querySelectorAll('input');
    input_list[1].value = today.toLocaleDateString().replace(/\./gi,"-").replace(/ /gi,"").substring(0, 10);
    input_list[2].value = today.toLocaleDateString().replace(/\./gi,"-").replace(/ /gi,"").substring(0, 10);
    AddEventInster();
}


//==========================================================================================================================

function AddEventInster(){
    document.querySelector("#btn_search").addEventListener("click", dataSearch);
    document.querySelector('#search_next').addEventListener('click',dataSearch);
    document.querySelector('#search_prev').addEventListener('click',dataSearch);
}


function dataSearch(event) {
    total_cnt = 0;
    total_ng = 0;
    ng_percent = "N/A %";
    LOADING.loadPage();
    document.querySelector('#search_next').style.visibility = 'visible';
    document.querySelector('#search_prev').style.visibility = 'visible';
    event.preventDefault();
    if(event.target.id === "search_next") {
        let input_list = document.querySelector("#search_control").querySelectorAll('input');
        
        API.SearchHistory(input_list[0].value, input_list[1].value, input_list[2].value, input_list[3].value, input_list[4].value, search_id, 1).then((res) =>{
            if(Object.keys(res.content).length == 0){
                //nothing
            }
            else{
                alert("검색되었습니다.");
                search_arr = res;
                display_search_history(res);
                LOADING.showPage();
            }
            
        });
        
    }
    else if(event.target.id === "search_prev"){
        let input_list = document.querySelector("#search_control").querySelectorAll('input');
        API.SearchHistory(input_list[0].value, input_list[1].value, input_list[2].value, input_list[3].value, input_list[4].value, search_id, -1).then((res) =>{
            if(Object.keys(res.content).length == 0){
                //nothing
            }
            else{
                alert("검색되었습니다.");
                search_arr = res;
                display_search_history(res);
                LOADING.showPage();
            }
        });
    }
    else{
        let input_list = document.querySelector("#search_control").querySelectorAll('input');
        API.SearchHistory(input_list[0].value, input_list[1].value, input_list[2].value, input_list[3].value, input_list[4].value, search_id, 1).then((res) =>{
            var ng_value = res.data;
            total_cnt = ng_value.total_data_cnt;
            total_ng = ng_value.ng_data_cnt;
            ng_percent = (((ng_value.ng_data_cnt/ng_value.total_data_cnt)*100).toFixed(2)).toString() + "%";
            document.querySelector('#summary_surface01').innerHTML =`총 검사 갯수 : ${total_cnt} 건`;
            document.querySelector('#summary_surface02').innerHTML =`표면 불량 : ${total_ng} 건`;
            document.querySelector('#summary_surface_t').innerHTML = ng_percent;
            //csv 파일 생성
            API.save_to_csv(input_list[0].value, input_list[1].value, input_list[2].value, input_list[3].value, input_list[4].value, total_cnt, total_ng, ng_percent);
            if(Object.keys(res.content).length == 0){
                //nothing
            }
            else{
                alert("검색되었습니다.");
                search_arr = res;
                display_search_history(res);
                LOADING.showPage();
            }
        });
    }

}


function display_search_history(res_data){
    let tb = document.querySelector("#history_table");
    let data_tb = document.querySelectorAll('.row_data');
    let pagenate = document.querySelector(".pagenate");
    let pagenum = document.querySelector(".pagenate").querySelectorAll('a');
    let table = document.querySelector(".table");
    let s_next_btn = document.querySelector('#search_next');
    let s_prev_btn = document.querySelector('#search_prev');

    init_pagenate_row(pagenum);
    init_table_row(data_tb);

    //최초 1페이지 랜딩 및 table row 당 addevent listener
    create_table_row(search_arr.content[1], table);
    //pagenate 생성 및 addevent listener
    create_pagenate(pagenate, Object.keys(search_arr.content).length, table);
    //페이지 이동 버튼
    // s_prev_btn.innerHTML=` 이전검색`;
    // s_next_btn.innerHTML=` 다음검색(${(search_page)*search_pum} ~ ${(search_page+1)*search_pum})`;
}


//====================================================================================================================================
const init_table_row = (table_data) => {
    table_data.forEach((data => { data.remove(); }));
}

const init_pagenate_row = (pagenate_data) => {
    pagenate_data.forEach((data => { data.remove(); }));
}

const create_table_row = (row_data, table) => {
    //row data = Object.keys(search_arr.content[n]);
    //table = document 상 테이블
    row_data.forEach((row)=> {
        let table_tr = document.createElement('tr');
        table_tr.className = 'row_data';
        table_tr.innerHTML = `<td>${row.idx}</td>` +
                            `<td>${row.model_nm}</td>` +
                            `<td>${row.calc_thick}</td>` +
                            `<td>${row.lange}</td>` +
                            `<td>${row.cam01_ng}</td>` +
                            `<td>${row.cam02_ng}</td>` +
                            `<td>${row.date}</td>`;

        table_tr.addEventListener('click', (e)=>{
            //click event init
            let data_tb = document.querySelectorAll('.row_data');
            data_tb.forEach((data => {
                data.style.backgroundColor='transparent';
            }))
            let img = document.querySelector(".img_section").querySelectorAll("img");
            img[0].src = row.img01;
            img[1].src = row.img02;
            e.target.parentNode.style.backgroundColor="#FE9A2E";    
        });
        table.appendChild(table_tr);
        search_id = row.idx;
    });

    document.querySelectorAll('.row_data')[0].querySelector('td').click(); 
}

const create_pagenate = (pagenate, arr_len, table) => {
    for(var i = 1; i <= arr_len; i++){
        let pagenum = document.createElement("a");
        pagenum.innerHTML =i;
        
        pagenum.addEventListener('click', (e) => {
            //init
            document.querySelectorAll('.row_data').forEach((data => { data.remove(); }));
            create_table_row(search_arr.content[e.target.innerHTML], table);
            pagenate.querySelectorAll('a').forEach((p => {
                p.style.backgroundColor = "white";
            }));
            e.target.style.backgroundColor= "#FE9A2E";
            e.target.style.color= "#272727";
        });
        pagenate.appendChild(pagenum);
    }
    pagenate.querySelectorAll('a')[0].click();
}






   