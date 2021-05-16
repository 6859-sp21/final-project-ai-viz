$(window).scroll(function (event) {
    let scroll = $(window).scrollTop();
    if (scroll > window.innerHeight * 0.3 && scroll < window.innerHeight * 0.4) {
        document.getElementById("title").style.height = "80px";
        document.getElementById("title").style.position = "fixed";
        document.getElementById("title").style.left = "6vh";
        document.getElementById("title").style.top = "5vh";
    }
    if (scroll < window.innerHeight * 0.1) {
        document.getElementById("title").style.height = "340px";
        document.getElementById("title").style.position = "relative";
        document.getElementById("title").style.left = 0;
        document.getElementById("title").style.top = 0;
    }
});

$(window).resize(function () {
    CallViolin();
    lexiconbubble();
});
