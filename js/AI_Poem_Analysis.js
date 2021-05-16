// hard code three categories in
let Cat = ["overall", "valence", "dominance", "arousal"];

function getUserInput(id, htmlid) {
    let userInput = document.getElementById(id).value;
    poemAnalysis(userInput, htmlid);
};

function poemAnalysis(poem, div_id) {

    document.getElementById("capturebutton").style.top = "0px";
    document.getElementById("userinstruction").style.display = "none";
    document.getElementById("useranalysis").style.display = "flex";

    d3.selectAll(".resultstats").remove();
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

        Object.keys(wordlist).forEach(function (d) {
            words.push({
                text: wordlist[d].text,
                value: wordlist[d].value * 50
            });
        });

        words = words.sort(function (x, y) {
            return d3.ascending(y.value, x.value);
        });
        words = words.slice(0, 20);

        console.log(words);

        renderwordcloud(words);

        let viomax = [];

        Cat.forEach(function (category) {
            if (category !== "overall") {
                let tempmax = d3.max(violin, function (d) {
                    return d[category];
                });
                viomax.push(tempmax);
            };
        })

        viomax = d3.max(viomax, function (d) {
            return +d;
        });

        // color interpolations
        let CatColors = [
            d3.interpolateLab("white", "#bf2b26"),
            d3.interpolateLab("#ffa1a5", "#a3ffba"),
            d3.interpolateLab("white", "#ffc359"),
            d3.interpolateLab("white", "#ffa1a5")
        ];

        let LegendColors = [["white", "#bf2b26"], ["#ffa1a5", "#a3ffba"], ["white", "#ffc359"], ["white", "#ffa1a5"]];
        let VADtotal = [V / VADCount, A / VADCount, D / VADCount];

        let overallstat = d3.select("#roverall")
            .append("svg")
            .attr("class", "resultstats")
            .attr("width", 150)
            .attr("height", 80);

        overallstat.append("text")
            .attr("x", 130)
            .attr("y", 42)
            .text((O / VADCount).toFixed(3))
            .style("font-size", 58)
            .style("font-weight", 800)
            .style("text-anchor", "end")
            .style("fill", "#d36764")

        overallstat.append("text")
            .attr("x", 135)
            .attr("y", 42)
            .text(' / 1')
            .style("font-size", 16)
            .style("font-weight", 800)
            .style("text-anchor", "start")
            .style("fill", "#414050")

        overallstat.append("text")
            .attr("x", 75)
            .attr("y", 60)
            .text('overall sentiment')
            .style("font-size", 14)
            .style("text-anchor", "middle")
            .style("fill", "#414050")

        let viowidth = window.innerWidth * 0.4 - 150,
            vio = d3.select("#violinresult")
            .append("svg")
            .attr("class", "resultstats")
            .attr("width", viowidth)
            .attr("height", 403),
            offset = viowidth / 4;

        let vioy = d3.scaleLinear()
            .domain([increment, 1])
            .range([380, 5]);

        let viox = d3.scaleLinear()
            .domain([0, viomax])
            .range([0, offset / 2]);

        vio.append("g")
            .attr("class", "violinscale")
            .call(d3.axisLeft(vioy))
            .attr("transform", "translate(50,0)")

        Cat.forEach(function (category, i) {

            if (category !== "overall") {
                let stats = d3.select("#" + category + "stat")
                    .append("svg")
                    .attr("class", "resultstats")
                    .attr("width", 150)
                    .attr("height", 60);

                let defs = stats.append("defs");

                let gradient = defs.append("linearGradient")
                    .attr("id", "svgGradient" + i)
                    .attr("x1", "0%")
                    .attr("x2", "100%")
                    .attr("y1", "0%")
                    .attr("y2", "0%");

                gradient.append("stop")
                    .attr('class', 'start')
                    .attr("offset", "0%")
                    .attr("stop-color", LegendColors[i][0])
                    .attr("stop-opacity", 1);

                gradient.append("stop")
                    .attr('class', 'end')
                    .attr("offset", "100%")
                    .attr("stop-color", LegendColors[i][1])
                    .attr("stop-opacity", 1);

                stats.append("text")
                    .attr("x", 25 + VADtotal[i - 1] * 100)
                    .attr("y", 13)
                    .text(VADtotal[i - 1].toFixed(3))
                    .style("font-size", 24)
                    .style("alignment-baseline", "hanging")
                    .style("text-anchor", "middle")
                    .style("fill", "#414050")

                stats.append("text")
                    .attr("x", 3)
                    .attr("y", 51)
                    .text(0)
                    .style("font-size", 12)
                    .style("alignment-baseline", "middle")
                    .style("text-anchor", "middle")
                    .style("fill", LegendColors[i - 1][0])
                    .style("filter", "brightness(70%)");

                stats.append("text")
                    .attr("x", 147)
                    .attr("y", 51)
                    .text(1)
                    .style("font-size", 12)
                    .style("alignment-baseline", "middle")
                    .style("text-anchor", "middle")
                    .style("fill", LegendColors[i - 1][1])
                    .style("filter", "brightness(70%)");

                stats.append("line")
                    .attr("x1", 15)
                    .attr("x2", 135)
                    .attr("y1", 50)
                    .attr("y2", 50.001)
                    .style("stroke-width", 6)
                    .style("stroke", "url(#svgGradient" + i + ")");

                stats.append("rect")
                    .attr("x", 24 + VADtotal[i - 1] * 100)
                    .attr("y", 41)
                    .attr("width", 2)
                    .attr("height", 12)
                    .attr("r", 5)
                    .style("fill", "#414050");

                let vioarea = d3.area()
                    .curve(d3.curveBasis)
                    .x0(function (d) {
                        return (i + 0.4) * offset - viox(d[category]) - 1;
                    })
                    .x1(function (d) {
                        return (i + 0.4) * offset + viox(d[category]) + 1;
                    })
                    .y(function (d, i) {
                        return vioy((i + 1) * increment);
                    });

                vio.append("path")
                    .data([violin])
                    .attr("class", "v")
                    .attr("d", vioarea)
                    .style("fill", CatColors[i](VADtotal[i - 1]))
                    .on("mouseover", function (event, d) {
                        d3.select(this).transition().style("filter", "brightness(80%)");
                        vio.append("text")
                            .attr("class", "violintooltip")
                            .attr("y", 50)
                            .text("distribution of")
                        vio.append("text")
                            .attr("class", "violintooltip")
                            .attr("y", 66)
                            .text("words by")
                        vio.append("text")
                            .attr("class", "violintooltip")
                            .attr("y", 82)
                            .text(category + " score")
                        vio.selectAll(".violintooltip")
                            .attr("x", (i + 0.4) * offset)
                            .style("fill", "#414050")
                            .style("text-anchor", "middle")
                    })
                    .on("mouseout", function (event, d) {
                        d3.select(this).transition().style("filter", "brightness(100%)");
                        d3.selectAll(".violintooltip").remove();
                    })

                vio.append("text")
                    .attr("x", (i + 0.4) * offset)
                    .attr("y", vioy(0) + 3)
                    .text(category)
                    .style("text-anchor", "middle")
                    .style("fill", "#b0aeb1")


            };

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
            document.getElementById("user" + category).innerHTML = "<p class='poemtext'>" + labeledpoem + "</p><div class='poemgradient'>" + Capitalize(category) + " Gradient Notation: 0<div style='background: linear-gradient(90deg, " + LegendColors[i][0] + " 0%, " + LegendColors[i][1] + " 100%);'></div>1</div>";



        });

        $(function () {
            $("[data-toggle='tooltip']").tooltip()
        })
    });

    toggleUserOutput(0);
}

function toggleUserOutput(n) {
    Cat.forEach(function (d, i) {
        if (i == n) {
            document.getElementById("user" + Cat[n]).style.width = "calc(27vw - 25px)";
            document.getElementById("user" + Cat[n]).style.overflowX = "visible";
            document.getElementById("toggleUserOutput" + n).className = "toggleUserOutput active";
        } else {
            document.getElementById("user" + Cat[i]).style.width = "0";
            document.getElementById("user" + Cat[i]).style.overflowX = "hidden";
            document.getElementById("toggleUserOutput" + i).className = "toggleUserOutput";
        }
    })
}

function renderwordcloud(wordlist) {

    let layout = d3.layout.cloud()
        .size([window.innerWidth * 0.4, window.innerHeight - window.innerWidth * 0.07 - 560])
        .words(wordlist)
        .padding(30)
        .on("end", draw);

    layout.start();

    function draw(words) {

        let scaleSize = d3.scaleLinear()
            .domain(d3.extent(words, function (d) {
                return d.size;
            }))
            .range([0.1, 1]);

        d3.select("#wordcloudresult")
            .append("svg")
            .attr("class", "resultstats")
            .attr("width", window.innerWidth * 0.4)
            .attr("height", window.innerHeight - window.innerWidth * 0.07 - 560)
            .attr("transform", "translate(0, 10)")
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .text(function (d) {
                return d.text
            })
            .style("font-size", function (d) {
                return scaleSize(d.size) * 100 + "px"
            })
            .style("fill", function (d) {
                return d3.interpolateLab("lightgray", "#bf2b26")(scaleSize(d.size));
            })
            .attr("text-anchor", "middle")
            .attr("transform", (d) => "translate(" + [d.x, d.y] + ")");
    }
}

