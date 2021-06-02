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
  constructor(id, amenities1, amenities2, amenities3, a12,a22,a32, button1Id, width = 1000, height = 550, place="Vaud"){

    this.id = id;

    // Initialisation:
    switch (place) {
        case 'Vaud':
            this.amenities = amenities1;
            break;
        case 'Zurich':
            this.amenities = amenities3;
            break;
        case 'Geneva':
            this.amenities = amenities2;
            break;
        case 'Vaud Special':
            this.amenities = a12;
            break;
        case 'Zurich Special':
            this.amenities = a32;
            break;
        case 'Geneva Special':
            this.amenities = a22;
            break;
        default:
            break;
    }

    //keep the different amenitites
    this.vd_links = amenities1;
    this.gv_links = amenities2;
    this.zh_links = amenities3;
    this.vd_links_s = a12;
    this.gv_links_s = a22;
    this.zh_links_s = a32;

    this.button1Id = button1Id;


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


fillSankeyData() {

  this.amenities.forEach(d => {
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

  var formatNumber = d3.format(",.2f"), // zero decimal places
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
        		   return " probability: " +
                   "\n" + format(d.value); });
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

show() {
  this.fillSankeyData()
  this.makeUniqueNodes()

  this.replaceLinkText()
  this.makeNodesObject()
  this.makeGraph()

}

update_place_(place){

  switch (place) {
      case 'Vaud':
          this.amenities = this.vd_links;
          break;
      case 'Zurich':
          this.amenities = this.zh_links;
          break;
      case 'Geneva':
          this.amenities = this.gv_links;
          break;
      case 'Vaud Special':
          this.amenities = this.vd_links_s;
          break;
      case 'Zurich Special':
          this.amenities = this.gv_links_s;
          break;
      case 'Geneva Special':
          this.amenities = this.zh_links_s;
          break;
      default:
          break;

  }
  this.svg.selectAll("*").remove();
  this.sankeydata = {"nodes" : [], "links" : []};
  this.show();

}




}

whenDocumentLoaded__(() => {

    var infoPath_vd = 'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/charlyne/data/vd_total.csv';
    var infoPath_gv = 'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/charlyne/data/gv_total.csv';
    var infoPath_zh = 'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/charlyne/data/zh_total.csv';
    var infoPath_vd_s = 'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/charlyne/data/vd_total_s.csv';
    var infoPath_gv_s = 'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/charlyne/data/gv_total_s.csv';
    var infoPath_zh_s = 'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/charlyne/data/zh_total_s.csv';


    var data1 = d3.csv(infoPath_vd);
    var data2 = d3.csv(infoPath_gv);
    var data3 = d3.csv(infoPath_zh);

    var data12 = d3.csv(infoPath_vd_s);
    var data22 = d3.csv(infoPath_gv_s);
    var data32 = d3.csv(infoPath_zh_s);

    Promise.all([data1, data2,data3,data12,data22,data32]).then(response => {

        var links_vd = response[0];
        var links_gv = response[1];
        var links_zh = response[2];
        var links_vd_s = response[3];
        var links_gv_s = response[4];
        var links_zh_s = response[5];

        chart = new SankeyPlot('plot5', links_vd,links_gv, links_zh, links_vd_s, links_gv_s,links_zh_s, 'selectPlaceButton5');


        chart.show();

        var button10Id = 'selectPlaceButton5';

        var places = {
            'Vaud': 'Vaud',
            'Geneva':'Geneva',
            'Zurich':'Zurich',
            'Vaud Special':'Vaud Special',
            'Geneva Special':'Geneva Special',
            'Zurich Special': 'Zurich Special'
        };

        initSelectorPlace__(`#${button10Id}`, places, chart);
        //initSelector(`#${button2Id}`, features, chart2, scatter, reverse = true);

    }).catch(error => console.log(error));


});

function initSelectorPlace__(id, places, chart, reverse = false) {
    var featureKeys = reverse ? Object.keys(places).reverse() : Object.keys(places);
    // add the options to the button
    d3.select(id)
    .selectAll('myOptions')
    .data(featureKeys)
    .enter()
    .append('option')
    .text(d => places[d]) // text showed in the menu
    .attr("value", d => d) // corresponding value returned by the button

    // When the button is changed, run the updateChart function
    d3.select(id).on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")


        // run the updateChart function with this selected option
        chart.update_place_(selectedOption);
    });
}
