function lexiconbubble() {
    d3.json("./processeddata/VAD.json").then(function (data) {

        let width = window.innerWidth - 0.3 * window.innerHeight,
            height = window.innerHeight * 0.7,
            margin = 10,
            datacap = Math.floor((Object.keys(data).length) / 1000) - 1,
            increment = 0.05;

        d3.select(".lexiconsvg").remove();

        let svg = d3.select("#lexicon")
            .append("svg")
            .attr("class", "lexiconsvg")
            .attr("width", width)
            .attr("height", height)

        let lexicons = [],
            vcount = {},
            acount = {},
            dcount = {};

        for (let i = 0; i < 1 / increment; i++) {
            vcount[i] = 0.1;
            acount[i] = 0.1;
            dcount[i] = 0.1;
        }

        let shortenedArray = getRandom(Object.keys(data), 1000);

        shortenedArray.forEach(function (d, i) {

            vcount[Math.floor(data[d].Valence / increment)] = Math.floor((vcount[Math.floor(data[d].Valence / increment)] + vcount[Math.floor(data[d].Valence / increment)] / Math.abs(vcount[Math.floor(data[d].Valence / increment)])) * -1);

            acount[Math.floor(data[d].Arousal / increment)] = Math.floor((acount[Math.floor(data[d].Arousal / increment)] + acount[Math.floor(data[d].Arousal / increment)] / Math.abs(acount[Math.floor(data[d].Arousal / increment)])) * -1);

            dcount[Math.floor(data[d].Dominance / increment)] = Math.floor((dcount[Math.floor(data[d].Dominance / increment)] + dcount[Math.floor(data[d].Dominance / increment)] / Math.abs(dcount[Math.floor(data[d].Dominance / increment)])) * -1);

            lexicons.push({
                word: d,
                valence: data[d].Valence,
                arousal: data[d].Arousal,
                dominance: data[d].Dominance,
                vcount: vcount[Math.floor(data[d].Valence / increment)],
                acount: acount[Math.floor(data[d].Arousal / increment)],
                dcount: dcount[Math.floor(data[d].Dominance / increment)]
            })
        });

        let Totalextent = [],
            yMax;

        Totalextent.push(d3.max(Object.keys(vcount), function (d) {
            return Math.abs(vcount[d]);
        }));
        Totalextent.push(d3.max(Object.keys(acount), function (d) {
            return Math.abs(acount[d]);
        }));
        Totalextent.push(d3.max(Object.keys(dcount), function (d) {
            return Math.abs(dcount[d]);
        }));
        yMax = d3.max(Totalextent);

        let x = d3.scaleLinear()
            .domain([0, 1])
            .range([10, width - 10]);

        let y = d3.scaleLinear()
            .domain([yMax * -1, yMax])
            .range([margin * 2, height - margin / 2]);

        let wordLength = d3.scaleLinear()
            .domain(d3.extent(lexicons, function (d) {
                return d.word.length;
            }))
            .range([2, 8])

        let selectedcategory = "valence";

        let CatColors = [
            d3.interpolateLab("#ffa1a5", "#a3ffba"),
            d3.interpolateLab("white", "#ffc359"),
            d3.interpolateLab("white", "#ffa1a5")
        ];

        svg.append("line").attr("x1", 10).attr("x2", width - 10).attr("y1", y(0)).attr("y2", y(0)).style("stroke", "#b0aeb1").style("stroke-width", 1)

        let node = svg.selectAll(".lexiconcircle")
            .data(lexicons)
            .enter()
            .append("circle")
            .attr("class", "lexiconcircle")
            .attr("r", function (d) {
                return wordLength(d.word.length);
            })
            .attr("cx", function (d) {
                return x(d[selectedcategory]);
            })
            .attr("cy", height / 2)
            .style("fill", function (d) {
                return CatColors[0](d[selectedcategory]);
            })
            .style("stroke", "#efeff1")
            .style("stroke-width", 1)
            .on("mouseover", function (event, d) {
                let background = svg.append("rect")
                    .attr("class", "lextooltip")
                    .attr("rx", 10)
                    .attr("ry", 10)
                    .style("fill", "#579ee4")
                svg.append("text")
                    .attr("x", this.cx.baseVal.value)
                    .attr("y", this.cy.baseVal.value - 50)
                    .attr("class", "lextooltip lextooltip1")
                    .text(d.word)
                    .style("text-anchor", "middle")
                    .style("font-size", 36)
                    .style("font-weight", 700)
                    .style("fill", "white")
                svg.append("text")
                    .attr("x", this.cx.baseVal.value)
                    .attr("y", this.cy.baseVal.value - 30)
                    .attr("class", "lextooltip lextooltip2")
                    .text(selectedcategory + ": " + d[selectedcategory].toFixed(3))
                    .style("text-anchor", "middle")
                    .style("fill", "white")

                let text1 = document.getElementsByClassName("lextooltip1")[0].getBBox().width;
                let text2 = document.getElementsByClassName("lextooltip1")[0].getBBox().width;

                let textwidth = d3.max([text1, text2]);

                background
                    .attr("x", this.cx.baseVal.value - textwidth / 2 - 15)
                    .attr("y", this.cy.baseVal.value - 85)
                    .attr("width", textwidth + 30)
                    .attr("height", 67)
            })
            .on("mouseout", function (d) {
                d3.selectAll(".lextooltip").remove();
            })

        d3.selectAll(".lexiconcircle")
            .transition()
            .duration(300)
            .attr("cy", function (d) {
                return y(d.vcount);
            })

        d3.select("#lexiconvalence")
            .on("click", function () {
                selectedcategory = "valence";
                d3.selectAll(".lexiconcircle")
                    .data(lexicons)
                    .transition()
                    .duration(300)
                    .attr("cx", function (d) {
                        return x(d.valence);
                    })
                    .style("fill", function (d) {
                        return CatColors[0](d[selectedcategory]);
                    })
            })

        d3.select("#lexicondominance")
            .on("click", function () {
                selectedcategory = "dominance";
                d3.selectAll(".lexiconcircle")
                    .data(lexicons)
                    .transition()
                    .duration(300)
                    .attr("cx", function (d) {
                        return x(d.dominance);
                    })
                    .style("fill", function (d) {
                        return CatColors[2](d[selectedcategory]);
                    })
            })

        d3.select("#lexiconarousal")
            .on("click", function () {
                selectedcategory = "arousal";
                d3.selectAll(".lexiconcircle")
                    .data(lexicons)
                    .transition()
                    .duration(300)
                    .attr("cx", function (d) {
                        return x(d.arousal);
                    })
                    .style("fill", function (d) {
                        return CatColors[1](d[selectedcategory]);
                    })
            })
    })
};

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

lexiconbubble();
