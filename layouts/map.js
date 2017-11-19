
/*-------------------------------------------------------------------- 
  
– Author:MHD Rateb Alissa
– Date: 17/11/2017
– Overall function of the code: Map layout render
– The percentage of code written by the student ‘author’:25%
– The percentage of code taken from course examples:75%
  
---------------------------------------------------------------------- */
function map(targetDOMelement) {
    var mapObject = {};
    //=================== PUBLIC FUNCTIONS =========================
    mapObject.loadAndRender = function (mapDataCountries) {
        data = mapDataCountries
        renderMap(mapDataCountries);
        return mapObject;
    }


    mapObject.overrideMouseClickcountry = function (callbackFunction) {
        onClickCallback = callbackFunction;

        return mapObject;
    }
    mapObject.overrideMouseClickunis = function (callbackFunction) {
        onclickuni = callbackFunction;

        return mapObject;
    }


   

    mapObject.overrideMouseOver = function (callbackFunction) {
        mouseOverFunction = callbackFunction;
        return mapObject;
    }

    mapObject.overrideMouseOut = function (callbackFunction) {
        mouseOutFunction = callbackFunction;
        return mapObject;
    }
    mapObject.drawCircle = function (uni) {
        university = uni;
        renderMap(data);
        return mapObject;
    }
    //=================== PRIVATE VARIABLES ====================================
    var width = 960,
        height = 1160;
    var name;
    var color = "steelBlue";
    var data;
    var university;
    
    var svg = d3.select(targetDOMelement)
   
    var grp = svg.append("g")
        .classed("map", true);

    //define projection of spherical coordinates to the Cartesian plane
    var projection = d3.geoAlbers()
        .center([0, 55.4])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(1200 * 3)
        .translate([1100, 1100]);

    //Define path generator (takes projected 2D geometry and formats for SVG)
    var pathGen = d3
        .geoPath()
        .projection(projection)
        .pointRadius(2);

    function renderMap(mapData) {
          var countries = mapData.countries;
        var unis = mapData.unis;
        GUP_countries(grp, countries);
        GUP_unis(grp, unis);

       }

    //=================== PRIVATE FUNCTIONS ====================================
    var onClickCallback = function (d, i) {
        console.log(JSON.stringify(d));
    }
    var mouseOverFunction = function (d) {
          d3.select(this).classed('highlight', true);

    }

    var mouseOutFunction = function (d) {
         d3.select(this).classed('highlight', false);
    }

    onclickuni = function (d, i) {
        console.log("orignal")
    }

    function GUP_countries(grp, countries) {
        //Draw the five unit outlines (ENG, IRL, NIR, SCT, WLS)
        //DATA BIND
        var selection = grp
            .selectAll(".classCountry")
            .data(countries);



        //ENTER
        var enterSel = selection
            .enter()
            .append("path")
            .attr("class", function (d) { return d.id; })
            .classed("classCountry", true)
            .attr("d", pathGen);



        enterSel
            .on("mouseover", mouseOverFunction)
            .on("mouseout", mouseOutFunction)
            .on("click", onClickCallback)
            .append("svg:title")
            .text(function (d, i) { return JSON.stringify(d.properties.name) })




 
    }

    function GUP_unis(grp, unis) {


        //DATA BIND
        var selection = grp
            .selectAll("g.classTown")
            .data(unis);


        //ENTER  
        var enterSelection = selection.enter()
            .append("g")
            .on("click", onclickuni)
            .classed("classTown", true)
            .attr("transform", function (d) {
                 return "translate(" + projection([parseFloat(d.value["lon"]), parseFloat(d.value["lat"])]) + ")";
            })


        

        //Append circles

        selection
            .append("circle")
            .attr("r", 4)
            .filter(function (d, i) {
                return d.key == university
            })
             .style("stroke", "yellow")
            .style("fill", "yellow");

        

        enterSelection.append("circle")
            .attr("r", 4)
            .append("svg:title")
            .text(function (d, i) { return JSON.stringify(d.key) });

         selection
            .exit()
            .remove()

        enterSelection.exit()
            .remove()

    }
    return mapObject;
}