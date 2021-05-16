function CallRadar() {
    // set the dimensions and margins of the graph
    // 8 x 8
    let factor = 50,
        offset = 100;
    var margin = 30,
        width = offset * 4 + 40,
        height = offset * 8;

    var svg = d3.select("#radar_type")
        .append("svg")
        .attr("id", "radartype")
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin)
        .append("g")

    let categories = ["Nature", "Animals", "Painting & Sculpture", "Gender & Sexuality", "Friends & Enemies", "Race & Ethnicity", "Living", "Love", "Religion", "Death", "Realistic & Complicated", "Activities", "Travels & Journeys", "Time & Brevity", "Spring", "Landscapes & Pastorals", "Weather", "History & Politics", "War & Conflict", "Youth", "Crime & Punishment", "Family & Ancestors", "School & Learning", "The Mind", "Eating & Drinking", "God & the Divine", "Life Choices", "Music", "Stars, Planets, Heavens", "Home Life", "Trees & Flowers", "Sciences"];

    d3.json("./processeddata/Category_Sentiment.json").then(function (data) {
        let c = ["Valence", "Dominance", "Arousal"];
        let angles = {
            Valence: [0, Math.cos(Math.PI)],
            Arousal: [Math.sin(Math.PI * 2 / 3), Math.cos(Math.PI * 5 / 3)],
            Dominance: [Math.sin(Math.PI * 4 / 3), Math.cos(Math.PI * 1 / 3)]
        };

        //Create the straight lines radiating outward from the center
        var axisGrid = svg.append("g")
            .attr("class", "axisWrapper");

        var axis = axisGrid.selectAll(".axis")
            .data(c)
            .enter()
            .append("g")
            .attr("class", "axis");


        let graphrow = 4;

        for (let i = 0; i < 32; i++) {

            let category = categories[i];
            let radardata = data[category].metrix;


            axis.append("circle")
                .attr("class", "radarbackground radarbackground" + i)
                .attr("cx", offset * ((i % graphrow) + 1))
                .attr("cy", offset * (Math.floor(i / graphrow) + 1))
                .attr("r", function (d, i) {
                    return (4 - i) / 4 * factor * 0.8;
                })
                .style("stroke", "#414050")
                .style("fill", "transparent")
                .style("stroke-width", 0.2)
                .style("opacity", 0.5)
                .on("mouseover", function () {
                    d3.selectAll(".radararea" + i).style("fill", "#579ee4");
                    d3.selectAll(".radarbackground" + i).style("stroke-width", 1).style("stroke", "#579ee4")

                    let background = svg.append("rect")
                        .attr("class", "radartooltip")
                        .attr("rx", 3)
                        .attr("ry", 3)
                        .style("fill", "#579ee4")
                    svg.append("text")
                        .attr("x", this.cx.baseVal.value + 7)
                        .attr("y", this.cy.baseVal.value - 50)
                        .attr("class", "radartooltip radartooltip1")
                        .text(category)
//                        .style("text-anchor", "middle")
                        .style("font-size", 12)
                        .style("font-weight", 300)
                        .style("fill", "white")

                    let text1 = document.getElementsByClassName("radartooltip1")[0].getBBox().width;


                    background
                        .attr("x", this.cx.baseVal.value)
                        .attr("y", this.cy.baseVal.value - 63)
                        .attr("width", text1 + 15)
                        .attr("height", 20)

                })
                .on("mouseout", function () {
                    d3.selectAll(".radararea" + i).style("fill", "#d36764");
                    d3.selectAll(".radarbackground" + i).style("stroke-width", 0.2).style("stroke", "#d36764");
                    d3.selectAll(".radartooltip").remove();

                })
                .on("click", function () {
                    RadarBig(category);
                })

            //Append the lines
            axis.append("line")
                .attr("class", "radarbackground radarbackground" + i)
                .attr("x1", offset * ((i % graphrow) + 1))
                .attr("y1", offset * (Math.floor(i / graphrow) + 1))
                .attr("x2", function (d) {
                    return angles[d][0] * factor * 0.8 + offset * ((i % graphrow) + 1);
                })
                .attr("y2", function (d) {
                    return angles[d][1] * factor * 0.8 + offset * (Math.floor(i / graphrow) + 1);
                })
                .style("stroke", "#414050")
                .style("stroke-width", 0.5)
                .style("opacity", 0.5)
                .on("mouseover", function () {
                    d3.selectAll(".radararea" + i).style("fill", "#579ee4");
                    d3.selectAll(".radarbackground" + i).style("stroke-width", 1).style("stroke", "#579ee4")
                })
                .on("mouseout", function () {
                    d3.selectAll(".radararea" + i).style("fill", "#d36764");
                    d3.selectAll(".radarbackground" + i).style("stroke-width", 0.2).style("stroke", "#d36764");
                })

            axis.append("text")
                .attr("x", function (d) {
                    return angles[d][0] * factor + offset * ((i % graphrow) + 1);
                })
                .attr("y", function (d) {
                    return angles[d][1] * factor + offset * (Math.floor(i / graphrow) + 1);
                })
                .text(function (d) {
                    return d.substring(0, 1);
                })
                .style("font-size", "10px")
                .style("fill", "#414050")
                .style("alignment-baseline", "middle")
                .style("text-anchor", "middle")

            // Add the area.

            let area = d3.area()
                .curve(d3.curveCardinalClosed)
                .x0(function (d) {
                    return angles[d][0] * radardata[d][0] * factor + offset * ((i % graphrow) + 1);
                })
                .x1(function (d) {
                    return angles[d][0] * radardata[d][1] * factor + offset * ((i % graphrow) + 1);
                })
                .y0(function (d) {
                    return angles[d][1] * radardata[d][0] * factor + offset * (Math.floor(i / graphrow) + 1);
                })
                .y1(function (d) {
                    return angles[d][1] * radardata[d][1] * factor + offset * (Math.floor(i / graphrow) + 1);
                })

            svg.append("path")
                .data([c])
                .attr("class", "radararea radararea" + i)
                .attr("d", area)
                .style("fill", "#d36764")
                .on("mouseover", function () {
                    d3.selectAll(".radararea" + i).style("fill", "#579ee4");
                    d3.selectAll(".radarbackground" + i).style("stroke-width", 1).style("stroke", "#579ee4")
                })
                .on("mouseout", function () {
                    d3.selectAll(".radararea" + i).style("fill", "#d36764");
                    d3.selectAll(".radarbackground" + i).style("stroke-width", 0.2).style("stroke", "#d36764");
                })
                .on("click", function () {
                    RadarBig(category);
                })

        }
    })
}

CallRadar();
