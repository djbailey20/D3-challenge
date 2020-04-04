// @TODO: YOUR CODE HERE!
var tip = d3.tip().attr("class", "d3-tip");

var svgWidth = 825;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select(".container")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
chartGroup.call(tip);
var tooltips;
var bottomAxisGroup = chartGroup
  .append("g")
  .attr("transform", `translate(0, ${height})`);

var leftAxisGroup = chartGroup.append("g");
var circles;

var povertyAxis = chartGroup
  .append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .text("In Poverty (%)")
  .classed("axis-label", true);
var ageAxis = chartGroup
  .append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .text("Age (Median)")
  .classed("axis-label", true);
var incomeAxis = chartGroup
  .append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 60})`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .text("Household Income (Median)")
  .classed("axis-label", true);
var healthcareAxis = chartGroup
  .append("text")
  .attr("transform", `translate(-30, ${height / 2}) rotate(-90)`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .text("Lacks Healthcare (%)")
  .classed("axis-label", true);
var smokeAxis = chartGroup
  .append("text")
  .attr("transform", `translate(-50, ${height / 2}) rotate(-90)`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .text("Smoke (%)")
  .classed("axis-label", true);
var obesityAxis = chartGroup
  .append("text")
  .attr("transform", `translate(-70, ${height / 2}) rotate(-90)`)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .attr("fill", "black")
  .text("Obese (%)")
  .classed("axis-label", true);

// GRAPH FUNCTION
const graph = (data, x = "poverty", y = "healthcare") => {
  //   console.log(y);
  var xLinearScale = d3
    .scaleLinear()
    .range([0, width])
    .domain([d3.min(data, d => d[x]), d3.max(data, d => d[x])]);
  var yLinearScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([d3.min(data, d => d[y]), d3.max(data, d => d[y])]);
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  bottomAxisGroup
    .transition()
    .duration(500)
    .call(bottomAxis);
  leftAxisGroup
    .transition()
    .duration(500)
    .call(leftAxis);
  circles
    .transition()
    .duration(500)
    .attr("cx", d => xLinearScale(d[x]))
    .attr("cy", d => yLinearScale(d[y]))
    .attr("r", 10)
    .style("fill", "#8cc8ff");
  text
    .transition()
    .duration(500)
    .attr("dy", d => yLinearScale(d[y]) + 4)
    .attr("dx", d => xLinearScale(d[x]))
    .style("font-size", "10px")
    .style("text-anchor", "middle")
    .style("stroke-width", "10px")
    .style("fill", "white");

  // X AXIS
  povertyAxis.classed("active", x == "poverty").on("click", () => {
    graph(data, "poverty", y);
  });

  ageAxis.classed("active", x == "age").on("click", () => {
    graph(data, "age", y);
  });

  incomeAxis.classed("active", x == "income").on("click", () => {
    graph(data, "income", y);
  });

  // Y AXIS

  healthcareAxis.classed("active", y == "healthcare").on("click", () => {
    graph(data, x, "healthcare");
  });

  smokeAxis.classed("active", y == "smokes").on("click", () => {
    graph(data, x, "smokes");
  });

  obesityAxis.classed("active", y == "obesity").on("click", () => {
    graph(data, x, "obesity");
  });
  tip.html(
    d =>
      "<p style='font-weight:bold;font-size:15px'>" +
      d.state +
      "</p>" +
      "<p>" +
      x +
      ": " +
      d[x] +
      "</p><p>" +
      y +
      ": " +
      d[y] +
      "</p>"
  );
  tooltips
    .transition()
    .duration(500)
    .attr("y", d => yLinearScale(d[y]) - 10)
    .attr("x", d => xLinearScale(d[x]) - 10);
};

d3.csv("./assets/data/data.csv").then(data => {
  console.log(data);
  data.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
    d.smokes = +d.smokes;
    d.obesity = +d.obesity;
    d.age = +d.age;
    d.income = +d.income;
  });

  circleGroup = chartGroup
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("g");
  circles = circleGroup.append("circle");
  text = circleGroup.append("text").text(d => d.abbr);
  tooltips = chartGroup
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("opacity", 0)
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

  graph(data);
});
