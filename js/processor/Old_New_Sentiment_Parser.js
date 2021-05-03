// by charles wu
d3.csv("data/Old_New.csv").then(function (data) {

    // load pre-trained lexicon for identifying valence, arousal and dominance
    d3.json("processeddata/VAD.json").then(function (sentiment) {

        let exportdata = [];
        let sentimentlist = Object.keys(sentiment);
        let sentimentjointlist = sentimentlist.join(" ");

        data.forEach(function (poem, i) {

            let content = poem.content;
            let author = Capitalize(poem.author);

            let contentarray = content
                .replace(/\n/g, "") // replace all line-breaks
                .replace(/[^\w\s]/gi, '') // replace all special characters
                .replace(/  /g, '') // replace all unnecessary spaces
                .split(" ");

            // console.log(contentarray); // testing if the parsed into array successfully

            // set up empty containers for the 3 aspects of NLP-sentiment
            let V = 0,
                A = 0,
                D = 0,
                VADCount = 0;

            contentarray.forEach(function (d) {
                d = d.toLowerCase(); // ensures that the json-call matches

                if (sentiment[d] !== undefined) {
                    V += sentiment[d].Valence;
                    D += sentiment[d].Dominance;
                    A += sentiment[d].Arousal;
                    VADCount++;
                }
            })

            // write all the necessary data
            exportdata.push({
                author: author,
                title: poem.poemname,
                content: content,
                age: poem.age,
                tag: poem.type,
                length: contentarray.length,
                valence: V / VADCount,
                dominance: D / VADCount,
                arousal: A / VADCount,
                confidence: VADCount / contentarray.length
            })

        })

        downloadObjectAsJson(exportdata, "Old_New_Poem_Sentiment");

    })
})

function Capitalize(str) {
    let lower = String(str).toLowerCase();
    return lower.replace(/(^| )(\w)/g, function (x) {
        return x.toUpperCase();
    });
}

function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
