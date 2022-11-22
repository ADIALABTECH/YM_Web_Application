export const showPage = () => {
    var loader = $("div.loader");
    var loader_b = $("div.load_background");
    loader.css("display","none");
    loader_b.css("display","none");
};

export const loadPage = () => {
    var loader = $("div.loader");
    var loader_b = $("div.load_background");
    loader.css("display","block");
    loader_b.css("display","block");
};




