function Capitalize(str) {
    let lower = String(str).toLowerCase();
    return lower.replace(/(^| )(\w)/g, function (x) {
        return x.toUpperCase();
    });
}

function takescreenshot() {
    html2canvas(document.querySelector("#capture")).then(canvas => {
        let link = document.createElement('a');
        link.download = 'mypoetry.png';
        link.href = canvas.toDataURL()
        link.click();
    });
}
