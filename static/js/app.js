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

        // filter sample data and update charts using filtered data
        let filteredData = samples.filter(idFilter)
        updateCharts(filteredData)
    })
}


// create charts
function updateCharts(data) {

    //////////////////////////////////////////////////////////////////////////
    // Bar Chart
    //////////////////////////////////////////////////////////////////////////

    // select values from data
    let sampleValues = data.map(samples => { return samples.sample_values })
    // select top 10
    let barX = sampleValues[0].slice(0,10)

    // select ids from data
    let sampleIds = data.map(samples => { return samples.otu_ids })
    // select top 10 and convert to string
    let sampleIdsTop = sampleIds[0].slice(0,10).map(String)
    // append otu to each id value
    let barY = []
    sampleIdsTop.forEach(id => {
        id = "otu" + " " + id
        barY.push(id)
    })

    // select labels from data
    let sampleLabels = data.map(samples => { return samples.otu_labels })
    // select top 10
    let barLabels = sampleLabels[0].slice(0,10)

    // bar chart data
    let barData = [{
        type: 'bar',
        x: barX,
        y: barY,
        text: barLabels,
        orientation: 'h',
        transforms: [{
            type: 'sort',
            target: 'x',
            order: 'ascending'
            }]
        }]
    
    // create bar chart
    Plotly.newPlot('bar', barData)

    //////////////////////////////////////////////////////////////////////////
    // Bubble Chart
    //////////////////////////////////////////////////////////////////////////
    
    let trace1 = {
        x: sampleIds[0],
        y: sampleValues[0],
        text: sampleLabels[0],
        mode: 'markers',
        marker: {
          color: sampleIds[0],
          colorscale: 'Earth',
          size: sampleValues[0]
        }
      };
      
    let bubbleData = [trace1];
    
    let bubbleLayout = {
        showlegend: false,
        margin: {'t': 0},
        xaxis: {
            title: {
                text: 'OTU ID'
            }
        }
    };
    
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, {responsive: true});

    




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