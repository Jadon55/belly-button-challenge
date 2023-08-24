let allMetadata;
let allSamples;
d3.json("../belly-button-challenge/samples.json").then(data =>{
    // get values from data
    let sample_values = data.samples[0].sample_values;
    let otu_ids = data.samples[0].otu_ids;
    let otu_labels = data.samples[0].otu_labels;
    allMetadata = data.metadata;
    allSamples = data.samples;

    // Inital horizontal bar chart
    makeBar(sample_values, otu_ids, otu_labels);

    // Inital bubble chart
    makeBubble(otu_ids, sample_values, sample_values, otu_ids, otu_labels)

    // Inital Demographic Info
    demoInfo(data.metadata[0]);

    // fill the dropdown menu with all the IDs
    let ids = [];
    data.metadata.forEach(element => {
        ids.push(element.id);
    });
    fillDropdown(ids);

    // Inital guage
    makeGauge(data.metadata[0]);
});

function makeBar(values, labels, hoverText){
    // get the indices of the top 10 values
    let topIndices = values.map((value, index) => ({ value, index }))
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 10)
                      .map(item => item.index);

    // reverse order to match graph from example
    topIndices.reverse();

    // Extract the top 3 categories and values
    let topIds = topIndices.map(index => ("OTU " + labels[index].toString()));
    let topValues = topIndices.map(index => values[index]);
    let topLabels = topIndices.map(index => hoverText[index]);


    // graph
    var graphData = [{
        x: topValues,
        y: topIds,
        text: topLabels,
        type: 'bar',
        orientation: 'h'
    }];
    
    Plotly.newPlot('bar', graphData);
};

function makeBubble(xVal, yVal, markerSize, markerColor, textValues){
    // data for graph
    let data = [{
        x: xVal,
        y: yVal,
        text: textValues,
        mode: 'markers',
        marker: {
            size: markerSize,
            color: markerColor,
            colorscale: 'Viridis'
        }
    }];
    
    // labels for graph
    let layout = {
        title: 'Bubble Chart',
        xaxis: {
            title: 'X Values'
        },
        yaxis: {
            title: 'Y Values'
        }
    };
    
    // graph
    Plotly.newPlot('bubble', data, layout);
};

function demoInfo(data){
    // Select the <div> to add the data to
    const contentDiv = document.getElementById('sample-metadata');


    keys = Object.keys(data);
    keys.forEach(element => {
        // Create an <p> element
        const Element = document.createElement('p');
        Element.textContent = element + ": " + data[element];

        // Append the <p> element to the <div>
        contentDiv.appendChild(Element);
    });

};

function fillDropdown(ids){
    // Select the <select> to add the data to
    const contentDiv = document.getElementById('selDataset');
    ids.forEach(id => {
        // Create an <option> element
        const Element = document.createElement('option');
        Element.textContent = id;
        Element.value = id;

        // Append the <option> element to the <div>
        contentDiv.appendChild(Element);
    });
};

function optionChanged(id){
    // find the index of the target ID
    let index;
    for(let i = 0; i < allMetadata.length; i++){
        if (allMetadata[i].id == id) index = i;
    };

    // remove old data from the HTML
    const contentDiv = d3.select('#sample-metadata');
    contentDiv.selectAll('p').remove();

    // use demoInfo to add the metadata to the HTML
    demoInfo(allMetadata[index]);
    makeGauge(allMetadata[index]);

    // update bar chart
    let sample_values = allSamples[index].sample_values;
    let otu_ids = allSamples[index].otu_ids;
    let otu_labels = allSamples[index].otu_labels;
    makeBar(sample_values, otu_ids, otu_labels);
    
    // update bubble chart
    makeBubble(otu_ids, sample_values, sample_values, otu_ids, otu_labels)
};

function makeGauge(data){
    // graph settings
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: data.wfreq,
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge",
            gauge: {
                axis: {
                    range: [null, 9],
                    tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9+"], // Corresponding range names
                },
                steps: [
                { range: [0, 1], color: "rgb(248,243,236)" },
                { range: [1, 2], color: "rgb(244,241,229)" },
                { range: [2, 3], color: "rgb(233,230,202)" },
                { range: [3, 4], color: "rgb(229,231,179)" },
                { range: [4, 5], color: "rgb(213,228,157)" },
                { range: [5, 6], color: "rgb(183,204,146)" },
                { range: [6, 7], color: "rgb(140,191,136)" },
                { range: [7, 8], color: "rgb(138,187,143)" },
                { range: [8, 9], color: "rgb(133,180,138)" }
                ],
                bar: {
                    color: "rgb(100,100,100)"
                }
            },
        }
      ];
    // graph size
    var layout = {
        width: 600,
        height: 500,
        margin: {
            t: 0,
            b: 0
        }
    };
    // graph
    Plotly.newPlot('gauge', data, layout);
};