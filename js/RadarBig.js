function RadarBig(cat) {
    // set the dimensions and margins of the graph
    // 8 x 8

    let margin = 10,
        width = window.innerWidth - document.getElementById('radartype').clientWidth - window.innerHeight * 0.3,
        height = window.innerWidth - document.getElementById('radartype').clientWidth - window.innerHeight * 0.3,
        scaling = width / 2 * 0.8;

    d3.select("#radarzoom").remove();

    let svg = d3.select("#radar_zoom")
        .append("svg")
        .attr("id", "radarzoom")
        .attr("width", width)
        .attr("height", height)
        .append("g")


    d3.json("./processeddata/Category_Sentiment.json").then(function (data) {

        let c = ["Valence", "Dominance", "Arousal"];
        let angles = {
            Valence: [0, Math.cos(Math.PI)],
            Arousal: [Math.sin(Math.PI * 2 / 3), Math.cos(Math.PI * 5 / 3)],
            Dominance: [Math.sin(Math.PI * 4 / 3), Math.cos(Math.PI * 1 / 3)]
        };

        //Create the straight lines radiating outward from the center
        let axisGrid = svg.append("g")
            .attr("class", "axisWrapper");

        let axis = axisGrid.selectAll(".axis")
            .data(c)
            .enter()
            .append("g")
            .attr("class", "axis");

        let category = cat,
            cat_poem = data[category].data;
        let radardata = data[category].metrix;

        //        let cat_poem_trimmed = [];

        if (cat_poem.length > 50) {
            cat_poem = cat_poem.slice(0, 49);
            console.log(cat_poem);
        }

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height * 0.9)
            .attr("class", "bigradarbakground")
            .text(category)
            .style("text-anchor", "middle")
            .style("font-size", 45)
            .style("font-weight", 900)
            .style("fill", "#414050")

        axis.append("circle")
            .attr("class", "bigradarbackground")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", function (d, i) {
                return (4 - i) / 4 * scaling * 0.8;
            })
            .style("stroke", "#414050")
            .style("fill", "transparent")
            .style("stroke-width", 0.5)
            .style("opacity", 0.5)

        //Append the lines
        axis.append("line")
            .attr("class", "bigradarbackground")
            .attr("x1", width / 2)
            .attr("y1", height / 2)
            .attr("x2", function (d) {
                return angles[d][0] * scaling * 0.9 + width / 2;
            })
            .attr("y2", function (d) {
                return angles[d][1] * scaling * 0.9 + height / 2;
            })
            .style("stroke", "#414050")
            .style("stroke-width", 0.5)
            .style("opacity", 0.5)


        axis.append("text")
            .attr("x", function (d) {
                return angles[d][0] * scaling + width / 2;
            })
            .attr("y", function (d) {
                return angles[d][1] * scaling + height / 2;
            })
            .text(function (d) {
                return d;
            })
            .style("font-size", "25px")
            .style("fill", "#414050")
            .style("alignment-baseline", "middle")
            .style("text-anchor", "middle")


        let acum = {
            Valence: [0],
            Arousal: [0],
            Dominance: [0]
        };

        let scaleV = d3.scaleLinear()
            .domain([0.5, 0.59])
            .range([0, 1])

        let scaleA = d3.scaleLinear()
            .domain([0.35, 0.45])
            .range([0, 1])

        let scaleD = d3.scaleLinear()
            .domain([0.40, 0.52])
            .range([0, 1])


        let CatColor = d3.interpolateLab("#d36764", "#414050");

        // Add the area.
        for (let i = 0; i < cat_poem.length; i++) {

            acum.Valence[i + 1] = acum.Valence[i] + Math.abs(scaleV(cat_poem[i].Valence));
            acum.Arousal[i + 1] = acum.Arousal[i] + Math.abs(scaleA(cat_poem[i].Arousal));
            acum.Dominance[i + 1] = acum.Dominance[i] + Math.abs(scaleD(cat_poem[i].Dominance));

            let area = d3.area()
                .curve(d3.curveCardinalClosed)
                .x0(function (d) {
                    return width / 2 + acum[d][i] * (angles[d][0] * scaling / cat_poem.length);
                })
                .x1(function (d) {
                    return width / 2 + acum[d][i + 1] * (angles[d][0] * scaling / cat_poem.length);
                })
                .y0(function (d) {
                    return height / 2 + acum[d][i] * (angles[d][1] * scaling / cat_poem.length);
                })
                .y1(function (d) {
                    return height / 2 + acum[d][i + 1] * (angles[d][1] * scaling / cat_poem.length);
                })

            svg.append("path")
                .data([c])
                .attr("class", "bigradararea" + i)
                .attr("d", area)
                .style("stroke", "white")
                .style("stroke-width", 0.2)
                .style("fill", function (d) {
                    return CatColor(i / cat_poem.length);
                })
                .on("mouseover", function (event) {
                    let poemtitle = cat_poem[i].Title;
                    if (poemtitle.length > 30) {
                        poemtitle = poemtitle.substring(0, 30) + "...";
                    }
                
                    let background = svg.append("rect")
                        .attr("class", "bigradarlextooltip")
                        .attr("rx", 10)
                        .attr("ry", 10)
                        .style("fill", "#579ee4")
                    d3.select(this).style("fill", "#579ee4");
                    let coordinates = d3.pointer(event);
                    svg.append("text")
                        .attr("x", coordinates[0])
                        .attr("y", coordinates[1] - 100)
                        .attr("class", "bigradarlextooltip bigradartip1")
                        .text(poemtitle)
                        .style("text-anchor", "middle")
                        .style("font-size", 24)
                        .style("font-weight", 300)
                        .style("fill", "white")
                    svg.append("text")
                        .attr("x", coordinates[0])
                        .attr("y", coordinates[1] - 70)
                        .attr("class", "bigradarlextooltip bigradartip2")
                        .text("Valence:" + cat_poem[i].Valence.toFixed(3))
                        .style("text-anchor", "middle")
                        .style("font-size", 16)
                        .style("font-weight", 300)
                        .style("fill", "white")
                    svg.append("text")
                        .attr("x", coordinates[0])
                        .attr("y", coordinates[1] - 50)
                        .attr("class", "bigradarlextooltip bigradartip3")
                        .text("Arousal:" + cat_poem[i].Arousal.toFixed(3))
                        .style("text-anchor", "middle")
                        .style("font-size", 16)
                        .style("font-weight", 300)
                        .style("fill", "white")
                    svg.append("text")
                        .attr("x", coordinates[0])
                        .attr("y", coordinates[1] - 30)
                        .attr("class", "bigradarlextooltip bigradartip4")
                        .text("Dominance:" + cat_poem[i].Dominance.toFixed(3))
                        .style("text-anchor", "middle")
                        .style("font-size", 16)
                        .style("font-weight", 300)
                        .style("fill", "white")

                    let text1 = document.getElementsByClassName("bigradartip1")[0].getBBox().width;
                    let text2 = document.getElementsByClassName("bigradartip2")[0].getBBox().width;
                    let text3 = document.getElementsByClassName("bigradartip3")[0].getBBox().width;
                    let text4 = document.getElementsByClassName("bigradartip4")[0].getBBox().width;

                    let textwidth = d3.max([text1, text2, text3, text4]);

                    background
                        .attr("x", coordinates[0] - textwidth / 2 - 15)
                        .attr("y", coordinates[1] - 130)
                        .attr("width", textwidth + 30)
                        .attr("height", 110)
                })
                .on("mouseout", function (event) {
                    d3.select(this).style("fill", CatColor(i / cat_poem.length));
                    d3.selectAll(".bigradarlextooltip").remove();
                })
        }

        console.log(acum)



    })
}
RadarBig("Nature");
