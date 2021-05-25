// *******************//
//    IMPORTS         //
// *******************//
// import _ from 'lodash.js';

// *******************//
// whenDocumentLoaded //
// *******************//
function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {
        // `DOMContentLoaded` already fired
        action();
    }
}

// *******************//
//    ScatterPlot     //
// *******************//
class ScatterPlot {

    constructor(id, listings, featureX, featureY, button1Id, button2Id, width = 500, height = 450) {

        this.button1Id = button1Id, this.button2Id = button2Id;

        this.listings = listings, this.featureX = featureX, this.featureY = featureY;

        this.margin = { top: 50, right: 30, bottom: 50, left: 30 };

        this.width = width - this.margin.left - this.margin.right;
        this.height = height - this.margin.top - this.margin.bottom;

        this.svg = d3.select("#" + id)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");

    }

    show() {

        // Prepare canvas
        this.svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.addAxes()

        this.addPoints(this.featureX, this.featureY)

    }

    addAxes() {

        var tempListings = this.listings
            .filter(l => (l[this.featureX] != NaN) && (l[this.featureX] != 0.0))
            .filter(l => (l[this.featureY] != NaN) && (l[this.featureY] != 0.0));

        var minToMaxX = [d3.min(tempListings, l => +l[this.featureX]), d3.max(tempListings, l => +l[this.featureX])]
        var minToMaxY = [d3.min(tempListings, l => +l[this.featureY]), d3.max(tempListings, l => +l[this.featureY])]

        // Add X axis
        this.x = d3.scaleLinear()
            .domain(minToMaxX)
            .range([0, this.width]);

        this.svg.append("g")
            .attr('id', 'xAxis')
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));

        // Add Y axis
        this.y = d3.scaleLinear()
            .domain(minToMaxY)
            .range([this.height, 0]);

        this.svg.append("g")
            .attr('id', 'yAxis')
            .call(d3.axisLeft(this.y));
    }

    addPoints(featureX, featureY) {

        // Add dots
        this.svg.append('g')
            .attr('id', 'chart')
            .selectAll("dot")
            .data(this.listings)
            .enter()
            .append("circle")
            .attr("cx", d => this.x(d[featureX]))
            .attr("cy", d => this.y(d[featureY]))
            .attr("r", 1.5)
            .style("fill", "#69b3a2")
    }

    update() {

        this.featureX = document.getElementById(this.button1Id).value;
        this.featureY = document.getElementById(this.button2Id).value;

        this.svg.select('#xAxis')
            .remove()

        this.svg.select('#yAxis')
            .remove()

        this.addAxes()

        this.svg.select('#chart')
            .remove()

        this.addPoints(this.featureX, this.featureY)

    }

}

// *******************//
//     ChoroPlot      //
// *******************//
class ChoroPlot {

    constructor(id, legendId, geojson, listings, features, feature = 'price', width = 500, height = 450) {

        this.id = id

        this.geojson = geojson;
        this.listings = listings;

        this.features = features;

        this.updateFeature(feature);

        this.svg = d3.select("#" + this.id)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + width + " " + height)

        this.legendId = legendId
    }

    updateFeature(feature) {
        this.feature = feature;

        var tempListings = this.listings.filter(l => (l[this.feature] != NaN) && (l[this.feature] != 0.0));

        this.minToMax = [d3.min(tempListings, l => +l[this.feature]), d3.max(tempListings, l => +l[this.feature])]

        this.colorScale = d3.scaleLinear()
            .domain(this.minToMax)
            .range(["lightgreen", "blue"]);

        this.lookup = new Map(this.listings.map(d => [d.neighbourhood, d[this.feature]]));
    }

    fill() {
        this.svg.select('#map')
            .selectAll('.neighbourhood')
            .attr('fill', d => {
                var neighbourhood = this.lookup.get(d.properties.neighbourhood);
                return neighbourhood ? this.colorScale(neighbourhood) : 'rgba(0, 0, 0, 0.2)';
            })
            .style("opacity", 0.8);
    }

    callout(g, value) {
        if (!value) return g.style("display", "none");

        g.style("display", null)
            .style("pointer-events", "none")
            .style("font", "16px sans-serif");

        const path = g.selectAll("path")
            .data([null])
            .join("path")
            .attr("fill", "white")
            .attr("stroke", "black");

        const text = g.selectAll("text")
            .data([null])
            .join("text")
            .call(text => text
                .selectAll("tspan")
                .data((value + "").split(/\n/))
                .join("tspan")
                .attr("x", 0)
                .attr("y", (d, i) => `${i * 1.1}em`)
                .style("font-weight", (_, i) => i ? null : "bold")
                .text(d => d));

        const { x, y, width: w, height: h } = text.node().getBBox();

        text.attr("transform", `translate(${-w / 2},${15 - y})`);
        path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
    }

    show() {

        // var projection = d3.geoEquirectangular();
        var projection = d3.geoMercator().translate([-500, -125]).scale(20000).center([4.53, 47.3]);

        var path = d3.geoPath().projection(projection);

        this.svg
            .append('g').attr('id', 'map')
            .selectAll('path')
            .data(this.geojson.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'neighbourhood')

        this.fill()

        var tooltip = this.svg.append('g')

        let handleMouseOver = (event, d) => {

            var feature = +d3.format('0.2f')(this.lookup.get(d.properties.neighbourhood)) || 'Unknown';

            tooltip.call(this.callout, d.properties.neighbourhood + '\n ' +
                `${feature}`);

            tooltip.attr("transform",
                `translate(${d3.pointer(event, this.svg.node())})`);

            this.svg.select('#map')
                .selectAll('.neighbourhood')
                .filter(p => p.properties.neighbourhood == d.properties.neighbourhood)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "red")
        }

        let handleMouseLeave = (_, d) => {

            tooltip.call(this.callout, null);

            this.svg.select('#map')
                .selectAll('.neighbourhood')
                .filter(p => p.properties.neighbourhood == d.properties.neighbourhood)
                .transition()
                .duration(200)
                .style("opacity", 0.8)
                .style("stroke", "rgb(101, 99, 99)")
        }

        this.svg.select("#map")
            .selectAll(".neighbourhood")
            .on("touchmove mousemove", handleMouseOver)
            .on("touchend mouseleave", handleMouseLeave);

        this.legend({
            selector: 'svg#' + this.legendId,
            color: this.colorScale,
            title: this.features[this.feature]
        });

    }

    update(option, legendText) {

        this.updateFeature(option);

        this.fill();

        d3.select('svg#' + this.legendId)
            .selectAll('*')
            .remove()

        this.legend({
            selector: 'svg#' + this.legendId,
            color: this.colorScale,
            title: legendText
        });
    }


    legend({
        selector,
        color,
        title,
        tickSize = 6,
        width = 320,
        height = 44 + tickSize,
        marginTop = 18,
        marginRight = 0,
        marginBottom = 16 + tickSize,
        marginLeft = 0,
        ticks = width / 64,
        tickFormat,
        tickValues
    } = {}) {
        const svg = d3.select(selector)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .style("overflow", "visible")
            .style("display", "block");

        let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
        let x;

        // Continuous
        if (color.interpolate) {
            const n = Math.min(color.domain().length, color.range().length);

            x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

            svg.append("image")
                .attr("x", marginLeft)
                .attr("y", marginTop)
                .attr("width", width - marginLeft - marginRight)
                .attr("height", height - marginTop - marginBottom)
                .attr("preserveAspectRatio", "none")
                .attr("xlink:href", this.ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
        }

        // Sequential
        else if (color.interpolator) {
            x = Object.assign(color.copy()
                .interpolator(d3.interpolateRound(marginLeft, width - marginRight)), {
                    range() {
                        return [marginLeft, width - marginRight];
                    }
                });

            svg.append("image")
                .attr("x", marginLeft)
                .attr("y", marginTop)
                .attr("width", width - marginLeft - marginRight)
                .attr("height", height - marginTop - marginBottom)
                .attr("preserveAspectRatio", "none")
                .attr("xlink:href", this.ramp(color.interpolator).toDataURL());

            // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
            if (!x.ticks) {
                if (tickValues === undefined) {
                    const n = Math.round(ticks + 1);
                    tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
                }
                if (typeof tickFormat !== "function") {
                    tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
                }
            }
        }

        // Threshold
        else if (color.invertExtent) {
            const thresholds = color.thresholds ? color.thresholds() // scaleQuantize
                :
                color.quantiles ? color.quantiles() // scaleQuantile
                :
                color.domain(); // scaleThreshold

            const thresholdFormat = tickFormat === undefined ? d => d :
                typeof tickFormat === "string" ? d3.format(tickFormat) :
                tickFormat;

            x = d3.scaleLinear()
                .domain([-1, color.range().length - 1])
                .rangeRound([marginLeft, width - marginRight]);

            svg.append("g")
                .selectAll("rect")
                .data(color.range())
                .join("rect")
                .attr("x", (d, i) => x(i - 1))
                .attr("y", marginTop)
                .attr("width", (d, i) => x(i) - x(i - 1))
                .attr("height", height - marginTop - marginBottom)
                .attr("fill", d => d);

            tickValues = d3.range(thresholds.length);
            tickFormat = i => thresholdFormat(thresholds[i], i);
        }

        // Ordinal
        else {
            x = d3.scaleBand()
                .domain(color.domain())
                .rangeRound([marginLeft, width - marginRight]);

            svg.append("g")
                .selectAll("rect")
                .data(color.domain())
                .join("rect")
                .attr("x", x)
                .attr("y", marginTop)
                .attr("width", Math.max(0, x.bandwidth() - 1))
                .attr("height", height - marginTop - marginBottom)
                .attr("fill", color);

            tickAdjust = () => {};
        }

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x)
                .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
                .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
                .tickSize(tickSize)
                .tickValues(tickValues))
            .call(tickAdjust)
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", marginLeft)
                .attr("y", marginTop + marginBottom - height - 6)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(title));

        return svg.node();
    }

    ramp(colorFunc, n = 256) {

        var canvas = document.createElement('canvas');
        canvas.width = n;
        canvas.height = 1;
        const context = canvas.getContext("2d");
        for (let i = 0; i < n; ++i) {
            context.fillStyle = colorFunc(i / (n - 1));
            context.fillRect(i, 0, 1, 1);
        }
        return canvas;
    }

}

whenDocumentLoaded(() => {

    var geoJsonPath =
        'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/main/data/vaud/neighbourhoods.geojson';

    var infoPath =
        'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/main/data/vaud/listings-filtered.csv';

    var geojson = d3.json(geoJsonPath)
    var data = d3.csv(infoPath)

    Promise.all([geojson, data]).then(response => {

        var geojson = response[0];
        var listings = response[1].filter(l => l['price'] < 500);

        var features = {
            'price': 'Price ($)',
            'review_scores_value': 'Average Review Score / 10',
            'bedrooms': 'Bedrooms'
        };

        const chart1 = new ChoroPlot('plot1', 'legend1', geojson, listings, features, 'price');
        const chart2 = new ChoroPlot('plot2', 'legend2', geojson, listings, features, 'bedrooms');

        chart1.show();
        chart2.show();

        var button1Id = 'selectFeatureButton1',
            button2Id = 'selectFeatureButton2';

        const scatter = new ScatterPlot('plot3', listings, 'price', 'bedrooms',
            'selectFeatureButton1', 'selectFeatureButton2')

        scatter.show();

        initSelector(`#${button1Id}`, features, chart1, scatter);
        initSelector(`#${button2Id}`, features, chart2, scatter, reverse = true);

    }).catch(error => console.log(error));


});


function initSelector(id, features, chart, scatter, reverse = false) {

    var featureKeys = reverse ? Object.keys(features).reverse() : Object.keys(features);

    // add the options to the button
    d3.select(id)
        .selectAll('myOptions')
        .data(featureKeys)
        .enter()
        .append('option')
        .text(d => features[d]) // text showed in the menu
        .attr("value", d => d) // corresponding value returned by the button

    // When the button is changed, run the updateChart function
    d3.select(id).on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
        chart.update(selectedOption, features[selectedOption]);
        scatter.update();
    });
}