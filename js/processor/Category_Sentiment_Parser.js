// by charles wu
d3.csv("../../data/Tag_Scraper.csv").then(function (data) {

    console.log(data[0]);

    // load pre-trained lexicon for identifying valence, arousal and dominance
    d3.json("../../processeddata/VAD.json").then(function (sentiment) {

        /* // this chunk of text was used to create the array of categories
        let categories = [];
        data.forEach(function(d){
            let temp = d.Tags.split(",");
            temp.forEach(function(e){
                if(categories.includes(e) == false){
                    categories.push(e);
                }
            })
        }) */

        // full array of categories for fast processing
        let categories = ["Nature", "Animals", "Arts & Sciences", "Painting & Sculpture", "Social Commentaries", "Gender & Sexuality", "Relationships", "Friends & Enemies", "Language & Linguistics", "Race & Ethnicity", "Living", "The Body", "Love", "Desire", "Religion", "Christianity", "Realistic & Complicated", "Activities", "Travels & Journeys", "Time & Brevity", "Seas, Rivers, & Streams", "Spring", "Money & Economics", "Birth & Birthdays", "Landscapes & Pastorals", "Weather", "History & Politics", "Town & Country Life", "War & Conflict", "Poetry & Poets", "Youth", "First Love", "Reading & Books", "Marriage & Companionship", "Men & Women", "Crime & Punishment", "Parenthood", "Family & Ancestors", "School & Learning", "Class", "Jobs & Working", "The Mind", "Eating & Drinking", "Sports & Outdoor Activities", "God & the Divine", "Photography & Film", "Cities & Urban Life", "Death", "Romantic Love", "Music", "Stars, Planets, Heavens", "Sorrow & Grieving", "Home Life", "Heartache & Loss", "Trees & Flowers", "Mythology & Folklore", "Greek & Roman Mythology", "Life Choices", "Sciences", "Summer", "Health & Illness", "Faith & Doubt", "The Spiritual", "Horror", "Growing Old", "Gardening", "Other Religions", "Break-ups & Vexed Love", "Gay, Lesbian, Queer", "Ghosts & the Supernatural", "Fairy-tales & Legends", "Heroes & Patriotism", "Indoor Activities", "Islam", "Theater & Dance", "Kwanzaa", "Philosophy", "Disappointment & Failure", "Judaism", "Coming of Age", "New Year", "Separation & Divorce", "Popular Culture", "Fall", "Architecture & Design", "Pets", "Winter", "Memorial Day", "Humor & Satire", "St. Patrick's Day", "Passover", "Independence Day", "Midlife", "Weddings", "Infancy", "Get Well & Recovery", "Graduation", "Valentine's Day"];

        let c = ["Valence", "Dominance", "Arousal"];

        // set preview length of poem
        let previewlength = 100;

        // format original data to make it easier for reading
        data.forEach(function (d) {
            d.ID = +d.ID;
            d.Poem = d.Poem
                .replace(/\n/g, " ") // replace all line-breaks
                .replace(/[^\w\s]/gi, "") // replace all special characters
                .replace(/  /g, ""); // replace all unnecessary spaces
            d.Title = d.Title
                .replace(/\n/g, "") // replace all line-breaks
                .replace(/  /g, ""); // replace all unnecessary spaces
            d.Tags = d.Tags
                .replace(/,/g, ", ")
                .replace(/  /g, " ")

            let PoemArray = d.Poem.split(" ");
            let V = 0,
                A = 0,
                D = 0,
                VADCount = 0;

            d.PoemShort = d.Poem.substring(1, previewlength);

            PoemArray.forEach(function (w) {
                w = w.toLowerCase(); // ensures that the json-call matches

                if (sentiment[w] !== undefined) {
                    V += sentiment[w].Valence;
                    D += sentiment[w].Dominance;
                    A += sentiment[w].Arousal;
                    VADCount++;
                }
            })

            d.Valence = V / VADCount || 0;
            d.Dominance = D / VADCount || 0;
            d.Arousal = A / VADCount || 0;

        })

        //create empty container for data export
        let exportdata = {};

        categories.forEach(function (cat, i) {

            let filtereddata = data.filter(function (d) {
                return d.Tags.includes(cat) &&
                    d.Valence !== 0 &&
                    d.Dominance !== 0 &&
                    d.Arousal !== 0;
            })

            let filteredmetrics = {};

            c.forEach(function (metric) {

                let fMax = d3.max(filtereddata, function (d) {
                    return d[metric] + 0.01;
                })

                let fMin = d3.min(filtereddata, function (d) {
                    return d[metric];
                })

                filteredmetrics[metric] = [fMin, fMax];
            })

            exportdata[cat] = {
                dataCount: filtereddata.length,
                metrix: filteredmetrics,
                data: filtereddata
            }
        });
        
        console.log(exportdata);

        downloadObject(exportdata, "Category_Sentiment");

    });
});

function Capitalize(str) {
    let lower = String(str).toLowerCase();
    return lower.replace(/(^| )(\w)/g, function (x) {
        return x.toUpperCase();
    });
}

function downloadObject(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
