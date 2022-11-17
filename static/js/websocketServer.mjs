import * as Render_insert from "../js/compoments/insert.mjs";
import * as Render_main from "../js/compoments/main.mjs";
import * as Render_history from "../js/compoments/history.mjs";
import * as API from "../js/api.mjs";
//const ip = "ws://192.168.0.96:5535";
//const ip = "ws://192.168.0.96:5570";
const ip = "ws://112.222.59.43:5570";

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
       console.log("DisConnect");
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
            // API.ReloadInsert().then((res) => {
            // Render_insert.ReloadModelTable(res);
            alert("모델이 변경되었습니다.")
            window.location.reload();
       }

   };
   // 서버로 메시지를 전송하는 함수
   function sendMessage(ws_path){
   var message = document.getElementById("textMessage");
   messageTextArea.value += "Send to Server => "+message.value+"\n";
   //웹소켓으로 textMessage객체의 값을 보낸다.
   webSocket.send(message.value);
   //textMessage객체의 값 초기화
   message.value = "";
   }
   function disconnect(){
   webSocket.close();
   }
}

//###라이브 이미지 갱신
export const ws_coonnect_live_inspector = (ws_path) => {
    // 웹 서버를 접속한다.
   var webSocket = new WebSocket(`${ip}/live_img`);
   //var webSocket = new WebSocket("ws://127.0.0.1:5535/live_img");
   // 웹 서버와의 통신을 주고 받은 결과를 출력할 오브젝트를 가져옵니다.
   //var messageTextArea = document.getElementById("messageTextArea");
   // 소켓 접속이 되면 호출되는 함수
   webSocket.onopen = function(message){
       console.log("Connect");
   };
   // 소켓 접속이 끝나면 호출되는 함수
   webSocket.onclose = function(message){
       console.log("DisConnect");
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
        Render_main.live_img_renewal(data.cam01_path, data.cam02_path, data.lange , data.thick01, data.thick02, data.lc, data.model_name);
        if(data.lc === 1)
        {

        }
   };
   // 서버로 메시지를 전송하는 함수
   function sendMessage(){
   var message = document.getElementById("textMessage");
   messageTextArea.value += "Send to Server => "+message.value+"\n";
   //웹소켓으로 textMessage객체의 값을 보낸다.
   webSocket.send(message.value);
   //textMessage객체의 값 초기화
   message.value = "";
   }
   function disconnect(){
   webSocket.close();
   }
}

export const ws_connect_sensor_test = (ws_path) => {
    // 웹 서버를 접속한다.
   var webSocket = new WebSocket("ws://127.0.0.1:5535/live_sensor");
   var webSocket = new WebSocket(`${ip}/live_sensor`);
   // 웹 서버와의 통신을 주고 받은 결과를 출력할 오브젝트를 가져옵니다.
   //var messageTextArea = document.getElementById("messageTextArea");
   // 소켓 접속이 되면 호출되는 함수
   webSocket.onopen = function(message){
       console.log("ws Connect");
   };
   // 소켓 접속이 끝나면 호출되는 함수
   webSocket.onclose = function(message){
       console.log("ws DisConnect");
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
        //let data = message.data;
        //let data22 = JSON.parse(data);
        //console.log(data22);
        //console.log(data22.cam01_path);
        //Render_main.live_img_renewal(data22.cam01_path, data22.cam02_path);
   };
   // 서버로 메시지를 전송하는 함수
   function sendMessage(){
   var message = document.getElementById("textMessage");
   messageTextArea.value += "Send to Server => "+message.value+"\n";
   //웹소켓으로 textMessage객체의 값을 보낸다.
   webSocket.send(message.value);
   //textMessage객체의 값 초기화
   message.value = "";
   }
   function disconnect(){
   webSocket.close();
   }
}

export const ws_connect_sensor_test02 = (ws_path) => {
    // 웹 서버를 접속한다.
   var webSocket = new WebSocket(`ws://127.0.0.1:5535/${ws_path}`);
   // 웹 서버와의 통신을 주고 받은 결과를 출력할 오브젝트를 가져옵니다.
   //var messageTextArea = document.getElementById("messageTextArea");
   // 소켓 접속이 되면 호출되는 함수
   webSocket.onopen = function(message){
       console.log("s_test Connect");
   };
   // 소켓 접속이 끝나면 호출되는 함수
   webSocket.onclose = function(message){
       console.log("s_test DisConnect");
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
        //let data = message.data;
        //let data22 = JSON.parse(data);
        //console.log(data22);
        //console.log(data22.cam01_path);
        //Render_main.live_img_renewal(data22.cam01_path, data22.cam02_path);
   };
   // 서버로 메시지를 전송하는 함수
   function sendMessage(){
   var message = document.getElementById("textMessage");
   messageTextArea.value += "Send to Server => "+message.value+"\n";
   //웹소켓으로 textMessage객체의 값을 보낸다.
   webSocket.send(message.value);
   //textMessage객체의 값 초기화
   message.value = "";
   }
   function disconnect(){
   webSocket.close();
   }
}