
/*-------------------------------------------------------------------- 
  
– Author:MHD Rateb Alissa
– Date: 17/11/2017
refernce://https://bl.ocks.org/mbostock/ca9a0bb7ba204d12974bca90acc507c0
– Overall function of the code: sankey layout render
– The percentage of code written by the student ‘author’:20%
– The percentage of code taken from course examples:80%
  
---------------------------------------------------------------------- */


function sankey(targetDOMelement) {

  var sankeyObject = {};
  var jsonpackData;

  sankeyObject.loadAndRenderDataset = function (data) {
    jsonpackData = data;
    layoutAndRender(jsonpackData);
    return sankeyObject;
  };

  sankeyObject.appendToClick = function (fn) {
    onClick = fn;
    return sankeyObject;
  };

  function layoutAndRender(jsonpackData) {

    svg = document.getElementById("SVGId")
    var cc = document.getElementById("SVGId").querySelectorAll(".sankey");
    if (cc.length !== 0) {
      svg.removeChild(cc[0]);
    }

    var svg = d3.select(targetDOMelement),

      width = 1400;
    height = 1000;

    g = svg
      .append("g")
      .classed("sankey", true)
      .attr("transform", "translate(" + 0 + "," + 1600 + ")");


    var formatNumber = d3.format(",.0f"),
      format = function (d) { return formatNumber(d) + " "; },
      color = d3.scaleOrdinal(d3.schemeCategory10);

    var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]]);

    var link = g.append("g")
      .attr("class", "links")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.2)
      .selectAll("path")


    var node = g.append("g")
      .attr("class", "nodes")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("g");







    sankey(jsonpackData);

    link = link
      .data(jsonpackData.links);

    var linksel = link
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function (d) { return Math.max(1, d.width); })
      .on("click", onClick);

    linksel.append("title")
      .text(function (d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

    node = node
      .data(jsonpackData.nodes);

    var nodesel = node
      .enter().append("g")
      .attr("class", "node");

    nodesel.append("rect")
      .attr("x", function (d) { return d.x0; })
      .attr("y", function (d) { return d.y0; })
      .attr("height", function (d) { return d.y1 - d.y0; })
      .attr("width", function (d) { return d.x1 - d.x0; })
      .attr("fill", function (d) { return color(d.name.replace(/ .*/, "")); })
      .attr("stroke", "#000");

    nodesel.append("text")
      .attr("x", function (d) { return d.x0 - 6; })
      .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function (d) { return d.name; })
      .filter(function (d) { return d.x0 < width / 2; })
      .attr("x", function (d) { return d.x1 + 6; })
      .attr("text-anchor", "start");

    nodesel.append("title")
      .text(function (d) { return d.name + "\n" + format(d.value); });



  }

  function onClick() {
    console.log("inside sankey")
  }
  return sankeyObject;

}