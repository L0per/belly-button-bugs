
// initial setup
d3.json("samples.json").then(data => {

    // retrieve data
    let ids = data.samples.map(samples => {return samples.id});
    let samples = data.samples.map(samples => {return samples});

    // populate dropdownmenu with ids
    let dropdownMenu = d3.select("#selDataset");
    ids.forEach(id => {
        dropdownMenu.append("option").attr("value", id).text(id);
    })

    console.log(data);
    console.log(samples.filter(idFilter));
});


// dropdown menu filter
function idFilter (id) {
    let dropdownMenu = d3.select("#selDataset");
    if (id.id === dropdownMenu.property("value")) {
        return id;
    }
};

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