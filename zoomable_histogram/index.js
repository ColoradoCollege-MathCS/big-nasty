import * as d3 from 'd3';

// Load Data
const countyurl =
  'https://raw.githubusercontent.com/earthlab/earthpy/refs/heads/main/earthpy/example-data/colorado-counties.geojson';
const balloturl =
  'https://raw.githubusercontent.com/ohk99/cp341/refs/heads/main/PROP_EXQ.csv';

d3.json(countyurl, function (countyData) {
  d3.csv(balloturl, function (voteData) {
    // Process data
    voteData.forEach((row) => {
      row.yesVotes =
        parseInt(
          row['Yes\nNone/Unknown'].replace(/,/g, ''),
          10,
        ) || 0;
      row.noVotes =
        parseInt(
          row['No\nNone/Unknown'].replace(/,/g, ''),
          10,
        ) || 0;
      row.County = row.County.trim();
    });

    //remove the total
    voteData = voteData.filter(
      (d) => d.County !== 'Totals',
    );
    render(voteData);
  });
});

// Process and Render the Data
function render(voteData) {
  // Set the dimensions and margins of the graph
  const margin = {
      top: 10,
      right: 0,
      bottom: 50,
      left: 50,
    },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Append the SVG object to the body of the page
  const svg = d3
    .select('#my_dataviz')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr(
      'transform',
      'translate(' + margin.left + ',' + margin.top + ')',
    );

  // Extract the county names and voter data
  const counties = voteData.map((d) => d.County);

  // Define scales
  var x = d3
    .scaleBand()
    .domain(counties)
    .range([0, width])
    .padding(0.2);

  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(voteData, (d) => d.yesVotes + d.noVotes),
    ])
    .nice()
    .range([height, 0]);

  const color = d3
    .scaleOrdinal()
    .domain(['yesVotes', 'noVotes'])
    .range(['#7fbf7b', '#af8dc3']);

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = svg
    .append('defs')
    .append('SVG:clipPath')
    .attr('id', 'clip')
    .append('SVG:rect')
    .attr('width', width)
    .attr('height', height + 100)
    .attr('x', 0)
    .attr('y', 0);

  // Create the scatter variable: where both the circles and the brush take place
  var scatter = svg
    .append('g')
    .attr('clip-path', 'url(#clip)');

  // Append X-axis
  var xAxis = scatter
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end');

  // Append Y-axis
  var yAxis = svg.append('g').call(d3.axisLeft(y));

  // Create tooltip
  const tooltip = d3
    .select('#my_dataviz')
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('background-color', 'white')
    .style('border', 'solid')
    .style('border-width', '1px')
    .style('border-radius', '5px')
    .style('padding', '10px');

  // Tooltip handlers
  /*const mouseover = function (event, d) {
    console.log(this);
    tooltip
      .style('opacity', 1)
      .html(
        ` <strong> ${event.data.County} County  </strong><br> <strong>Votes Yes: </strong> ${event.data.yesVotes}<br> <strong>Votes No: </strong> ${event.data.noVotes}`,
      );
  };
  

  const mousemove = function (event) {
    tooltip
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY + 'px');
  };


  
  const mouseleave = function () {
    tooltip.style('opacity', 0);
  };
  */

  // Stack the data
  const stackedData = d3
    .stack()
    .keys(['yesVotes', 'noVotes'])(voteData);

  // Draw bars
  scatter
    .append('g')
    .attr('class', 'bars')
    .selectAll('g')
    .data(stackedData)
    .enter()
    .append('g')
    .attr('fill', (d) => color(d.key))
    .selectAll('rect')
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.data.County))
    .attr('y', (d) => y(d[1]))
    .attr('height', (d) => y(d[0]) - y(d[1]))
    .attr('width', x.bandwidth())
    .attr('data-key', (d) => d.data.County);
  //.on('mouseover', mouseover)
  //.on('mousemove', mousemove)
  //.on('mouseleave', mouseleave);

  // Set zoom and pan features
  const zoom = d3
    .zoom()
    .scaleExtent([0.5, 20]) // Control zoom range
    .extent([
      [0, 0],
      [width, height],
    ])
    .translateExtent([
      [0, 0],
      [width, height],
    ]) // Limit panning
    .on('zoom', updateChart);

  // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
  svg
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr(
      'transform',
      'translate(' + margin.left + ',' + margin.top + ')',
    )
    .call(zoom);

  var xLinear = d3
    .scaleLinear()
    .domain([0, counties.length])
    .range([0, width]);
  // A function that updates the chart when the user zoom and thus new boundaries are available
  function updateChart() {
    // recover the new scale
    var t = d3.event.transform;

    //limit side to side movement to not take the graph out of bounds
    t.x = Math.min(0, Math.max(t.x, -width * (t.k - 1)));
    t.y = 0;
    //t.x = Math.max(t.x, -450);
    var newX = t.rescaleX(xLinear);
    var newY = t.rescaleY(y);
    newY.domain([
      0,
      d3.max(voteData, (d) => d.yesVotes + d.noVotes),
    ]); // Maintain domain starting from 0

    // Update the Y-axis with the transformed scale
    yAxis.call(d3.axisLeft(newY));

    // Move ticks along the x-axis

    svg
      .selectAll('.x-axis .tick') // Select all tick groups
      .attr(
        'transform',
        (d) =>
          'translate(' +
          (newX(counties.indexOf(d)) +
            (newX(1) - newX(0)) * 0.25) +
          ',0)',
      );

    // Update the bar positions
    svg
      .selectAll('.bars rect')
      .attr('width', (newX(1) - newX(0)) * 0.5) // Adjust bar width for zoom
      .attr('x', (d) =>
        newX(counties.indexOf(d.data.County)),
      );
  }
}
