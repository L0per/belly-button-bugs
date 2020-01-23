// dropdown menu selection
var dropdownMenu = d3.select("#selDataset")

// update charts when new id is selected in dropdown menu
d3.selectAll("#selDataset").on("change", getData)


// initial setup
init()
function init() {
    d3.json("samples.json").then(data => {

        // retrieve data
        let ids = data.samples.map(samples => { return samples.id })
    
        // populate dropdownmenu with ids
        ids.forEach(id => {
            dropdownMenu.append("option").attr("value", id).text(id)
        })

        // initial chart creation
        getData()
    })
}


// dropdown menu filter
function idFilter(id) {
    if (id.id === dropdownMenu.property("value")) {
        return id
    }
}


// retrieve data and filter based on dropdown menu selection
function getData() {
    d3.json("samples.json").then(data => {

        // retrieve data
        let samples = data.samples.map(samples => { return samples })

        // filter sample data and update bar chart using filtered data
        let filteredData = samples.filter(idFilter)
        updateBar(filteredData)
    })
}


// create horizontal plot
function updateBar(data) {

    // select values from data
    let barVal = data.map(samples => { return samples.sample_values })
    // select top 10
    let barValTop = barVal[0].slice(0,10)

    // select ids from data
    let barIds = data.map(samples => { return samples.otu_ids })
    // select top 10 and convert to string
    let barIdsTop = barIds[0].slice(0,10).map(String)
    // append otu to each id value
    let barIdsTopString = []
    barIdsTop.forEach(id => {
        id = "otu" + " " + id
        barIdsTopString.push(id)
    })

    // select labels from data
    let barLabels = data.map(samples => { return samples.otu_labels })
    // select top 10
    let barLabelsTop = barLabels[0].slice(0,10)

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
        }]
    Plotly.newPlot('bar', data)
}




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