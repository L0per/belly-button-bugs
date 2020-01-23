// global variables
var dropdownMenu = d3.select("#selDataset");

d3.json("samples.json").then(data => {

    // retrieve data
    let ids = data.samples.map(samples => { return samples.id });
    var samples = data.samples.map(samples => { return samples });

    // populate dropdownmenu with ids
    ids.forEach(id => {
        dropdownMenu.append("option").attr("value", id).text(id);
    })

    // dropdown menu filter
    function idFilter(id) {
        if (id.id === dropdownMenu.property("value")) {
            return id;
        }
    };

    // initial setup
    getData()

    // select data based on dropdown menu
    d3.selectAll("#selDataset").on("change", getData);
    function getData() {
    
        // filter sample data and update bar chart
        let filteredData = samples.filter(idFilter);
        updateBar(filteredData)
    };

    // create horizontal plot
    function updateBar(data) {

        // select values from data
        let barVal = data.map(samples => { return samples.sample_values });
        // select top 10
        let barValTop = barVal[0].slice(0,10);
 
        // select ids from data
        let barIds = data.map(samples => { return samples.otu_ids });
        // select top 10 and convert to string
        let barIdsTop = barIds[0].slice(0,10).map(String);
        // append otu to each id value
        let barIdsTopString = []
        barIdsTop.forEach(id => {
            id = "otu" + " " + id;
            barIdsTopString.push(id);
        })

        let barLabels = data.map(samples => { return samples.otu_labels });
        // select top 10
        let barLabelsTop = barLabels[0].slice(0,10);
   
        // create bar chart
        var data = [{
            type: 'bar',
            x: barValTop,
            y: barIdsTopString,
            text: barLabelsTop,
            orientation: 'h',
            transforms: [{
                type: 'sort',
                target: 'x',
                order: 'ascending'
              }]
          }];
        Plotly.newPlot('bar', data);

        console.log(barLabelsTop)

    }
      
    console.log(data);
});



// function updateBar() {

// };

// let ids = data.samples.map(samples => {
//     return samples.id;
// });
// let sampleValues = data.samples.map(samples => {
//     return samples.sample_values;
// });
// let otuIds = data.samples.map(samples => {
//     return samples.otu_ids;
// })
// let otuLabels = data.samples.map(samples => {
//     return samples.otu_labels;
// })
// let selectedID = data.samples.filter(idFilter)