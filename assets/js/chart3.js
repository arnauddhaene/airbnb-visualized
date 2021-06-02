// *******************//
// whenDocumentLoaded //
// *******************//
function whenDocumentLoaded__(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {
        // `DOMContentLoaded` already fired
        action();
    }
}

// *******************//
//     Sankey Plot      //
// *******************//

class SankeyPlot{
  constructor(id, amenities, button1Id, width = 1000, height = 450){

    this.button1Id = button1Id;

    this.amenities = amenities;

    this.margin = {top: 10, right: 10, bottom: 10, left: 10};
    this.width = width - this.margin.left - this.margin.right;
    this.height = height - this.margin.top - this.margin.bottom;

    //var formatNumber = d3.format(",.0f") // zero decimal places
    //    this.format = function(d) { return formatNumber(d); }

    this.svg = d3.select("#" + id)
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")");

    // Set the sankey diagram properties
    this.sankey = d3.sankey()
        .nodeWidth(5)
        .nodePadding(5)
        .nodeAlign(d3.sankeyCenter)
        .size([this.width, this.height]);

    this.path = this.sankey.links();

    this.sankeydata = {"nodes" : [], "links" : []}; //data for sankey format



}

show() {}


fillSankeyData() {

  this.amenities.forEach(d => {
    //console.log(d)
    this.sankeydata.nodes.push({ "name": d.source });
    this.sankeydata.nodes.push({ "name": d.target });
    this.sankeydata.links.push({ "source": d.source,
                       "target": d.target,
                       "value": +d.value });
   });
}

makeUniqueNodes() {

  this.sankeydata.nodes = Array.from(
     d3.group(this.sankeydata.nodes, d => d.name),
   ([value]) => (value)
   )
}

// loop through each link replacing the text with its index from node
replaceLinkText() {
  this.sankeydata.links.forEach( (d, i)=> {
    this.sankeydata.links[i].source = this.sankeydata.nodes
      .indexOf(this.sankeydata.links[i].source);
    this.sankeydata.links[i].target = this.sankeydata.nodes
      .indexOf(this.sankeydata.links[i].target);
  });
}

// now loop through each nodes to make nodes an array of objects
// rather than an array of strings
makeNodesObject(){

  this.sankeydata.nodes.forEach((d, i)=> {
    this.sankeydata.nodes[i] = { "name": d };
  });

}

makeGraph(){

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var formatNumber = d3.format(",.0f"), // zero decimal places
      format = function(d) { return formatNumber(d); };

  var graph = this.sankey(this.sankeydata);

  // add in the links
  var link = this.svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function(d) { return d.width; });

  // add the link titles
  link.append("title")
          .text(function(d) {
        		   return d.source.name + " → " +
                  d.target.name + "\n" + format(d.value); });
// add in the nodes
  var node = this.svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node");

// add the rectangles for the nodes
      node.append("rect")
            .attr("x", function(d) { return d.x0; })
            .attr("y", function(d) { return d.y0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("width", this.sankey.nodeWidth())
            .style("fill", function(d) {
      		      return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function(d) {
      		  return d3.rgb(d.color).darker(2); })
      	  .append("title")
            .text(function(d) {
      		  return d.name + "\n" + format(d.value); });

  // add in the title for the nodes
      node.append("text")
                  .attr("x", function(d) { return d.x0 - 6; })
                  .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
                  .attr("dy", "0.35em")
                  .attr("text-anchor", "end")
                  .text(function(d) { return d.name; })
                .filter(function(d) { return d.x0 < this.width / 2; })
                  .attr("x", function(d) { return d.x1 + 6; })
                  .attr("text-anchor", "start");

}




}

whenDocumentLoaded__(() => {

    var infoPath_vd = 'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/charlyne/data/vd_total.csv';
    var infoPath_gv = 'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/charlyne/data/gv_total.csv';

    var data = d3.csv(infoPath);

    Promise.all([data]).then(response => {

        var links = response[0];

        chart = new SankeyPlot('plot5', links, 'selectPlaceButton5');

        chart.fillSankeyData()
        chart.makeUniqueNodes()



        chart.replaceLinkText()
        chart.makeNodesObject()
        //console.log(this.sankey.nodes())
        chart.makeGraph()

        //chart.show();

        var button10Id = 'selectPlaceButton5';

        var places = {
            'Vaud': 'Vaud',
            'Geneva':'Geneva',
            'Zurich':'Zurich'
        };

        initSelector(`#${button10Id}`, features, chart1, scatter);
        //initSelector(`#${button2Id}`, features, chart2, scatter, reverse = true);

    }).catch(error => console.log(error));


});
