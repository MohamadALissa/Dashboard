/*-------------------------------------------------------------------- 
  
– Author:MHD Rateb Alissa
– Date: 17/11/2017
– Overall function of the code: pie layout render
– The percentage of code written by the student ‘author’:20%
– The percentage of code taken from course examples:80%
  
---------------------------------------------------------------------- */

function piechart(targetDOMelement) {
   

    //Delare the main object that will be returned to caller
    var piechartObject = {};

    //=================== PUBLIC FUNCTIONS =========================
    //
    piechartObject.overrideDataFieldFunction = function (dataFieldFunction) {
        dataField = dataFieldFunction;
        return piechartObject;
    }

    piechartObject.overrideMouseOverFunction = function (callbackFunction) {
        mouseOverFunction = callbackFunction;
        render();
        return piechartObject;
    }

    piechartObject.overrideMouseOutFunction = function (callbackFunction) {
        mouseOutFunction = callbackFunction;
        render();
        return piechartObject;
    }

    piechartObject.render = function () {
        render();
        return piechartObject;
    }


    piechartObject.loadAndRenderDataset = function (data) {
        // console.log("sssdsd",data)
        dataset = data;
        render();
        return piechartObject;
    }

    piechartObject.overrideMouseClick = function (callbackFunction) {
        onClickCallback = callbackFunction;
        render();
        return piechartObject;
    }
    piechartObject.pieCoor = function (width, height) {
         svgWidth1 = width;
        svgHeight1 = height;
        render();
        return piechartObject;
    }


    //=================== PRIVATE VARIABLES ====================================
    //Width and height of svg canvas
    var svgWidth1 = 300;
    var svgHeight1 = 300;
    var svgWidth = 200;
    var svgHeight = 200;
    var pieColour = "steelBlue"
    var dataset = [];
    var newdataset = [];
    var country = "Scotland";
    var user = "research";



    //Declare and append SVG element
    var svg = d3.select(targetDOMelement)
    



    //Declare and append group that we will use tp center the piechart within the svg
    var grp = svg.append("g")
        .classed("piechart", true);


        
    //=================== PRIVATE FUNCTIONS ====================================

    var dataField = function (d) {
        return d.value
    }

    var onClickCallback = function (d, i) {
        console.log(JSON.stringify(d.data.key));
         }

   
        //Set up shape generator
        var arcShapeGenerator = d3.arc()
        .outerRadius(svgHeight / 2)
        .innerRadius(svgHeight / 4)
        .padAngle(0.03)
        .cornerRadius(8);

    function render() {
        //Taken and addapted from https://github.com/d3/d3-shape/blob/master/README.md#pie
        //Generate the layout 
        var arcsLayout = d3.pie()
            .value(dataField)
            .sort(null)
            (dataset);

        //center the group within the svg
        grp.attr("transform", "translate(" + [svgWidth1 / 2, svgHeight1 / 2] + ")")

        //Now call the GUP
        GUP_pies(arcsLayout, arcShapeGenerator);
     
    }


    function GUP_pies(arcsLayout, arcShapeGenerator) {

        //GUP = General Update Pattern to render pies 

        //GUP: BIND DATA to DOM placeholders
        var selection = grp.selectAll("path")
            .data(arcsLayout, function (d) { return d.data.key })

        //GUP: ENTER SELECTION
        var enterSel = selection
            .enter()
            .append("path")
            .each(function (d) { this.dPrevious = d; }) // store d for use in tweening            
            .on("click", onClickCallback);




        //GUP ENTER AND UPDATE selection
        var mergedSel = enterSel.merge(selection);



        mergedSel
            .style("stroke", "gray")
            .style("opacity", 0.7)
            .on("mouseover", mouseOverFunction)
            .on("mouseout", mouseOutFunction)
            .append("svg:title")
            .text(function (d, i) { return JSON.stringify(d.data.key) });

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

        mergedSel
            .transition()
            .duration(2000)
            .attrTween("d", arcTween) //Use custom tween to draw arcs
           

        //GUP EXIT selection 
        selection.exit()
            .remove()
    };



    var mouseOverFunction = function (d, i) {
        d3.select(this).style("opacity", 1.0);
    }
    var mouseOutFunction = function (d, i) {
        d3.select(this).style("opacity", 0.7);
    }
	function arcTween(dNew) {
		//Create the linear interpolator function
		//this provides a linear interpolation of the start and end angles 
		//stored 'd' (starting at the previous values in 'd' and ending at the new values in 'd')
		var interpolateAngles = d3.interpolate(this.dPrevious, dNew);
		//Now store new d for next interpoloation
		this.dPrevious = dNew;
		//Return shape (path for the arc) for time t (t goes from 0 ... 1)
		return function (t) { return arcShapeGenerator(interpolateAngles(t)) };
	}

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
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
    return piechartObject; // return the main object to the caller to create an instance of the 'class'

} //End of piechart() declaration	