// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins 
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .select("scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

//Append a group to the SVG area and Shift ('translate') it to the right and down to adhere
// to the margins set in the'chartMargin' object
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Initial Params
var chosenXAxis = "obesity";
var chosenYAxis = "income";

// function xScale(stateData)
function xScale(stateData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
            d3.max(stateData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}

// function yScale(stateData)
function yScale(stateData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.min(stateData, d => d[chosenYAxis]) * 0.8,
            d3.max(stateData, d => d[chosenYAxis]) * 1.2
        ])
        .range ([height, 0]);
    return yLinearScale;

}

// updating X axis
function renderXAxes(newXscale, xAxis) {
    var bottomAxis = d3.axisBottom(newXscale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// updating Y axis
function renderYAxes(newYscale, yAxis) {
    var leftAxis = d3.axisLeft(newYscale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// updating circles
function renderCircles(circlesGroup, newXscale, chosenXAxis, newYscale, chosenYAxis) {
    circlesGroup.transtition(
        .duration(1000)
        .attr("cx", d => newXscale(d[chosenXAxis]))
        .attr("cy", d => newYscale(d[chosenYAxis]))
    );

    return circlesGroup;
}

// update tooltips
function updateToolTip(chosenXAxis, circlesGroup) {
    if (chosenXAxis === "obesity") {
        var label = "Obesity:";
    }
    else if (chosenXAxis === "smokes") {
        var label = "Smokes:";
    }
    else {
        var label = "Healthcare:"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
        });
    circlesGroup.call(toolTip);
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    return circlesGroup;
}

// Load data from csv
// there is probably a better way to construct this path
// stateData = [];
// d3.csv("../StarterCode/assets/data/data.csv").then(function(Data) {
//     for(var i in Data)
//     stateData.push(Data [i]);
// });

// // Check to see if the data loaded properly 
// console.log(stateData);

d3.csv("../StarterCode/assets/data/data.csv").then(function(stateData, err){
    if (err) throw err;

// function to parse data
    stateData.forEach (function(data) {
        stateData.poverty = +stateData.poverty;
        stateData.age = +stateData.age;
        stateData.income = +stateData.income;
        stateData.healthcare = +stateDatae.healthcare;
        stateData.obesity = +stateData.obesity;
        stateData.smokes = +stateData.smokes;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(stateData, chosenXAxis);

    // yScale
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.)])










// function xScale(stateData)