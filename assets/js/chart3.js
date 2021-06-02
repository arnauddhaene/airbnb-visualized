// *******************//
// whenDocumentLoaded //
// *******************//
function whenDocumentLoaded_(action) {
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
  constructor(id, amenities, button1Id, width = 500, height = 450){

    this.button1Id = button1Id;

    this.amenities = amenities;

    this.margin = {top: 10, right: 10, bottom: 10, left: 10};
    this.width = width - this.margin.left - this.margin.right;
    this.height = height - this.margin.top - this.margin.bottom;

    this.svg = d3.select("#" + id)
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")");

    // Set the sankey diagram properties
    this.sankey = d3.sankey()
        .nodeWidth(10)
        .nodePadding(14)
        .nodeAlign(d3.sankeyCenter)
        .size([this.width, this.height]);

    this.path = this.sankey.links();

    this.sankeydata = {"nodes" : [], "links" : []}; //data for sankey format



}

show() {}

makeSankey() {}

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

  graph = this.sankey(this.sankeydata);


}




}

whenDocumentLoaded(() => {

    var infoPath = 'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/charlyne/data/vd_total.csv'; //to replace by github raw

    var data = d3.csv(infoPath);

    Promise.all([data]).then(response => {

        var links = response[0];

        chart = new SankeyPlot('plot5', links, 'selectPlaceButton5');

        chart.fillSankeyData()
        console.log('length of sankeydata: '+chart.sankeydata.nodes.length)
        chart.makeUniqueNodes()


        console.log('length of sankeydata: '+chart.sankeydata.nodes.length)

        chart.replaceLinkText()
        chart.makeNodesObject()
        console.log(this.sankey)
        chart.makeGraph()

        //chart.show();

        var button1Id = 'selectPlaceButton5';

        var places = {
            'Vaud': 'Vaud',
            'Geneva':'Geneva',
            'Zurich':'Zurich'
        };

        //initSelector(`#${button1Id}`, features, chart1, scatter);
        //initSelector(`#${button2Id}`, features, chart2, scatter, reverse = true);

    }).catch(error => console.log(error));


});
