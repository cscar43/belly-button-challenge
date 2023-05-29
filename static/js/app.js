// Step 1: Read in samples.json using D3
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
  // Extract necessary data from the JSON
  let samples = data.samples;
  let metadata = data.metadata;

  // Create a horizontal bar chart
  function createBarChart(sampleID) {
    // Filter the samples for the selected sample ID
    let selectedSample = samples.find(sample => sample.id === sampleID);

    // Slice the top 10 OTUs from the selected sample
    let top10OTUs = selectedSample.otu_ids.slice(0, 10).map(otu => `OTU ${otu}`).reverse();
    let top10Values = selectedSample.sample_values.slice(0, 10).reverse();
    let top10Labels = selectedSample.otu_labels.slice(0, 10).reverse();

    // Create the bar trace
    let trace = {
      x: top10Values,
      y: top10OTUs,
      text: top10Labels,
      type: "bar",
      orientation: "h"
    };

    // Create the bar data array
    let data = [trace];

    // Create the layout for the chart
    let layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    // Plot the chart
    Plotly.newPlot("bar", data, layout);
  }

  //Create a bubble chart
  function createBubbleChart(sampleID) {
    // Filter the samples for the selected sample ID
    let selectedSample = samples.find(sample => sample.id === sampleID);

    // Prepare data
    let bubbleData = [{
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      text: selectedSample.otu_labels,
      mode: "markers",
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: "Earth"
      }
    }];

    // Define layout options for the bubble chart
    let layout = {
      title: "OTU ID vs Sample Values",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      showlegend: false
    };

    // Plot the bubble chart
    Plotly.newPlot("bubble", bubbleData, layout);
  }

  //Display sample metadata
  function displayMetadata(sampleID) {
    // Filter the metadata for the selected sample ID
    let selectedMetadata = metadata.find(sample => sample.id === parseInt(sampleID));

    // Select the HTML element to display the metadata
    let metadataElement = d3.select("#sample-metadata");

    // Clear existing metadata
    metadataElement.html("");

    // Loop through each key-value pair in the metadata and display it
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataElement.append("p").text(`${key}: ${value}`);
    });
  }

  // Handle changes in the dropdown selection for the charts and metadata
  function optionChanged(newSampleID) {
    createBarChart(newSampleID);
    createBubbleChart(newSampleID);
    displayMetadata(newSampleID);
  }

  // Initialize the visualization
  function init() {
    let dropdown = d3.select("#selDataset");

    // Populate the dropdown menu with sample IDs
    samples.forEach(sample => {
      dropdown.append("option")
        .text(sample.id)
        .property("value", sample.id);
    });

    // Get the first sample ID and create the initial charts and display metadata
    let initialSampleID = samples[0].id;
    createBarChart(initialSampleID);
    createBubbleChart(initialSampleID);
    displayMetadata(initialSampleID);
  }

  // Initialize the visualization
  init();

  // Listen for changes in the dropdown selection
  d3.select("#selDataset").on("change", function() {
    let newSampleID = d3.event.target.value;
    optionChanged(newSampleID);
  });
});