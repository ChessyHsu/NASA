// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Parse the time / time
var parsetime = d3.time.format("%Y-%m-%d %X").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.packetloss); });
    
// Adds the svg canvas
var svg = d3.select("#packetloss")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("metric.csv", function(error, data) {
    data.forEach(function(d) {
        d.time = parsetime(d.time);
        // console.log(d.time);
        // console.log(d.packetloss);
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.time; }));
    y.domain([0, d3.max(data, function(d) { return d.packetloss; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

});

var inter = setInterval(function() {
                updateData();
        }, 5000); 

// ** Uptime data section (Called from the onclick)
function updateData() {
    // console.log("new");
    // Get the data again
    d3.csv("metric.csv", function(error, data) {
        data.forEach(function(d) {
            d.time = parsetime(d.time);
        });

        // Scale the range of the data again 
        x.domain(d3.extent(data, function(d) { return d.time; }));
        y.domain([0, d3.max(data, function(d) { return d.packetloss; })]);

    // Select the section we want to apply our changes to
    var svg = d3.select("#packetloss").transition();

    // Make the changes
        svg.select(".line")   // change the line
            .duration(3)
            .attr("d", valueline(data));
        svg.select(".x.axis") // change the x axis
            .duration(3)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(3)
            .call(yAxis);

    });
}