import * as Render_insert from "../js/compoments/insert.mjs";
import * as Render_main from "../js/compoments/main.mjs";
import * as API from "../js/api.mjs";

export const ws_connect = () => {
    // 웹 서버를 접속한다.
   var webSocket = new WebSocket("ws://127.0.0.1:5535");
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
       console.log(message.data);
       API.ReloadInsert().then((res) => {
        Render_insert.ReloadModelTable(res);
    })
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

//###라이브 이미지 갱신
export const ws_connect_test = () => {
    // 웹 서버를 접속한다.
   var webSocket = new WebSocket("ws://127.0.0.1:5535/live_img");
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
        let data = message.data;
        let data22 = JSON.parse(data);
        console.log(data22);
        console.log(data22.cam01_path);
        Render_main.live_img_renewal(data22.cam01_path, data22.cam02_path, data22.Info_rpm , data22.Info_thick01, data22.Info_thick02, data22.Info_LC);
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

export const ws_connect_sensor_test = () => {
    // 웹 서버를 접속한다.
   var webSocket = new WebSocket("ws://127.0.0.1:5535/live_sensor");
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