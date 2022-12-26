select_css();

//when after brower & html file render run
window.addEventListener('DOMContentLoaded', active_select_menu);
    

function active_select_menu() {
    var h_list = document.querySelector("#header_nav").querySelectorAll("li");
    var now_location = location.href;
    var nl =now_location.split("/");
    if(nl[nl.length-1]==="") {
        h_list.forEach(li => {
            li.classList.remove("active");
        });
        h_list[0].classList.add("active");
    }
    if(nl[nl.length-1]==="history") {
        h_list.forEach(li => {
            li.classList.remove("active");
        });
        h_list[1].classList.add("active");
    }
    if(nl[nl.length-1]==="insert") {
        h_list.forEach(li => {
            li.classList.remove("active");
        });
        h_list[2].classList.add("active");
    }
}

function select_css () {
    let per_page_css = document.querySelector("#changeStyle");
    let now = location.href;
    let now_2 = now.split("/");
    let now_3 = now_2[now_2.length-1];
    if(now_3 === "") { now_3 = "main";} //insert 메뉴
    if(now_3 === "new" || now_3 === "save") { now_3 = "insert";} //insert 메뉴
    per_page_css.href=(`../static/css/${now_3}_style.css`);
}
