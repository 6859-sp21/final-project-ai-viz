function CallRadar() {
    // set the dimensions and margins of the graph
    var margin = 30,
        width = 2000,
        height = 3000;

    //    // define the area
    //    var area = d3.area().curve(d3.curveBasis)
    //        .x0(function (d) {
    //            return 100;
    //            })
    //        .x1(function (d) {
    //            console.log(d[0])
    //            return x(d.new)
    //            })
    //        .y(function (d, i) {
    //            return y(i);
    //            });

    let factor = 50;
    let offset = 100;

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#radar_type")
        .append("svg")
        .attr("width", width + margin + margin)
        .attr("height", height + margin + margin)
        .append("g")


    let categories = ["Nature", "Animals", "Arts & Sciences", "Painting & Sculpture", "Social Commentaries", "Gender & Sexuality", "Relationships", "Friends & Enemies", "Language & Linguistics", "Race & Ethnicity", "Living", "The Body", "Love", "Desire", "Religion", "Christianity", "Realistic & Complicated", "Activities", "Travels & Journeys", "Time & Brevity", "Seas, Rivers, & Streams", "Spring", "Money & Economics", "Birth & Birthdays", "Landscapes & Pastorals", "Weather", "History & Politics", "Town & Country Life", "War & Conflict", "Poetry & Poets", "Youth", "First Love", "Reading & Books", "Marriage & Companionship", "Men & Women", "Crime & Punishment", "Parenthood", "Family & Ancestors", "School & Learning", "Class", "Jobs & Working", "The Mind", "Eating & Drinking", "Sports & Outdoor Activities", "God & the Divine", "Photography & Film", "Cities & Urban Life", "Death", "Romantic Love", "Music", "Stars, Planets, Heavens", "Sorrow & Grieving", "Home Life", "Heartache & Loss", "Trees & Flowers", "Mythology & Folklore", "Greek & Roman Mythology", "Life Choices", "Sciences", "Summer", "Health & Illness", "Faith & Doubt", "The Spiritual", "Horror", "Growing Old", "Gardening", "Other Religions", "Break-ups & Vexed Love", "Gay, Lesbian, Queer", "Ghosts & the Supernatural", "Fairy-tales & Legends", "Heroes & Patriotism", "Indoor Activities", "Islam", "Theater & Dance", "Kwanzaa", "Philosophy", "Disappointment & Failure", "Judaism", "Coming of Age", "New Year", "Separation & Divorce", "Popular Culture", "Fall", "Architecture & Design", "Pets", "Winter", "Memorial Day", "Humor & Satire", "St. Patrick's Day", "Passover", "Independence Day", "Midlife", "Weddings", "Infancy", "Get Well & Recovery", "Graduation", "Valentine's Day"];


    d3.json("./processeddata/Category_Sentiment.json").then(function (data) {

        let c = ["Arousal", "Valence", "Dominance", "Arousal", "Valence", "Dominance"];
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


        let graphrow = 8;

        for (let i = 0; i < 64; i++) {

            let category = categories[i];
            let radardata = data[category].metrix;



            //Append the lines
            axis.append("line")
                .attr("x1", offset * ((i % graphrow) + 1))
                .attr("y1", offset * (Math.floor(i / graphrow) + 1))
                .attr("x2", function (d) {
                    return angles[d][0] * factor + offset * ((i % graphrow) + 1);
                })
                .attr("y2", function (d) {
                    return angles[d][1] * factor + offset * (Math.floor(i / graphrow) + 1);
                })
                .attr("class", "line")
                .style("stroke", "white")
                .style("stroke-width", "0.5px");

            // Add the area.

            let area = d3.area()
                .curve(d3.curveCardinal)
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
                .attr("class", "area")
                .attr("d", area)
                .style("fill", "white")
        }
    })
}

CallRadar();
