function getUserInput(id, htmlid) {
    let userInput = document.getElementById(id).value;
    poemAnalysis(userInput, htmlid);
};

function poemAnalysis(poem, div_id) {
    poemarray = poem
        .replace(/\n/g, " ") // replace all line-breaks
        .replace(/[^\w\s]/gi, ' ') // replace all special characters
        .split(" ") 
    
    console.log(poemarray);

    d3.json("processeddata/VAD.json").then(function (sentiment) {

        let sentimentlist = [],
            sentimentwordlist = [];

        let V = 0,
            A = 0,
            D = 0,
            VADCount = 0;

        poemarray.forEach(function (d) {
            d = d.toLowerCase(); // ensures that the json-call matches

            // add the word and relevant metrix to a list of markable wor
            if (sentiment[d] !== undefined) {

                V += sentiment[d].Valence;
                D += sentiment[d].Dominance;
                A += sentiment[d].Arousal;
                VADCount++

                if (sentimentwordlist.includes(d) == false) {
                    sentimentlist.push({
                        word: d,
                        valence: sentiment[d].Valence,
                        dominance: sentiment[d].Dominance,
                        arousal: sentiment[d].Arousal
                    })
                };
            }
            sentimentwordlist.push(d);
        });

        let Cat = ["valence", "dominance", "arousal"];
        let CatColors = [
            d3.interpolateLab("#ffa1a5", "#a3ffba"),
            d3.interpolateLab("#fff2db", "#ffc359"),
            d3.interpolateLab("#ffeea1", "#ffa1a5")
        ];

        Cat.forEach(function (category, i) {

            let labeledpoem = poem;
            let notationcolor = CatColors[i];
            let averagesentiment = 0;

            sentimentlist.forEach(function (d) {

                let wordvariations = [d.word, d.word.toUpperCase(), Capitalize(d.word)];
                let worddata = category + ": " + d[category].toFixed(3);

                wordvariations.forEach(function (word) {
                    let markedword = "<button class='poemmark' style='background-color: " + notationcolor(d[category]) + ";'>" + word + "<span class='tooltiptext' style='background-color: " + notationcolor(d[category]) + ";'>" + worddata + "</span></button>";
                    labeledpoem = labeledpoem.replace(new RegExp(" " + word, "g"), " " + markedword);
                    labeledpoem = labeledpoem.replace(new RegExp(word + " ", "g"), markedword + " ");
                });

            });

            labeledpoem = labeledpoem.replace(/\n/g, "<br>");
            document.getElementById("user" + category).innerHTML = "<p class='poemtext'>" + labeledpoem + "</p>";

        });

        document.getElementById("Testresult").innerHTML = "<p>Overall Valence:" + (V / VADCount).toFixed(3) + "<br>Overall Arousal:" + (A / VADCount).toFixed(3) + "<br>Overall Dominance:" + (D / VADCount).toFixed(3) + "</p>"

        $(function () {
            $("[data-toggle='tooltip']").tooltip()
        })

    });
    
    toggleUserOutput(0);
}

function toggleUserOutput(n){
    let Cat = ["valence", "dominance", "arousal"];
    Cat.forEach(function(d, i){
        if(i == n){
            document.getElementById("user" + Cat[n]).style.width = "50vw";
            document.getElementById("user" + Cat[n]).style.overflow = "visible";
            document.getElementById("toggleUserOutput" + n).className = "toggleUserOutput active";
        } else {
            document.getElementById("user" + Cat[i]).style.width = "0";
            document.getElementById("user" + Cat[i]).style.overflow = "hidden";
            document.getElementById("toggleUserOutput" + i).className = "toggleUserOutput";
        }
    })
}
