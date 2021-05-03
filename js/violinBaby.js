function CallViolin() {

    // set the dimensions and margins of the graph
    var margin = 30,
        width = 800,
        height = 800;

    // set the ranges

    let axis_start = 200,
        axis_dist = 200;

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#violin")
        .append("svg")
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");


    d3.json("./processeddata/Old_New_Poem_Sentiment.json").then(function (data) {
        console.log(data)
        let violindata = {};
        // set increment = 
        let increment = 0.02;

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

        // Scale the range of the data

        let y = d3.scaleLinear()
            .domain([0, 1])
            .range([height - margin, 0]);

        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("transform", "translate(30,0)")

        svg.append("text")
            .attr("x", 220)
            .attr("y", 50)
            .text("Renaissance")
            .style("fill", "pink")
            .style("baseline-alignment", "hanging")

        svg.append("text")
            .attr("x", 220)
            .attr("y", 70)
            .text("Modern")
            .style("fill", "white")
            .style("baseline-alignment", "hanging")

        svg.append("rect")
            .attr("x", 200)
            .attr("y", 40)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", "pink")
        
        svg.append("rect")
            .attr("x", 200)
            .attr("y", 60)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", "white")

        for (let i = 0; i < 3; i++) {

            let x_right = d3.scaleLinear()
                .range([axis_start + (i * axis_dist), axis_start + (i * axis_dist) + 80]);

            let x_left = d3.scaleLinear()
                .range([axis_start + (i * axis_dist), axis_start + (i * axis_dist) - 80]);

            // define the area
            let area_right = d3.area()
                .curve(d3.curveCardinal)
                .x0(function (d) {
                    return axis_start + i * axis_dist;
                })
                .x1(function (d) {
                    return x_right(d.new)
                })
                .y(function (d, i) {
                    return y(i * increment);
                });

            let area_left = d3.area()
                .curve(d3.curveCardinal)
                .x0(function (d) {
                    return axis_start + i * axis_dist;
                })
                .x1(function (d) {
                    return x_left(d.old)
                })
                .y(function (d, i) {
                    return y(i * increment);
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
                .attr("y", height - margin / 3)
                .text(c[i])
                .style("fill", "white")
                .style("text-anchor", "middle")
                .style("baseline-alignment", "hanging")

            // Add the area.
            svg.append("path")
                .data([violindata[c[i]]])
                .attr("class", "area")
                .attr("d", area_right)
                .style("fill", "white");

            svg.append("path")
                .data([violindata[c[i]]])
                .attr("class", "area")
                .attr("d", area_left)
                .style("fill", "pink");

        }




        // Add the X Axis
        //        svg.append("g")
        //            .attr("transform", "translate(0," + (height - margin) + ")")
        //            .call(d3.axisBottom(y));

        // Add the Y Axis
        //        svg.append("g")
        //            .call(d3.axisLeft(x));
    })
}

CallViolin();
