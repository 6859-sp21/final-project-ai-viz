function poemAnalysis(poemdata) {

    // hard code three categories and their colors
    var Cat = ["overall", "valence", "dominance", "arousal"];
    let LegendColors = [["white", "#bf2b26"], ["#ffa1a5", "#a3ffba"], ["white", "#ffc359"], ["white", "#ffa1a5"]];

    document.getElementById("togglebuttons").style.display = "inline-flex";

    d3.selectAll(".resultstats").remove();
    let poem = poemdata.Poem;
    poemarray = poem.replace(/\n/g, " ") // replace all line-breaks
        .replace(/[^\w\s]/gi, ' ') // replace all special characters
        .split(" ") // split poem into array

    // load sentiment lexicon json
    d3.json("processeddata/VAD.json").then(function (sentiment) {

        let sentimentlist = [],
            sentimentwordlist = [],
            violin = [];

        let V = 0, // valence
            A = 0, // arousal
            D = 0, // dominance
            O = 0, // overall display of sentiment
            VADCount = 0; // total count

        var increment = 0.05;

        for (let i = 0; i < (1 / increment) + 1; i++) {
            violin[i] = {
                valence: 0,
                arousal: 0,
                dominance: 0,
                overall: 0
            }
        }

        let wordlist = {},
            words = [];

        poemarray.forEach(function (d) {
            d = d.toLowerCase(); // ensures that the json-call matches

            if (d !== "") {
                if (wordlist[d] == undefined) {
                    wordlist[d] = {
                        text: d,
                        value: 1
                    }
                } else {
                    wordlist[d].value++;
                };
            };

            // add the word and relevant metrix to a list of markable wor
            if (sentiment[d] !== undefined) {

                if (d !== "") {
                    if (wordlist[d] == undefined) {
                        wordlist[d] = {
                            text: d,
                            value: Math.abs(sentiment[d].Valence - 0.5) * 2 + sentiment[d].Dominance + sentiment[d].Arousal + 1
                        }
                    } else {
                        wordlist[d].value += Math.abs(sentiment[d].Valence - 0.5) * 2 + sentiment[d].Dominance + sentiment[d].Arousal;
                    };
                };

                V += sentiment[d].Valence;
                D += sentiment[d].Dominance;
                A += sentiment[d].Arousal;
                O += (Math.abs(sentiment[d].Valence - 0.5) * 2 + sentiment[d].Dominance + sentiment[d].Arousal) / 3;
                VADCount++

                violin[Math.floor(sentiment[d].Valence / increment)].valence++;
                violin[Math.floor(sentiment[d].Dominance / increment)].arousal++;
                violin[Math.floor(sentiment[d].Arousal / increment)].dominance++;
                violin[Math.floor((Math.abs(sentiment[d].Valence - 0.5) * 2 + sentiment[d].Dominance + sentiment[d].Arousal) / 3)].overall++;

                // check if the dictionary includes current word
                if (sentimentwordlist.includes(d) == false) {
                    sentimentlist.push({
                        word: d,
                        valence: sentiment[d].Valence,
                        dominance: sentiment[d].Dominance,
                        arousal: sentiment[d].Arousal,
                        overall: (Math.abs(sentiment[d].Valence - 0.5) * 2 + sentiment[d].Dominance + sentiment[d].Arousal) / 3
                    })
                };
            }

            // list object list of words and their summary
            sentimentwordlist.push(d);

        });

        // color interpolations
        let CatColors = [
            d3.interpolateLab("white", "#bf2b26"),
            d3.interpolateLab("#ffa1a5", "#a3ffba"),
            d3.interpolateLab("white", "#ffc359"),
            d3.interpolateLab("white", "#ffa1a5")
        ];

        let VADtotal = [V / VADCount, A / VADCount, D / VADCount];

        Cat.forEach(function (category, i) {
            let labeledpoem = poem;
            let notationcolor = CatColors[i];
            let averagesentiment = 0;

            sentimentlist.forEach(function (d) {
                let wordvariations = [d.word, d.word.toUpperCase(), Capitalize(d.word)];
                let worddata = category + ": " + d[category].toFixed(3);

                wordvariations.forEach(function (word) {
                    let replaceword = word.split("");
                    replaceword = replaceword.join("\\");
                    let markedword = "<button class='poemmark' style='background-color: " + notationcolor(d[category]) + ";'>" + replaceword + "<span class='tooltiptext' style='background-color: " + notationcolor(d[category]) + ";'>" + worddata + "</span></button>";
                    labeledpoem = labeledpoem.replace(new RegExp(" " + word, "g"), " " + markedword);
                    labeledpoem = labeledpoem.replace(new RegExp(word + " ", "g"), markedword + " ");
                });
            });

            labeledpoem = labeledpoem.replace(/\n/g, "<br>");
            labeledpoem = labeledpoem.replace(/\\/g, "");
            document.getElementById("user" + category).innerHTML = "<h4 class='poemtitle'>" + poemdata.Title + "</h4><p class='poemauthor'><em>by " + poemdata.Poet + "</em></p><p class='poemtext'>" + labeledpoem + "</p><div class='poemgradient'>" + Capitalize(category) + " Gradient Notation: 0<div style='background: linear-gradient(90deg, " + LegendColors[i][0] + " 0%, " + LegendColors[i][1] + " 100%);'></div>1</div>";


        });

        $(function () {
            $("[data-toggle='tooltip']").tooltip()
        });

    });

    toggleUserOutput(0);
}

function toggleUserOutput(n) {
    let Cat = ["overall", "valence", "dominance", "arousal"];
    Cat.forEach(function (d, i) {
        if (i == n) {
            document.getElementById("user" + Cat[n]).style.width = "30vw";
            document.getElementById("user" + Cat[n]).style.overflowX = "visible";
            document.getElementById("toggleUserOutput" + n).className = "toggleUserOutput active";
        } else {
            document.getElementById("user" + Cat[i]).style.width = "0";
            document.getElementById("user" + Cat[i]).style.overflowX = "hidden";
            document.getElementById("toggleUserOutput" + i).className = "toggleUserOutput";
        }
    })
};
