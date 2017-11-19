/*-------------------------------------------------------------------- 
  
– Author:MHD Rateb Alissa
– Date: 17/11/2017
– References :Lab example
– Overall function of the code: barchart layout render
– The percentage of code written by the student ‘author’:10%
– The percentage of code taken from course examples:90%
  
---------------------------------------------------------------------- */

function barchart(targetDOMelement) {
		var barchartObject = {};

	//=================== PUBLIC FUNCTIONS =========================
	//
	barchartObject.overrideLabelAccessor = function (labelAccessorFunction) {
		labelAccessor = labelAccessorFunction;
		return barchartObject;
	}

	barchartObject.overrideDataFieldFunction = function (dataFieldFunction) {
		dataField = dataFieldFunction;
		return barchartObject;
	}

	barchartObject.overrideMouseOverFunction = function (callbackFunction) {
		mouseOverFunction = callbackFunction;
		render();
		return barchartObject;
	}

	barchartObject.overrideMouseOutFunction = function (callbackFunction) {
		mouseOutFunction = callbackFunction;
		render();
		return barchartObject;
	}

	barchartObject.render = function (callbackFunction) {
		render();
		return barchartObject;
	}


	barchartObject.loadAndRenderDataset = function (data) {
		dataset = data;
		render();
		return barchartObject;
	}

	

	//=================== PRIVATE VARIABLES ====================================
	//Width and height of svg canvas
	var svgWidth = 100;
	var svgHeight = 250;
	var barColour = "steelBlue"
	var dataset = [];
	var xScale = d3.scaleLinear();
	var yScale = d3.scaleBand();



	//Declare and append SVG element
	var svg = d3.select(targetDOMelement)
	var grp = svg.append("g")
			.classed("bar", true);

	grp
		.attr("transform", "translate(" + [1000, 650] + ")rotate (-90) scale(" + (1.5) + ")");




	//=================== PRIVATE FUNCTIONS ====================================

	var dataField = function (d) { return d.dataField1 }

	function updateScales() {
		//Set scales to reflect any change in svgWidth, svgHeight or the dataset size or max value
		xScale
			.domain([0, d3.max(dataset, function (d) { return dataField(d) })])
			.range([0, 20]);
		yScale
			.domain(d3.range(dataset.length))
			.rangeRound([0, svgHeight])
			.padding([.1]);
	};

	function render() {
		updateScales();
		GUP_bars();
		GUP_labels();
	}

	function GUP_bars() {
		//GUP = General Update Pattern to render bars 

		//GUP: BIND DATA to DOM placeholders
		var selection = grp
			.selectAll("rect")
			.data(dataset, function (d) { return d.key });

		//GUP UPDATE (anything that is already on the page)
		var updateSel = selection
			.attr("width", function (d) {
				return xScale(dataField(d));
			})
			.attr("y", function (d, i) {
				return yScale(i);
			})
			.attr("height", function () {
				return yScale.bandwidth()
			})

		//GUP: ENTER SELECTION = 
		var enterSel = selection
			.enter()
			.append("rect");

		enterSel
			.style("opacity", 0.7)
			.attr("x", 0)

			.attr("width", function (d) {
				return xScale(dataField(d));
			})
			.attr("y", function (d, i) {
				return yScale(i);
			})
			.attr("height", function () {
				return yScale.bandwidth()
			})
			.append("svg:title")
            .text(function (d, i) { return JSON.stringify(d.key) })

		//Apply callbacks to Enter & Update selections via merge
		var mergedSel = enterSel.merge(selection)
			.on("mouseover", mouseOverFunction)
			.on("mouseout", mouseOutFunction)
			
		mergedSel
			.filter(function (d) { return d.highlight == true })
			.style("stroke", "black")
			.style("fill", "purple")

		mergedSel
			.filter(function (d) { return !d.highlight })
			.style("stroke", "none")
			.style("fill", "#D65076")

			if(userType==="research"){
                mergedSel
                .style("fill", function (d) { return colorResearch(d.value/100) }) 
            }
            if(userType==="management"){
                mergedSel
                .style("fill", function (d) { return colorManagment(d.value/100) }) 
            }
            if(userType==="Collaborators"){
                mergedSel
                .style("fill", function (d) { return colorColla(d.value/100) }) 
            }

		//GUP EXIT selection 
		selection.exit()
			.style("fill", "grey")
			.transition()
			.duration(1000)
			.attr("width", 0)
			.remove()
	};

	function GUP_labels() {
		var selection = [];

		selection = grp
			.selectAll("text")
			.data(dataset, function (d) { return d.key });


		selection
			.enter()
			.append("text")
			.attr("x", 0)
			.attr("y", function (d, i) {
				return yScale(i) + 10;
			})
			// .style("font-size", "34px")
			.text(labelAccessor);


		selection
			.attr("y", function (d, i) {
				return yScale(i) + 10;
			})
			.text(labelAccessor);

		selection.exit()
			.remove()
	}

	var labelAccessor = function (d) { return d };


	var mouseOverFunction = function (d, i) {
		d3.select(this).style("opacity", 1.0);
	}
	var mouseOutFunction = function (d, i) {
		d3.select(this).style("opacity", 0.7);
	}

	var colorResearch = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(220, 100%, 65%)", "hsl(220, 100%, 35%)"])
    .interpolate(d3.interpolateHcl);

    var colorManagment = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(0, 100%, 65%)", "hsl(0, 100%, 40%)"])
    .interpolate(d3.interpolateHcl);

    var colorColla = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(120, 100%, 45%)", "hsl(120, 100%, 10%)"])
    .interpolate(d3.interpolateHcl);

	//================== IMPORTANT do not delete ==================================
	return barchartObject; // return the main object to the caller to create an instance of the 'class'

} //End of barchart() declaration	