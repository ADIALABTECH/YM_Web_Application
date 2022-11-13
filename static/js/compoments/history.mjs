import * as API from "../api.mjs";
//import * as WS_API from "../websocketServer.mjs";

window.onload = () => {
    //WS_API.ws_connect();
    
    //API.ReloadInsert().then((res) => {
    //     console.log(res);
    //     ReloadModelTable(res);
    // })
    AddEventInster();
}


//==========================================================================================================================

function AddEventInster(){
    document.querySelector("#btn_search").addEventListener("click", dataSearch);
}

function dataSearch(event) {
    event.preventDefault();
    let input_list = document.querySelector("#search_control").querySelectorAll('input');
    API.SearchHistory(input_list[0].value, input_list[1].value, input_list[2].value, input_list[3].value, input_list[4].value, 0).then((res) =>{
        console.log(res);
        alert("search");
        display_search_history(res);
    });
}

function display_search_history(data){
    let tb = document.querySelector("#history_table");
    let table = document.createElement('table');
    table.className='table';
    let table_text = "<table class='table'>" + "<tr>"
                     "<th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>";                
    console.log(data.content[0]);
    data.content.forEach((row)=> {
        table_text += "<tr><td>" + row.model_nm + "</td>" + 
        "<td>1</td>" +
        "<td>2</td>" +
        "<td>3</td>" +
        "<td>4</td>" +
        "<td>5</td>" +
        "</tr>";
    });
    table_text += "</table>";
    tb.innerHTML = table_text;
}


function ClearModel(evnet) {
    evnet.preventDefault();
    if (confirm("정말 오늘자 입력하신 작업모델을 모두 삭제하시겠습니까?\n*진행중이거나 검사가 완료된 항목은 지워지지 않습니다.") == true){    //확인
        API.ClearTodayModel().then((res) => {
            if(res === 200) {
                alert("오늘자 검사되지 않은 입력모델이 모두 삭제되었습니다.");
                location.reload();
                // API.ReloadInsert().then((res) => {
                //     ReloadModelTable(res);
                // })
            }
        })
        
    }else{   //취소
        return false;
    }
    
}

function DeleteModel(event) {
    event.preventDefault();
    if ( document.querySelector('#input_number').value === "" || document.querySelector('#input_model').value === "" || document.querySelector('#input_id').value === ""){
        alert("삭제할 항목을 선택해주세요");
        return false;
    }
    else{
        if (confirm("선택하신 내용을 지우시겠습니까?") == true) {
            let form = document.querySelector('#form_insert');
            let m_num = form.value_number.value;
            let m_name = form.value_model.value;
            let origin_m_num = form.value_id.value;
    
            API.DeleteModel(m_name, m_num, origin_m_num).then((res) => {
                console.log(res);
                if(res === 200) {
                    alert("삭제되었습니다.");
                    API.ReloadInsert().then((res) => {
                        ReloadModelTable(res);
                        document.querySelector('#input_id').value = "";
                        document.querySelector('#input_number').value = "";
                        document.querySelector('#input_model').value = "";
                    })
                } else {
                    alert("에러발생");
                }
            })
        }
    }
    
}

//==========================================================================================================================

function SaveCheck(event) {
    event.preventDefault();
    if ( document.querySelector('#input_number').value === "" || document.querySelector('#input_model').value === ""){
        alert("데이터(순번, 검사항목)를 입력하세요.");
        return false;
    }
    else {
        let form = document.querySelector('#form_insert');
        let m_num = form.value_number.value;
        let m_name = form.value_model.value;
        let origin_m_num = form.value_id.value;
        API.model_save(m_name, m_num, origin_m_num).then((res) => {
            if(res === 200) {
                //console.log("POST then Testing1")
                API.ReloadInsert().then((res) => {
                    console.log(res);
                    ReloadModelTable(res);
                })
                document.querySelector('#input_id').value = "";
                document.querySelector('#input_number').value = "";
                document.querySelector('#input_model').value = "";
            }
        });
    }
    
};

const ReloadModelTable = (data) => {
    let table_body = document.querySelector("#model_table").querySelector("tbody");
    table_body.querySelectorAll("tr").forEach(row =>{ row.remove(); })
    data.forEach(arr => {
        var btn_state = "";
        var able="";
        if(arr["state"] === '대기'){
            btn_state = "btn btn-default as_btn";
        }
        else if(arr["state"] === '진행중'){
            btn_state = "btn btn-default ads_btn";
            able = "disabled";
        }
        else if(arr["state"] === '완료'){
            btn_state = "btn btn-default ads_btn";
            able = "disabled";
        }
        let tr = document.createElement("tr");
        tr.innerHTML = `<td style='display:none'>${arr["id"]}</td>` + 
                        `<td scope='row' style='width: 10%'>${arr["number"]}</td>` + 
                        `<td style='width: 60%'>${arr["model"]}</td>` + 
                        `<td style='width: 30%'><button class='${btn_state}' ${able} >${arr["state"]}</button></td>`;
        table_body.append(tr);
        
    });
    var s_btn = document.querySelectorAll(".as_btn");
    s_btn.forEach(btn => {
        btn.addEventListener("click", (e) => {
            let tr_ch = e.target.parentNode.parentNode.querySelectorAll("td");
            console.log(tr_ch[0].innerHTML, tr_ch[1].innerHTML, tr_ch[2].innerHTML);
            document.querySelector('#input_id').value = tr_ch[0].innerHTML;
            document.querySelector('#input_number').value = tr_ch[1].innerHTML;
            document.querySelector('#input_model').value = tr_ch[2].innerHTML;
        });
    })
    
}



   