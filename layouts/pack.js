/*-------------------------------------------------------------------- 
  
– Author:MHD Rateb Alissa
– Date: 17/11/2017
-reference://https://bl.ocks.org/mbostock/7607535
– Overall function of the code: packlayout render
– The percentage of code written by the student ‘author’:20%
– The percentage of code taken from course examples:80%
  
---------------------------------------------------------------------- */
"use strict";

function pack(targetDOMelement) {
	
	//Delare the main object that will be returned to caller
	var packObject = {};
	var jsonpackData;
	//=================== PUBLIC FUNCTIONS =========================
	//


	packObject.loadAndRenderDataset = function (data) {
		jsonpackData = data;
		layoutAndRender();
		return packObject;
	};

	packObject.leafLabelFn = function (fn) {
		leafLabel = fn;
		return packObject;
	};

	packObject.appendToClick = function (fn) {
		onClick = fn;
		return packObject;
	};

	//=================== PRIVATE VARIABLES ====================================
	function layoutAndRender() {
		svg = document.getElementById("SVGId")
		var cc = document.getElementById("SVGId").querySelectorAll(".pack");
		if (cc.length !== 0) {
			svg.removeChild(cc[0]);
		}



		//Declare and append SVG element
		var svg = d3.select(targetDOMelement),
			margin = 20,
			// diameter = +svg.attr("width"),
			diameter = 750,
			g = svg
				.append("g")
				.classed("pack", true)
				.attr("transform", "translate(" + 650 + "," + 380 + ")");

		var color = d3.scaleLinear()
			.domain([-1, 5])
			.range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
			.interpolate(d3.interpolateHcl);




		var root;
		var focus;


		//=================== PRIVATE FUNCTIONS ====================================


		var pack = d3.pack()
			.size([diameter - margin, diameter - margin])
			.padding(10)

		root = d3.hierarchy(jsonpackData, function (d) { return d.values })
			.sum(function (d) { return d.value; });

			focus = root;
			var nodes = pack(root).descendants();
		renderLinksAndNodes(nodes);


		function renderLinksAndNodes(nodes) {
			var view;
			var circle = g.selectAll("circle")
				.data(nodes);

			var enterSelection = circle
				.enter().append("circle");

			var text = g.selectAll("text")
				.data(nodes);

			var textsel = text
				.enter().append("text");

			var node = g.selectAll("circle,text");

			enterSelection
				.attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
				.on("click", onClick)
				.on("dblclick", doubleclick);

			if (userType === "research") {
				enterSelection
					.style("fill", function (d) { return d.children ? colorResearch(d.depth * 10) : null; })
			}
			if (userType === "management") {
				enterSelection
					.style("fill", function (d) { return d.children ? colorManagment(d.depth * 10) : null; })
			}
			if (userType === "Collaborators") {
				enterSelection
					.style("fill", function (d) { return d.children ? colorColla(d.depth * 10) : null; })
			}

			


			textsel
				.attr("class", "label")
				.style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
				.style("display", function (d) { return d.parent === root ? "inline" : "none"; })
				.text(function (d) { return d.data.key; });



			svg
					.on("click", function () { zoom(root); });

			zoomTo([root.x, root.y, root.r * 2 + margin]);

			function zoom(d) {
				var focus0 = focus; focus = d;

				var transition = d3.transition()
					.duration(d3.event.altKey ? 7500 : 750)
					.tween("zoom", function (d) {
						var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
						return function (t) { zoomTo(i(t)); };
					});

				transition.selectAll("text")
					.filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
					.style("fill-opacity", function (d) { return d.parent === focus ? 1 : 0; })
					.on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
					.on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });


			}

			function zoomTo(v) {
				var k = diameter / v[2];
				view = v;
				node.attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
				enterSelection.attr("r", function (d) { return d.r * k; });
			}

			function doubleclick(d) {
				if (focus !== d) zoom(d)
				d3.event.stopPropagation();

				}




		}
	}


	function onClick() {
		console.log("inside pack")

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
		.range(["hsl(60, 100%, 55%)", "hsl(60, 100%, 30%)"])
		.interpolate(d3.interpolateHcl);



	//================== IMPORTANT do not delete ==================================
	return packObject; // return the main object to the caller to create an instance of the 'class'

} //End of pack() declaration	