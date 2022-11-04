
import * as API from "../api.mjs";
import * as WS_API from "../websocketServer.mjs";

window.onload = () => {
    WS_API.ws_connect();
    
    API.ReloadInsert().then((res) => {
        console.log(res);
        ReloadModelTable(res);
    })
    AddEventInster;
}















//==========================================================================================================================

function AddEventInster(){
    document.querySelector("#btn_save").addEventListener("click", SaveCheck);
    document.querySelector("#btn_new").addEventListener("click", NewMIndex);
    document.querySelector("#btn_clear").addEventListener("click", ClearModel);
    document.querySelector("#btn_delete").addEventListener("click", DeleteModel);
}

function ClearInputSection(result_data) {
    document.querySelector('#input_id').value = "";
    document.querySelector('#input_number').value = "";
    if(result_data !== null){
        document.querySelector('#input_number').value = result_data.check_data;
    }
    else {
        document.querySelector('#input_number').value = "";
    }       
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



   