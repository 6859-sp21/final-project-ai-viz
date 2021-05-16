function CallViolin() {

    d3.select(".violinvis").remove();

    // set the dimensions and margins of the graph
    var margin = 30,
        width = window.innerWidth * 0.8,
        height = window.innerHeight * 0.7;

    let moderncolor = "#b05670",
        renaissancecolor = "#e67f80";

    // set the ranges

    let axis_start = (width - margin * 2) / 6,
        axis_dist = axis_start * 1.25;

    var increment = 0.02;

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#violin")
        .append("svg")
        .attr("class", "violinvis")
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin)
        .append("g")
        .attr("transform", "translate(0," + margin + ")");

    d3.json("./processeddata/Old_New_Poem_Sentiment.json").then(function (data) {
        let violindata = {};
        // set increment = 

        let c = ["valence", "arousal", "dominance"];
        // for-loop for binnin data needs a faster way to do so
        c.forEach(function (cat) {
            let dataset = [];
            for (let i = 0; i < 1; i = i + increment) {
                //check if data should be in bin
                let filtereddataOld = data.filter(function (d) {
                    return d[cat] >= i && d[cat] < i + increment && d.age == "Renaissance";
                }).length;
                let filtereddataNew = data.filter(function (d) {
                    return d[cat] >= i && d[cat] < i + increment && d.age == "Modern";
                }).length;

                dataset.push({
                    new: filtereddataNew,
                    old: filtereddataOld
                });
            };
            violindata[cat] = dataset;
        });

        let rva = 0,
            rda = 0,
            raa = 0,
            mva = 0,
            mda = 0,
            maa = 0,
            rcount = 0,
            mcount = 0;

        data.forEach(function (d) {
            if (d.age == "Renaissance") {
                rva += d.valence;
                rda += d.dominance;
                raa += d.arousal;
                rcount++;
            } else {
                mva += d.valence;
                mda += d.dominance;
                maa += d.arousal;
                mcount++;
            }
        });

        var averagevalues = {
            renaissance: {
                valence: rva / rcount,
                dominance: rda / rcount,
                arousal: raa / rcount
            },
            modern: {
                valence: mva / mcount,
                dominance: mda / mcount,
                arousal: maa / mcount
            }
        };

        //        console.log(averagevalues)

        // Scale the range of the data
        let y = d3.scaleLinear()
            .domain([increment, 1])
            .range([height - margin, 0]);

        svg.append("g")
            .attr("class", "violinscale")
            .call(d3.axisLeft(y))
            .attr("transform", "translate(30,0)")

        c.forEach(function (n, i) {

            let x_right = d3.scaleLinear()
                .range([axis_start + (i * axis_dist), axis_start + (i * axis_dist) + axis_dist/2.7]);

            let x_left = d3.scaleLinear()
                .range([axis_start + (i * axis_dist), axis_start + (i * axis_dist) - axis_dist/2.7]);

            // define the area
            let area_right = d3.area()
                .curve(d3.curveCardinal)
                .x0(function (d) {
                    return axis_start + i * axis_dist;
                })
                .x1(function (d) {
                    return x_right(d.new) + 1
                })
                .y(function (d, i) {
                    return y((i + 1) * increment);
                });

            let area_left = d3.area()
                .curve(d3.curveCardinal)
                .x0(function (d) {
                    return axis_start + i * axis_dist;
                })
                .x1(function (d) {
                    return x_left(d.old) - 1;
                })
                .y(function (d, i) {
                    return y((i + 1) * increment);
                });

            //            console.log(violindata.arousal);

            x_right.domain([0, d3.max(violindata[c[i]], function (d) {
                return d.new;
            })]);

            x_left.domain([0, d3.max(violindata[c[i]], function (d) {
                return d.old;
            })]);

            svg.append("text")
                .attr("x", axis_start + i * axis_dist)
                .attr("y", y(0) + 10)
                .text(c[i])
                .style("fill", "#414050")
                .style("text-anchor", "middle")
                .style("font-size", "18px")
                .style("baseline-alignment", "hanging")

            svg.append("path")
                .data([violindata[c[i]]])
                .attr("class", "violinactive violinarea violinrenaissance" + n)
                .attr("d", area_left)
                .style("fill", renaissancecolor)
                .on("click", function () {
                    if (this.className.baseVal.includes("violinactive")) {
                        individualfromviolin(n, i, data);
                    };
                })
                .on("mouseover", function (event) {
                    if (this.className.baseVal.includes("violinactive")) {
                        svg.append("text")
                            .attr("class", "violinhover")
                            .attr("x", axis_start + i * axis_dist - 10)
                            .attr("y", 10)
                            .text("Average " + Capitalize(n) + " for")
                            .style("fill", renaissancecolor)
                            .style("text-anchor", "end")
                        svg.append("text")
                            .attr("class", "violinhover")
                            .attr("x", axis_start + i * axis_dist - 10)
                            .attr("y", 26)
                            .text("Renaissance Poetry:")
                            .style("fill", renaissancecolor)
                            .style("text-anchor", "end")
                        svg.append("text")
                            .attr("class", "violinhover")
                            .attr("x", axis_start + i * axis_dist - 10)
                            .attr("y", 58)
                            .text(averagevalues.renaissance[n].toFixed(2))
                            .style("fill", renaissancecolor)
                            .style("font-size", 36)
                            .style("font-weight", 800)
                            .style("text-anchor", "end")
                    };
                })
                .on("mouseout", function (event) {
                    d3.selectAll(".violinhover").remove();
                })

            svg.append("path")
                .data([violindata[c[i]]])
                .attr("class", "violinactive violinarea violinmodern" + n)
                .attr("d", area_right)
                .style("fill", moderncolor)
                .on("click", function () {
                    if (this.className.baseVal.includes("violinactive")) {
                        individualfromviolin(n, i, data);
                    };
                })
                .on("mouseover", function (event) {
                    if (this.className.baseVal.includes("violinactive")) {
                        svg.append("text")
                            .attr("class", "violinhover")
                            .attr("x", axis_start + i * axis_dist + 10)
                            .attr("y", 10)
                            .text("Average " + Capitalize(n) + " for")
                            .style("fill", moderncolor)
                            .style("text-anchor", "start")
                        svg.append("text")
                            .attr("class", "violinhover")
                            .attr("x", axis_start + i * axis_dist + 10)
                            .attr("y", 26)
                            .text("Modern Poetry:")
                            .style("fill", moderncolor)
                            .style("text-anchor", "start")
                        svg.append("text")
                            .attr("class", "violinhover")
                            .attr("x", axis_start + i * axis_dist + 10)
                            .attr("y", 58)
                            .text(averagevalues.modern[n].toFixed(2))
                            .style("fill", moderncolor)
                            .style("font-size", 36)
                            .style("font-weight", 800)
                            .style("text-anchor", "start")
                    };
                })
                .on("mouseout", function (event) {
                    d3.selectAll(".violinhover").remove();
                })
        });

        svg.append("line")
            .attr("x1", 7)
            .attr("x2", axis_start + 2.5 * axis_dist)
            .attr("y1", y(increment))
            .attr("y2", y(increment))
            .style("stroke-width", 3)
            .style("stroke", "#414050")
    });

    function individualfromviolin(sent, n, data) {
        d3.select(".violinmodern" + sent)
            .attr("class", "violinarea violinmodern" + sent)
            .transition()
            .attr("transform", "translate(70,0)")
            .style("opacity", 0.3);
        d3.select(".violinrenaissance" + sent)
            .attr("class", "violinarea violinrenaissance" + sent)
            .transition()
            .attr("transform", "translate(-70,0)")
            .style("opacity", 0.3);
        svg.append("rect")
            .attr("class", "violinhovertrigger")
            .attr("x", axis_start + n * axis_dist - 70)
            .attr("y", 0)
            .attr("width", 140)
            .attr("height", height - margin)
            .style("fill", "white")
            .style("opacity", 0)
            .on("click", function (event) {
                d3.select(this).remove();
                d3.selectAll(".circle" + n).remove();
                svg.select(".violinmodern" + sent)
                    .attr("class", "violinactive violinarea violinmodern" + sent)
                    .transition()
                    .attr("transform", "translate(0,0)")
                    .style("opacity", 1);
                svg.select(".violinrenaissance" + sent)
                    .attr("class", "violinactive violinarea violinrenaissance" + sent)
                    .transition()
                    .attr("transform", "translate(0,0)")
                    .style("opacity", 1)
            })

        let y = d3.scaleLinear()
            .domain([increment, 1])
            .range([height - margin, 0]);

        let poemlength = d3.scaleLinear()
            .domain(d3.extent(data, function (d) {
                return d.length;
            }))
            .range([3, 10]);

        let poemcolor = d3.scaleOrdinal()
            .domain(["renaissance", "modern"])
            .range([renaissancecolor, moderncolor])

        let verticalcenter = d3.scaleOrdinal()
            .domain(["renaissance", "modern"])
            .range([-20, 20])

        let poetrynodes = [];

        data.forEach(function (d, a) {
            poetrynodes.push({
                id: a,
                nodesentiment: sent,
                radius: poemlength(d.length),
                value: d[sent] || increment,
                poemcolor: poemcolor(d.age),
                ycenter: verticalcenter(d.age),
                dominance: d.dominance,
                valence: d.valence,
                arousal: d.arousal,
                title: d.title,
                length: d.length,
                age: d.age,
                author: d.author
            })
        });
        
        console.log(poetrynodes);

        let node = svg.append("g")
            .selectAll(".circle" + n)
            .data(poetrynodes)
            .enter()
            .append("circle")
            .attr("class", function (d) {
                return "circle" + n + " violinid" + d.id
            })
            .attr("r", function (d) {
                return d.radius
            })
            .attr("cx", width / 2)
            .attr("cy", height)
            .style("fill", function (d) {
                return d.poemcolor;
            })
            .style("opacity", 0)
            .on("mouseover", function (event, d) {
                d3.selectAll(".violinid" + d.id).transition().style("fill", "#579ee4")
                svg.append("line")
                    .attr("class", "violinpoemtooltip")
                    .attr("x1", d.x)
                    .attr("y1", 2)
                    .attr("x2", d.x)
                    .attr("y2", d.y - 3)
                    .style("stroke", "#579ee4")
                    .style("stroke-width", 2)
                svg.append("text")
                    .attr("class", "violinpoemtooltip")
                    .attr("x", d.x + 10)
                    .attr("y", 10)
                    .text(d.title)
                    .style("font-size", 18)
                    .style("font-weight", 800)
                    .style("fill", "#579ee4")
                svg.append("text")
                    .attr("class", "violinpoemtooltip")
                    .attr("x", d.x + 10)
                    .attr("y", 26)
                    .text("by " + d.author + " (" + d.length + " words)")
                    .style("fill", "#579ee4")
                svg.append("text")
                    .attr("class", "violinpoemtooltip")
                    .attr("x", d.x + 10)
                    .attr("y", 42)
                    .text(d.age)
                    .style("fill", "#579ee4")
                svg.append("text")
                    .attr("class", "violinpoemtooltip")
                    .attr("x", d.x + 10)
                    .attr("y", 74)
                    .text(d.nodesentiment + ": " + d[d.nodesentiment].toFixed(3))
                    .style("fill", "#579ee4")
            })
            .on("mouseout", function (event, d) {
                d3.selectAll(".violinid" + d.id).transition().style("fill", d.poemcolor)
                d3.selectAll(".violinpoemtooltip").remove();
            })

        let simulation = d3.forceSimulation()
            .force("y",
                d3.forceY()
                .strength(5)
                .y(function (d) {
                    return y(d.value);
                }))
            .force("x",
                d3.forceX()
                .strength(0.3)
                .x(function (d) {
                    return axis_start + n * axis_dist + d.ycenter
                }))
            .force("charge", d3.forceManyBody().strength(0.8))
            .force("collide", d3.forceCollide().strength(1)
                .radius(function (d) {
                    return d.radius + 1
                })
                .iterations(1))

        simulation
            .nodes(poetrynodes)
            .on("tick", function (d) {
                node
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    })
            });

        node.transition()
            .delay(200)
            .duration(800)
            .style("opacity", 1)

    }
}

CallViolin();
