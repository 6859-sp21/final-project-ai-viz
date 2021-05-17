function createcluster() {
    let categories = ["Nature", "Animals", "Arts & Sciences", "Painting & Sculpture", "Social Commentaries", "Gender & Sexuality", "Relationships", "Friends & Enemies", "Language & Linguistics", "Race & Ethnicity", "Living", "The Body", "Love", "Desire", "Religion", "Christianity", "Realistic & Complicated", "Activities", "Travels & Journeys", "Time & Brevity", "Seas, Rivers, & Streams", "Money & Economics", "Landscapes & Pastorals", "Weather", "History & Politics", "War & Conflict", "Poetry & Poets", "Youth", "Reading & Books", "Marriage & Companionship", "Men & Women", "Crime & Punishment", "Parenthood", "Family & Ancestors", "School & Learning", "Jobs & Working", "The Mind", "Eating & Drinking", "Sports & Outdoor Activities", "God & the Divine", "Photography & Film", "Cities & Urban Life", "Death", "Romantic Love", "Music", "Stars, Planets, Heavens", "Sorrow & Grieving", "Home Life", "Heartache & Loss", "Trees & Flowers", "Mythology & Folklore", "Greek & Roman Mythology", "Life Choices", "Sciences", "Health & Illness", "Faith & Doubt", "The Spiritual", "Growing Old", "Break-ups & Vexed Love", "Gay, Lesbian, Queer", "Ghosts & the Supernatural", "Fairy-tales & Legends", "Heroes & Patriotism", "Islam", "Theater & Dance", "Philosophy", "Disappointment & Failure", "Judaism", "Coming of Age", "Separation & Divorce", "Fall", "Pets", "Winter"];

    categories = categories.sort(function (x, y) {
        return d3.ascending(x, y);
    })

    categories.forEach(function (d) {
        let option = document.createElement("option");
        option.innerHTML = d;
        option.setAttribute("value", d);
        document.getElementById("categoryselector").appendChild(option);
    })
};

function updatecluster(id) {

    document.getElementById("attributeselector").style.display = "inline-block";
    document.getElementById("attributeby").style.display = "inline-block";

    let CatColors = {
        Valence: d3.interpolateLab("#ffa1a5", "#a3ffba"),
        Arousal: d3.interpolateLab("lightgray", "#ffc359"),
        Dominance: d3.interpolateLab("lightgray", "#ffa1a5")
    };

    let attribute = document.getElementById("attributeselector").value;
    document.getElementById("clustercaption").innerHTML = "<div class='poemgradient'>" + attribute + " Gradient: 0<div style='background: linear-gradient(90deg, " + CatColors[attribute](0) + " 0%, " + CatColors[attribute](1) + " 100%);'></div>1</div><div class='caption'>Poem is grouped and colored based on the selected attribute</div>"

    d3.select(".cluster").remove();
    d3.json("./processeddata/Category_Sentiment.json").then(function (data) {

        data = data[id].data;

        let side = window.innerWidth * 0.65 - window.innerHeight * 0.3,
            margin = 30;

        let svg = d3.select("#clustervis")
            .append("svg")
            .attr("class", "cluster")
            .attr("width", side)
            .attr("height", side);

        let nodeScale = d3.scaleLinear()
            .domain(d3.extent(data, function (d) {
                return d.Poem.length;
            }))
            .range([10, side * 1.5 / data.length]);

        let remap = d3.scaleLinear().domain([0.3, 0.7]).range([0, 1])

        var node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "clucircle")
            .attr("r", function (d) {
                return nodeScale(d.Poem.length);
            })
            .attr("cx", side / 2)
            .attr("cy", side / 2)
            .style("fill", function (d) {
                return CatColors[attribute](remap(d[attribute]));
            })
            .on("mouseover", function (event, d) {
                let background = svg.append("rect")
                    .attr("class", "clutooltip")
                    .attr("rx", 10)
                    .attr("ry", 10)
                    .style("fill", "#579ee4")
                svg.append("text")
                    .attr("x", this.cx.baseVal.value)
                    .attr("y", this.cy.baseVal.value - 50)
                    .attr("class", "clutooltip clutooltip1")
                    .text(function () {
                        if (d.Title.length <= 20) {
                            return d.Title;
                        } else {
                            return d.Title.substring(0, 20) + "..."
                        }
                    })
                    .style("text-anchor", "middle")
                    .style("font-size", 24)
                    .style("font-weight", 700)
                    .style("fill", "white")
                svg.append("text")
                    .attr("x", this.cx.baseVal.value)
                    .attr("y", this.cy.baseVal.value - 33)
                    .attr("class", "clutooltip clutooltip2")
                    .text("by " + d.Poet)
                    .style("text-anchor", "middle")
                    .style("fill", "white")

                let text1 = document.getElementsByClassName("clutooltip1")[0].getBBox().width;
                let text2 = document.getElementsByClassName("clutooltip2")[0].getBBox().width;

                let textwidth = d3.max([text1, text2]);

                background
                    .attr("x", this.cx.baseVal.value - textwidth / 2 - 15)
                    .attr("y", this.cy.baseVal.value - 75)
                    .attr("width", textwidth + 30)
                    .attr("height", 53)
            })
            .on("mouseout", function (event, d) {
                d3.selectAll(".clutooltip").remove();
            })
            .on("click", function (event, d) {
                poemAnalysis(d);
            })

        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter()
                .x(side / 2)
                .y(side / 2))
            .force("charge", d3.forceManyBody()
                .strength(0.5))
            .force("collide", d3.forceCollide()
                .strength(.5)
                .radius(function (d) {
                    return nodeScale(d.Poem.length) + 2;
                })
                .iterations(1))

        simulation
            .nodes(data)
            .on("tick", function (d) {
                node
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    })
            });

        $("#attributeselector").change(function () {
            attribute = this.value;
            document.getElementById("clustercaption").innerHTML = "<div class='poemgradient'>" + attribute + " Gradient: 0<div style='background: linear-gradient(90deg, " + CatColors[attribute](0) + " 0%, " + CatColors[attribute](1) + " 100%);'></div>1</div><div class='caption'>Poem is grouped and colored based on the selected attribute</div>"
            node.transition().style("fill", function (d) {
                return CatColors[attribute](remap(d[attribute]));
            })
        });
    });
}

createcluster();
$("#categoryselector").change(function () {
    updatecluster(this.value);
});