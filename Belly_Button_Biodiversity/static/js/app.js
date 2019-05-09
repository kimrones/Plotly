function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

   var defaultURL = "/metadata/" + sample;
   d3.json(defaultURL).then(function(data) {
   

     var sampleMetadata = document.querySelector("#sample-metadata");

     // clears panel
     sampleMetadata.innerHTML = null;


     var resKeys = Object.keys(data);

    for (var i=0; i<resKeys.length; i++){
      var newDataLine = document.createElement('p');
      newDataLine.innerHTML = resKeys[i] + ": " + data[resKeys[i]];
      sampleMetadata.appendChild(newDataLine)
  };

  
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/" + sample;
  
  d3.json(url).then(function(response) {

    

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = [{
     
      x: response.otu_ids,
      y: response.samples_values,
      type: "scatter",
      mode: "markers",
      marker: {
        colorscale: "Earth",
        color: response.otu_ids,
        size: response.sample_values,
        text: response.otu_labels

      }
    }];

    Plotly.newPlot('bubble', trace1);

    
     //Top 10 samples
     sampleValues = response.sample_values.slice(0,10);
     otuLabels = response.otu_ids.slice(0,10); 
     otuText = response.otu_labels.slice(0,10);
     

    //Pie Chart
    var data = [{
        values: sampleValues,
        labels: otuLabels,
        hovertext: otuText,
        type: "pie"
      }];


      var layout = {
        height: 400,
        width: 500
      };


      Plotly.newPlot('pie', data, layout);

    
    
   
    
  });
  

}

function optionChanged(sample){
  buildMetaData(sample);
  buildCharts(sample);
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
