// dropdown menu selection
var dropdownMenu = d3.select("#selDataset")

// update charts when new id is selected in dropdown menu
d3.selectAll("#selDataset").on("change", getData)

////////////////////////////////
// initial setup
////////////////////////////////
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

////////////////////////////////
// dropdown menu filter
////////////////////////////////
function idFilter(id) {
    if (id.id === dropdownMenu.property("value")) {
        return id
    }
    else if (id.id === parseInt(dropdownMenu.property("value"))) {
        return id
    }
}

////////////////////////////////
// retrieve data and filter based on dropdown menu selection
////////////////////////////////
function getData() {
    d3.json("samples.json").then(data => {

        // retrieve data
        let samples = data.samples.map(samples => { return samples })
        let metaData = data.metadata.map(metadata => { return metadata })

        // filter data
        let filteredData = samples.filter(idFilter)
        let filteredMetaData = metaData.filter(idFilter)

        // update charts and demo info panel
        updateCharts(filteredData, filteredMetaData[0].wfreq)
        updateDemoInfo(filteredMetaData[0])
    })
}

////////////////////////////////
// create charts
////////////////////////////////
function updateCharts(data, wfreq) {

    //////////////////////////////////////////////////////////////////////////
    // Bar Chart
    //////////////////////////////////////////////////////////////////////////

    // select values from data
    let sampleValues = data.map(samples => { return samples.sample_values })
    // select top 10
    let barX = sampleValues[0].slice(0, 10)

    // select ids from data
    let sampleIds = data.map(samples => { return samples.otu_ids })
    // select top 10 and convert to string
    let sampleIdsTop = sampleIds[0].slice(0, 10).map(String)
    // append otu to each id value
    let barY = []
    sampleIdsTop.forEach(id => {
        id = "otu" + " " + id
        barY.push(id)
    })

    // select labels from data
    let sampleLabels = data.map(samples => { return samples.otu_labels })
    // select top 10
    let barLabels = sampleLabels[0].slice(0, 10)

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

    let barLayout = {
        margin: { 
            'r': 0,
            't': 50,
            'b': 25
        }
    }

    // create bar chart
    Plotly.newPlot('bar', barData, barLayout)

    //////////////////////////////////////////////////////////////////////////
    // Bubble Chart
    //////////////////////////////////////////////////////////////////////////

    // bubble chart data
    let bubbleData = [{
        x: sampleIds[0],
        y: sampleValues[0],
        text: sampleLabels[0],
        mode: 'markers',
        marker: {
            color: sampleIds[0],
            colorscale: 'Earth',
            size: sampleValues[0],
            line: {
                color: 'white',
                width: 2
            }
        }
    }]

    // bubble chart layout
    let bubbleLayout = {
        showlegend: false,
        margin: { 't': 0 },
        xaxis: {
            title: {
                text: 'OTU ID'
            }
        }
    }

    // create bubble chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, { responsive: true })

    //////////////////////////////////////////////////////////////////////////
    // Gauge Chart
    //////////////////////////////////////////////////////////////////////////
    
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            title: { text: "Belly Button Washes per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 9]},
                bar: { color: "#deff8b" }
            }
        }
    ];
    
    var layout = {
        margin: {
            't': 0,
            'b': 0,
            'l': 0,
            'r': 0
        }
    }
    Plotly.newPlot('gauge', data, layout);
}

////////////////////////////////
// create metadata table
////////////////////////////////
function updateDemoInfo(data) {

    // select metadata panel
    let demoInfo = d3.select('#metadata')

    // clear table
    demoInfo.html('')

    // add each metadata object entry to metadata panel
    Object.entries(data).forEach(([key, value]) => {
        demoInfo.append('li').attr('class', 'list-group-item').text(`${key}: ${value}`)
      })
}