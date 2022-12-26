
import * as API from "../api.mjs";
import * as WS_API from "../websocketServer.mjs";
import * as LOADING from "./loading.mjs";

window.onload = () => {
    LOADING.showPage();
    WS_API.ws_connect_change_model();

    API.ReloadInsert().then((res) => {
        //console.log(res);
        ReloadModelTable(res);
    });

    setTimeout(() => {
        window.location.reload()
    },300000);

    document.querySelector("#btn_save").addEventListener("click", SaveCheck);
    document.querySelector("#btn_save02").addEventListener("click", SaveMedium);
    document.querySelector("#btn_new").addEventListener("click", NewMIndex);
    document.querySelector("#btn_clear").addEventListener("click", ClearModel);
    document.querySelector("#btn_delete").addEventListener("click", DeleteModel);
}




//==========================================================================================================================
//새로운 모델 또는 통판 입력시 다음의 FLOW를 따른다.
//1. 순번 생성
//2-1. 이름 입력 - 생성 Btn Click => 모델 입력
//2-2. 통판 생성 Btn Click => 통판 입력

//새로운 순번 생성
function NewMIndex(event) {
        event.preventDefault();
        API.NewModelIndex().then((data => {
            document.querySelector('#input_id').value = "";
            document.querySelector('#input_model').value = "";
            document.querySelector('#input_number').value = "";
            document.querySelector('#input_number').value = data.check_data;
            //if 목록이 있다면 목록 선택 옵션 초기화
            selectModelInit();

        }));
}

//모델 입력 초기화
function ClearModel(evnet) {
    evnet.preventDefault();
    if (confirm("정말 오늘자 입력하신 작업모델을 모두 삭제하시겠습니까?\n*진행중이거나 검사가 완료된 항목은 지워지지 않습니다.") == true){    //확인
        API.ClearTodayModel().then((res) => {
            if(res === 200) {
                alert("오늘자 검사되지 않은 입력모델이 모두 삭제되었습니다.");
                location.reload();
            }
        })
        
    }else{   //취소
        return false;
    }
    
}

//선택한 모델 삭제
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
                //console.log(res);
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

//검사할 모델 생성
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

//검사시료 중간의 통판 생성
function SaveMedium(event) {
    event.preventDefault();
    if ( document.querySelector('#input_number').value === "" ){
        alert("데이터(순번)를 입력하세요.");
        return false;
    }
    else {
        let form = document.querySelector('#form_insert');
        let m_num = form.value_number.value;
        let m_name = form.value_model.value;
        let origin_m_num = form.value_id.value;
        API.model_save("Mediator", m_num, origin_m_num).then((res) => {
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


//검사목록 리스트 재갱신
export const ReloadModelTable = (data) => {
    let table_body = document.querySelector("#model_table").querySelector("tbody");
    table_body.querySelectorAll("tr").forEach(row =>{ row.remove(); })
    data.forEach(arr => {
        var btn_state = "";
        var able="";
        if(arr["state"] === '대기'){
            btn_state = "btn btn-default as_btn";
        }
        else if(arr["state"] === '진행중'){
            btn_state = "btn btn-default ads_btn pc_work";
            able = "disabled";
        }
        else if(arr["state"] === '완료'){
            btn_state = "btn btn-default ads_btn end_work";
            able = "disabled";
        }
        let tr = document.createElement("tr");
        tr.innerHTML = `<td style='display:none'>${arr["id"]}</td>` + 
                        `<td scope='row' style='width: 10%'>${arr["number"]}</td>` + 
                        `<td style='width: 40%'>${arr["model"]}</td>` + 
                        `<td style='width: 15%'>${arr["start_insp_time"]}</td>` + 
                        `<td style='width: 15%'>${arr["end_insp_time"]}</td>` + 
                        `<td style='width: 10%'><button class='${btn_state}' ${able} >${arr["state"]}</button></td>`;
        table_body.append(tr);
        
    });
    var s_btn = document.querySelectorAll(".as_btn");
    s_btn.forEach(btn => {
        btn.addEventListener("click", (e) => {
            selectModelInit();
            let tr_ch = e.target.parentNode.parentNode.querySelectorAll("td");
            //console.log(tr_ch[0].innerHTML, tr_ch[1].innerHTML, tr_ch[2].innerHTML);
            document.querySelector('#input_id').value = tr_ch[0].innerHTML;
            document.querySelector('#input_number').value = tr_ch[1].innerHTML;
            document.querySelector('#input_model').value = tr_ch[2].innerHTML;
            btn.parentNode.parentNode.style.backgroundColor = "#FFBF00";
        });
    })
    
}
//다음의 상황에서 사용됨
// 1. 입력 모델을 선택할 경우 전체리스트를 한번 초기화 시킴
function selectModelInit(){
    try {
        var btn = document.querySelector(".as_btn");
        let list = btn.parentNode.parentNode.parentNode.querySelectorAll("tr");
        list.forEach(list_b => { list_b.style.backgroundColor = "transparent";})
    }
    catch (err) {
        //nothing
    }
}





   