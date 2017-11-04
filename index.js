/********************************************************
* Purpose: 
* Generate a Radial Tree for visualizing the UK food trends for 
* the years 1974 to 2014
* Generate a collapsible radial tree using d3.v4.js on a dataset
* loaded through D3
*
* Collapsible Radial Tree
* 
* Original Author: Mike Bostock -->FernOfTheAndes
* 
* Source:
* {@link https://codepen.io/fernoftheandes/#}
*
* Adapted from FernOfTheAndes' pen project "collapsible radial 
* tree"
*
********************************************************/
//load json file
d3.json("UKFoodTrends.json", function(error, data){

//color scheme for coloring nodes by year
var colorscheme = ["#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d"]

//global variables to be used later
var open = true;
var single = true;
var color = 0;


//adaptation of Richard Marr's convertion of a flat JSON file to hierarchical JSON data
//Source: https://stackoverflow.com/questions/19317115/convert-flat-json-file-to-hierarchical-json-data-like-flare-json-d3-example-fil
var newData = { name :"UK Food Trends", children : [] },
    levels = ["desc1","desc2","desc3","desc4"];

// For each data row, loop through the expected levels traversing the output tree
data.forEach(function(d){
    // Keep this as a reference to the current level
    var depthCursor = newData.children;
    // Go down one level at a time
    levels.forEach(function( property, depth ){

        // Look to see if a branch has already been created
        var index;
        depthCursor.forEach(function(child,i){
            if ( d[property] == child.name ) index = i;
        });
        // Add a branch if it isn't there
        if ( isNaN(index) ) {
            depthCursor.push({ name : d[property], children : []});
            index = depthCursor.length - 1;
        }
        // Now reference the new child array as we go deeper into the tree
        depthCursor = depthCursor[index].children;
        // This is a leaf, so add the last element to the specified branch
        if ( depth === levels.length - 1 ) {

//read in data for each year
var index = []; 
// build the index 
for (var x in d) { 
index.push(x); } 

//read each data value into proper child node
for(var i=0; i < 41; i++){  
	
	var amount = String(d[index[i]]);

//add measurement to each data value
	if (amount != "null")
	depthCursor.push({name: amount+d.unit}); 
	else
	depthCursor.push({name: amount});
}}
    });
});

data = newData;
//size of chart
var diameter = 1450;

var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = diameter+200,
    height = diameter;
    
var i = 0,
    duration = 2350,
    root;

var tree = d3.layout.tree()
    .size([360, diameter / 2 - 80])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 10) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("body").append("svg")
    .attr("width", width )
    .attr("height", height )
  .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
var xs = 0;
var ys = 0;
var date;

svg.append("text").text("Year Legend").attr("x",788).attr("y",-600).style("fill","black").style("font-size", "20px").style("stroke","black").style("stroke-width","1");

//createLegend
for(var i = 1; i < 42; i++){

		var legend = 			svg.append("ellipse").attr("cx", 810 + xs) .attr("cy", -552+ys) .attr("rx", 30) .attr("ry", 20).style("fill",colorscheme[i]).style("stroke","grey").style("stroke-width","1"); 
	date = String(1973+i);
	var rectangle = svg.append("text").text(date).attr("x", 790 +xs) .attr("y", -545+ys).style("font-size", "20px").style("stroke","midnightblue").style("stroke-width", "1").attr("fill","midnightblue");
ys += 50;
if(ys > 1000)
{	ys = 0;
	xs += 65;
}
	}

//create button for easy expanding of nodes
var rectangle = svg.append("rect").attr("x", -680) .attr("y", -700) .attr("width", 200) .attr("height", 60).style("fill","lightblue").style("stroke","grey").style("stroke-width","2").on("click",click2); 
var rectangle = svg.append("text").text("Single node expand").attr("x", -660) .attr("y", -675).style("font-size", "20px").style("stroke","midnightblue").style("stroke-width", "1").attr("fill","midnightblue");
var rectangle = svg.append("text").text("Full Expand").attr("x", -630) .attr("y", -655).style("font-size","20px").style("stroke","lightblue").style("stroke-width","1").attr("fill","lightblue");
var rectangle = svg.append("text").text("Click to change").attr("x", -645) .attr("y", -705).style("font-size","20px").attr("fill","black");


root = data;
root.x0 = height / 2;
root.y0 = 0;

root.children.forEach(collapse); // start with all children collapsed
update(root);

d3.select(self.frameElement).style("height", "800px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 130; });

  // Update the nodes
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .on("click", click);

//creates nodes
  nodeEnter.append("circle")
      .attr("r", 1e-6)
	 .style("stroke", function(d){if(d.children == null || d._children != null){if(d._children == null){color++; if(color > 41) color =1; return colorscheme[color];}}})
	 .style("stroke-width", function(d){var strength = Number(d.name.replace(/[^0-9\.]+/g, "")); if(strength > 1999)return "10"; else if(strength > 999) return "8"; else if(strength > 499) return "6"; else if(strength > 99) return "4"; else if(strength > 0) return "2"; else return "1";})
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
	.style("opacity", .2)
.on("mouseover", function(d) {if(d.name != "UK Food Trends"){d3.select(this.parentNode).select("text").style("font-size","20px").style("stroke-width", "1").style("fill", "dodgerBlue"); d3.select(this.parentNode).select("circle").style("opacity",1);}})
	.on("mouseout", function(d){if(d.name != "UK Food Trends"){d3.select(this.parentNode).select("text").style("font-size", function(d){if(d.name.length > 20) return "6px"; else return "10px"}).style("stroke-width", "0").style("fill", "#808080");d3.select(this.parentNode).select("circle").style("opacity",.2);}});

//create labels for each node
  nodeEnter.append("text")
      .attr("x", 30)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; })
      //this changes text size
	.style("font-size", function(d){if(d.name == "UK Food Trends" && !open) return "20px"; else if(d.name.length > 35) return "6px"; else if(d.name.length > 20) return "8px"; else return "10px"})
	.style("opacity", .8)
	.style("fill", function(d){if(d.name == "UK Food Trends" && !open) return "dodgerBlue"; else return "#808080";})
	.style("stroke", "#000")
	.style("stroke-width", function(d){if(d.name == "UK Food Trends" && !open) return "1"; else return "0";})
      .style("fill-opacity", 1e-6)
	.on("mouseover", function(d) {if(d.name != "UK Food Trends" || open){d3.select(this.parentNode).select("text").style("font-size","20px").style("stroke-width", "1").style("fill", "dodgerBlue");d3.select(this.parentNode).select("circle").style("opacity",1);}})
	.on("mouseout", function(d){if (d.name != "UK Food Trends" || open){d3.select(this.parentNode).select("text").style("font-size", function(d){if(d.name.length > 20) return "6px"; else return "10px"}).style("stroke-width", "0").style("fill", "#808080");d3.select(this.parentNode).select("circle").style("opacity",.3);}});


  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1)
      .attr("transform", function(d) { if(d.name == "UK Food Trends") {return "rotate(360)translate(-15)"; } else return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length + 50)  + ")"; });

  // TODO: appropriate transform
  var nodeExit = node.exit().transition()
      .duration(duration)
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    if(!single)
	 expand(d);
    d._children = null;
  }
if (d.name == "UK Food Trends" && open)
	open = false;
else if (d.name == "UK Food Trends")
	open = true;
  
  update(d);
}

//for button functionality
function click2(d){
	var color = d3.select("rect").style("fill");
	d3.select("rect").style("fill",function(d){if(color == "midnightblue"){single = true; return "lightblue";} else{single=false; return "midnightblue";}});
	   console.log(d3.select("text"));
}

// Collapse nodes
function collapse(d) {
  if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
}
// Expand nodes
function expand(d){
  var children = (d.children)?d.children:d._children;
if (d._children) {
d.children = d._children;
d._children = null;
}
if(children)
children.forEach(expand);

}


});
