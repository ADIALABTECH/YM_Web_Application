import * as Render_insert from "../js/compoments/insert.mjs";
import * as Render_main from "../js/compoments/main.mjs";
import * as Render_history from "../js/compoments/history.mjs";
import * as API from "../js/api.mjs";
import * as HightChart from "../js/highcharts.mjs";
const ip = "ws://192.168.0.106:5535";
var limit_img_error_count = 0;

export const ws_connect_change_thk = (ws_path) => {
    // 웹 서버를 접속한다.
   var webSocket = new WebSocket(`${ip}/live_thick`);
   // 웹 서버와의 통신을 주고 받은 결과를 출력할 오브젝트를 가져옵니다.
   //var messageTextArea = document.getElementById("messageTextArea");
   // 소켓 접속이 되면 호출되는 함수
   webSocket.onopen = function(message){
       console.log("Connect live thk");
   };
   // 소켓 접속이 끝나면 호출되는 함수
   webSocket.onclose = function(message){
       console.log("DisConnect : "+ message.data );
   };
   // 소켓 통신 중에 에러가 발생되면 호출되는 함수
   webSocket.onerror = function(message){
   messageTextArea.value += "error...\n";
   };
   // 소켓 서버로 부터 메시지가 오면 호출되는 함수.
   webSocket.onmessage = function(message){
   // 출력 area에 메시지를 표시한다.
       //console.log(JSON.parse(message.data).change_state);
       let res = JSON.parse(message.data);
    //    console.log(res);
        res.forEach((value, index) => {
            value[1] = parseFloat(value[1]);
        });
        res.forEach((value, index) => {
            var t = new Date(value[0]);
            value[0] = t.getTime();
                });
        //console.log(res);
        HightChart.show_graph(res);
   };
   function disconnect(){
   webSocket.close();
   }
}

export const ws_connect_change_model = (ws_path) => {
    // 웹 서버를 접속한다.
   var webSocket = new WebSocket(`${ip}/InputMetaData`);
   // 웹 서버와의 통신을 주고 받은 결과를 출력할 오브젝트를 가져옵니다.
   //var messageTextArea = document.getElementById("messageTextArea");
   // 소켓 접속이 되면 호출되는 함수
   webSocket.onopen = function(message){
       console.log("Connect");
   };
   // 소켓 접속이 끝나면 호출되는 함수
   webSocket.onclose = function(message){
       console.log("DisConnect : "+ message.data );
   };
   // 소켓 통신 중에 에러가 발생되면 호출되는 함수
   webSocket.onerror = function(message){
   messageTextArea.value += "error...\n";
   };
   // 소켓 서버로 부터 메시지가 오면 호출되는 함수.
   webSocket.onmessage = function(message){
   // 출력 area에 메시지를 표시한다.
       //console.log(JSON.parse(message.data).change_state);
       if(JSON.parse(message.data).change_state == "change_on") {
            alert("모델이 변경되었습니다.")
            window.location.reload();
       }
   };
   function disconnect(){
   webSocket.close();
   }
}

//###라이브 검사 정보 갱신
export const ws_coonnect_live_inspector = (ws_path) => {
    // 웹 서버를 접속한다.
   var webSocket = new WebSocket(`${ip}/live_img_data`);
   //var webSocket = new WebSocket("ws://127.0.0.1:5535/live_img");
   // 웹 서버와의 통신을 주고 받은 결과를 출력할 오브젝트를 가져옵니다.
   //var messageTextArea = document.getElementById("messageTextArea");
   // 소켓 접속이 되면 호출되는 함수
   webSocket.onopen = function(message){
       console.log("Connect - live_img_data");
   };
   // 소켓 접속이 끝나면 호출되는 함수
   webSocket.onclose = function(message){
       console.log("DisConnect - live_img_data");
   };
   // 소켓 통신 중에 에러가 발생되면 호출되는 함수
   webSocket.onerror = function(message){
   messageTextArea.value += "error...\n";
   };
   // 소켓 서버로 부터 메시지가 오면 호출되는 함수.
   webSocket.onmessage = function(message){
   // 출력 area에 메시지를 표시한다.
        //console.log(message.data);
        //let data = JSON.parse(message.data);
        //console.log(data02);
        //let data = message.data;
        let data = JSON.parse(message.data);
        Render_main.live_img_renewal(data.lange , data.calc_thick, data.datetime, data.model_name);
   }
   function disconnect(){
   webSocket.close();
   }
}

//###라이브 이미지 갱신
export const ws_coonnect_live_inspector_img = (ws_path) => {
    // 웹 서버를 접속한다.
    var error_limit_count = 0;
   var webSocket = new WebSocket(`${ip}/live_img`);
   //var webSocket = new WebSocket("ws://127.0.0.1:5535/live_img");
   // 웹 서버와의 통신을 주고 받은 결과를 출력할 오브젝트를 가져옵니다.
   //var messageTextArea = document.getElementById("messageTextArea");
   // 소켓 접속이 되면 호출되는 함수
   webSocket.onopen = function(message){
       console.log("Connect - live_img");
   };
   // 소켓 접속이 끝나면 호출되는 함수
   webSocket.onclose = function(message){
       console.log("DisConnect - live_img");
   };
   // 소켓 통신 중에 에러가 발생되면 호출되는 함수
   webSocket.onerror = function(message){
   messageTextArea.value += "error...\n";
   };
   // 소켓 서버로 부터 메시지가 오면 호출되는 함수.
   webSocket.onmessage = function(message){
   // 출력 area에 메시지를 표시한다.
        //console.log(message.data);
        //let data = JSON.parse(message.data);
        //console.log(data02);
        //let data = message.data;
        let data = JSON.parse(message.data);
        //console.log(data);
        Render_main.live_img_render(data.cam01_img, data.cam02_img);

        let cam = document.querySelector(".img_section").querySelectorAll("img");
        cam[0].addEventListener('error', ()=> { 
            limit_img_error_count+=1;
            if(limit_img_error_count > 50) {
                webSocket.close();
                //location.reload();
            }
        });
        cam[1].addEventListener('error', ()=> { 
            limit_img_error_count+=1;
            if(limit_img_error_count > 50) {
                webSocket.close();
                //location.reload();
            }
        });
   }
   function disconnect(){
   webSocket.close();
   }
}