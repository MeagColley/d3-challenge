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
        .range([0, chartWidth]);
    return xLinearScale;
}

// function yScale(stateData)
function yScale(stateData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.min(stateData, d => d[chosenYAxis]) * 0.8,
            d3.max(stateData, d => d[chosenYAxis]) * 1.2
        ])
        .range ([chartHeight, 0]);
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
    circlesGroup.transtition()
        .duration(1000)
        .attr("cx", d => newXscale(d[chosenXAxis]))
        .attr("cy", d => newYscale(d[chosenYAxis]))
    ;

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

    // var toolTip = d3.tip()
    //     .attr("class", "tooltip")
    //     .offset([80, -60])
    //     .html(function (d) {
    //         return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    //     });
    // circlesGroup.call(toolTip);
    // circlesGroup.on("mouseover", function(data) {
    //     toolTip.show(data);
    // })
    //     .on("mouseout", function(data, index) {
    //         toolTip.hide(data);
    //     });
    // return circlesGroup;
}
function updateToolTipY(chosenYAxis, circlesGroup) {
    if (chosenYAxis === "income") {
        var labely = "Income:";
    }
    else if (chosenYAxis === "poverty") {
        var labely = "Poverty Rate:";
    }
    else  {
        var labely = "Age:"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${labely} ${d[chosenYAxis]}`);
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
        stateData.healthcare = +stateData.healthcare;
        stateData.obesity = +stateData.obesity;
        stateData.smokes = +stateData.smokes;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(stateData, chosenXAxis);

    // yScale
    var yLinearScale = yScale(stateData, chosenYAxis);

    // initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append xaxis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // append yaxis
    chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circleGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "blue")
        .attr("opacity", ".5");

    // labels groups
    var labelsGroupX = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
    var labelsGroupY = chartGroup.append("g")
        .attr("transform", `translate(${chartHeight / 2}, ${chartWidth + 20})`);

    // x labels
    var obesityLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "obesity") //event listener value?
        .classed("active", true)
        .text("Obesity Rate");

    var smokesLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "smokes") // value event listenr?
        .classed("inactive", true)
        .text("Smoking Rate");
    var healthcareLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "healthcare") //event listenr values
        .classed("inactive", true)
        .text("Healthcare Availability");

    // y labels
    var povertyLabel = labelsGroupY.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty Rate");
    var incomeLabel = labelsGroupY.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "income")
        .classed("inactive", true)
        .text("Average Income");
    var ageLabel = labelsGroupY.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age");

    // update ToolTip
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
        circlesGroup = updateToolTipY(chosenYAxis, circlesGroup);
    // event listeners
    labelsGroupX.selectAll("text")
        .on("click", function(){
            // grab values
            var valueX = d3.select(this).attr("value");
            if (valueX !== chosenXAxis) {
                chosenXAxis = valueX;

                xLinearScale = xLinearScale(stateData, chosenXAxis);

                xAxis = renderXAxes(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                if (chosenXAxis === "obesity") {
                    obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenXAxis === "smokes") {
                    obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else {
                    obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }   
            }
        });
    labelsGroupY.selectAll("text")
        .on("click", function() {
            var valueY = d3.select(this).attr("value");
            if (valueY !== chosenYAxis) {
                chosenYAxis = valueY;

                yLinearScale = yLinearScale(stateData, chosenYAxis);

                yAxis = renderYAxes(yLinearScale, yAxis);

                circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);
                circlesGroup = updateToolTipY(chosenYAxis, circlesGroup);

                if (chosenYAxis === "income") {
                    incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenXAxis === "poverty") {
                    incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else {
                    incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                   ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }
            }
        });
    }).catch(function(error) {
        console.log(error);
    });

    






// function xScale(stateData)