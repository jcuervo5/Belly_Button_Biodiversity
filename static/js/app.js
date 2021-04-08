
function init() {
        d3.json("samples.json").then((data) => {
                var names = data.names
                var dropDown = d3.select("#selDataset")
                .attr("name", "name-list")
                var options = dropDown.selectAll("option")
                .data(names)
                .enter()
                .append("option");
                options.text(function(d) {
                        return d;
                         })
                           .attr("value", function(d) {
                        return d;
                        });
            
            });
        buildMetaData(940);
        buildCharts(940);
      }



function optionChanged(sampleNumber) {
        buildCharts(sampleNumber);
        buildMetaData(sampleNumber);
}

function buildMetaData(sampleNumber) {
        d3.json("samples.json").then((data) => {
                metadata = data.metadata;
                var sample = metadata.filter(metadata => metadata.id==sampleNumber);
                sample = sample[0]
                var metadata_object = d3.select("#sample-metadata")
                metadata_object.html("")
                Object.entries(sample).forEach(([key, value]) => {
                        metadata_object.append("h6").text(`${key.toUpperCase()}: ${value}`);
                })
        })

}

function buildCharts(sampleNumber) {
        d3.json("samples.json").then((data) => {
                samples = data.samples;
                var sample = samples.filter(d => d.id==sampleNumber);
                sample = sample[0]
                var otu_ids = sample.otu_ids;
                var otu_labels = sample.otu_labels;
                var sample_values = sample.sample_values;

                var layout = {
                        title: "Top Ten OTUs"
                }

                var barTrace = {
                        y : otu_ids.slice(0,10).map(otu => `OTU ${otu}`).reverse(),
                        x: sample_values.slice(0,10).reverse(),
                        type: "bar",
                        text: otu_labels.slice(0,10).reverse(),
                        orientation: "h"
                }
        
        Plotly.newPlot("bar",[barTrace], layout);

                var bubbleTrace = {
                        x: otu_ids,
                        y: sample_values,
                        text: otu_labels,
                        mode: 'markers',
                        marker: {size: sample_values,
                                color: otu_ids}
                };
                var layout = {
                        title: "Bubble Chart",
                        xaxis: {title: "OTU ID"},
                        showlegend: false,
                        height: 600,
                        width: 1200,
                };
        Plotly.newPlot("bubble", [bubbleTrace], layout);

        })};

init()

//init function:
//populate the drop down menu (id=selDataSet)
//loop through data and append an option for each sample name
//call buildcharts and buildMetadata on the first value in samples.json

//optionChanged: call buildchars and buildMetadata on the new sample