// conversion of csv to json
// by charles wu
d3.csv("data/NRC-VAD-Lexicon.csv").then(function (lexicon) {
    let data = {};
    lexicon.forEach(function (d) {
        data[d.Word] = {
            Dominance: +d.Dominance,
            Valence: +d.Valence,
            Arousal: +d.Arousal
        }
    })
    downloadObjectAsJson(data, "VAD")
})

function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
