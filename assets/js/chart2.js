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

    constructor(id, listings, featureX, featureY, button1Id, button2Id, width = 300, height = 500) {

        this.button1Id = button1Id, this.button2Id = button2Id;

        this.location = 'romandie';

        this.listings = listings, this.featureX = featureX, this.featureY = featureY;

        this.margin = { top: 60, right: 30, bottom: 45, left: 50 };

        this.width = width - this.margin.left - this.margin.right;
        this.height = height - this.margin.top - this.margin.bottom;

        this.svg = d3.select("#" + id)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .classed('svg-content-responsive', true)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");

    }

    filteredListings() {

        if (this.location == 'romandie') {
            return this.listings.filter(l => (l['region'] == 'Geneva') || (l['region'] == 'Vaud') );
        } else if (this.location == 'zurich') {
            return this.listings.filter(l => l['region'] == 'Zurich');
        } else {
            return {}
        }

    }

    show() {

        // Prepare canvas
        this.svg
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.addAxes('Price ($)', 'Bedrooms')

        this.addPoints(this.featureX, this.featureY)

    }

    addAxes(xlabel, ylabel) {

        var tempListings = this.filteredListings()
            .filter(l => l[this.featureX] != NaN)
            .filter(l => l[this.featureY] != NaN);

        var minToMaxX = [d3.min(tempListings, l => +l[this.featureX]), d3.max(tempListings, l => +l[this.featureX])]
        var minToMaxY = [d3.min(tempListings, l => +l[this.featureY]), d3.max(tempListings, l => +l[this.featureY])]

        this.regression = d3.regressionLinear()
            .x(l => +l[this.featureX])
            .y(l => +l[this.featureY])
            .domain(minToMaxX);

        // Add X axis
        this.x = d3.scaleLinear()
            .domain(minToMaxX)
            .range([0, this.width]);

        this.svg.append("g")
            .attr('id', 'xAxis')
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));

        // Add x Axis
        this.svg.append("text")
            .attr('id', 'xAxisLabel')
            .attr("transform", `translate(${this.width / 2}, ${this.height + this.margin.top / 1.5})`)
            .style("text-anchor", "middle")
            .text(xlabel)

        // Add Y axis
        this.y = d3.scaleLinear()
            .domain(minToMaxY)
            .range([this.height, 0]);

        this.svg.append("g")
            .attr('id', 'yAxis')
            .call(d3.axisLeft(this.y));

        // Add y Axis
        this.svg.append("text")
            .attr('id', 'yAxisLabel')
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.margin.left)
            .attr("x", 0 - (this.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(ylabel);
    }

    addPoints(featureX, featureY) {

        // Add dots
        this.svg.append('g')
            .attr('id', 'chart')
            .selectAll("dot")
            .data(this.filteredListings())
            .enter()
            .append("circle")
            .attr("cx", d => this.x(d[featureX]))
            .attr("cy", d => this.y(d[featureY]))
            .attr("r", 1.5)
            .style("fill", "#162b5d");

        this.svg.select('#chart')
            .append('line')
            .attr('class', 'regression')
            .datum(this.regression(this.listings))
            .attr("x1", d => this.x(d[0][0]))
            .attr("x2", d => this.x(d[1][0]))
            .attr("y1", d => this.y(d[0][1]))
            .attr("y2", d => this.y(d[1][1]));

        this.svg.select('#chart')
            .append('text')
            .attr('id', 'rSquaredText')
            .attr('x', this.width - this.margin.left)
            .attr('y', this.margin.top)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text(`R-squared: ${this.regression(this.listings).rSquared.toFixed(3)}`)
    }

    update() {

        var button1 = document.getElementById(this.button1Id);
        var button2 = document.getElementById(this.button2Id);

        this.featureX = button1.value;
        this.featureY = button2.value;

        this.svg.select('#xAxis')
            .remove()
        this.svg.select('#xAxisLabel')
            .remove()

        this.svg.select('#yAxis')
            .remove()
        this.svg.select('#yAxisLabel')
            .remove()

        this.addAxes(button1.options[button1.selectedIndex].text, button2.options[button2.selectedIndex].text)

        this.svg.select('#chart')
            .remove()

        this.addPoints(this.featureX, this.featureY)

    }

    updateLocation(location) {

        this.location = location;

        this.update();

    }

}

// *******************//
//     ChoroPlot      //
// *******************//
class ChoroPlot {

    constructor(id, otherId, legendId, geojson, format, listings, features, feature, width = 300, height = 400) {

        this.id = id;
        this.otherId = otherId;

        this.geojson = geojson;
        this.format = format;
        this.location = 'romandie'

        this.listings = listings;

        this.features = features;

        this.updateFeature(feature.value);

        this.width = width;
        this.height = height;

        this.svg = d3.select("#" + this.id)
            .classed('svg-content-responsive', true)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + this.width + " " + this.height)

        this.legendId = legendId
        this.legendText = feature.text
    }

    updateFeature(feature) {
        this.feature = feature;

        var tempListings = this.listings.filter(l => (l[this.feature] != NaN) && (l[this.feature] != 0.0));

        this.minToMax = [d3.min(tempListings, l => +l[this.feature]), d3.max(tempListings, l => +l[this.feature])]
        
        
        const colorGradient = (this.id == 'plot1') ? ["lightgreen", "blue"] : ["yellow", "purple"];

        this.colorScale = d3.scaleLinear()
            .domain(this.minToMax)
            .range(colorGradient);

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

        var projection = d3.geoMercator()
            .translate([this.width / 2, this.height / 2])
            .scale(this.format[this.location].scale)
            .center(d3.geoCentroid(this.geojson[this.location]));

        var path = d3.geoPath().projection(projection);

        this.svg
            .append('g').attr('id', 'map')
            .selectAll('path')
            .data(this.geojson[this.location].features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'neighbourhood')

        this.fill()

        var tooltip = this.svg.append('g');

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
                .style("stroke", "red");

            d3.select(`#${this.otherId}`)
                .select('#map')
                .selectAll('.neighbourhood')
                .filter(p => p.properties.neighbourhood == d.properties.neighbourhood)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "red");
        }

        let handleMouseLeave = (_, d) => {

            tooltip.call(this.callout, null);

            this.svg.select('#map')
                .selectAll('.neighbourhood')
                .filter(p => p.properties.neighbourhood == d.properties.neighbourhood)
                .transition()
                .duration(200)
                .style("opacity", 0.8)
                .style("stroke", "rgb(101, 99, 99)");

            d3.select(`#${this.otherId}`)
                .select('#map')
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
            title: this.features[this.feature],
            width: this.width - 100
        });

    }

    updateLegend(legendText) {
        
        this.legendText = legendText;

        d3.select('svg#' + this.legendId)
        .selectAll('*')
        .remove()

        this.legend({
            selector: 'svg#' + this.legendId,
            color: this.colorScale,
            title: this.legendText,
            width: this.width - 100
        });

    }

    update(option, legendText) {


        this.updateFeature(option);

        this.fill();
        
        this.updateLegend(legendText);

    }

    updateLocation(location) {

        this.location = location;

        this.svg.select('#map')
            .remove();

        this.show();

        this.updateLegend(this.legendText);

    }



    legend({
        selector,
        color,
        title,
        tickSize = 6,
        width = 250,
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

    var geoJsonPathRomandie =
        'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/main/data/neighbourhoods-combined.geojson';

    var geoJsonPathZurich =
        'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/main/data/zurich/neighbourhoods.geojson';

    var infoPath =
        'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/main/data/listings-filtered.csv';

    var geojsonRomandie = d3.json(geoJsonPathRomandie);
    var geojsonZurich = d3.json(geoJsonPathZurich);
    var data = d3.csv(infoPath);

    Promise.all([geojsonRomandie, geojsonZurich, data]).then(response => {

        const geojsonRomandie = response[0];
        const geojsonZurich = response[1];

        const geojson = { 'romandie': geojsonRomandie, 'zurich': geojsonZurich };

        const listings = response[2].filter(l => l['price'] < 500);

        const features = {
            'price': 'Price ($/night)',
            'review_scores_value': 'Average Review Score / 10',
            'beds': 'Beds',
            'accommodates': 'Accomodation (persons)',
            'amenities_count': 'Amenities (per listing)',
            'maximum_nights': 'Maximum stay (nights)',
            'minimum_nights': 'Minimum stay (nights)',
            'host_acceptance_rate': 'Host acceptance rate (%)',
            'bedrooms': 'Bedrooms'
        };

        const format = { 
            'zurich': {
                'scale': 90000,
            },
            'romandie': {
                'scale': 12000,
            }, 
        }

        const feature1 = { 'value': 'price', 'text': 'Price ($/night)'};
        const feature2 = { 'value': 'bedrooms', 'text': 'Bedrooms'};

        const chart1 = new ChoroPlot('plot1', 'plot2', 'legend1', geojson, format, listings, features, feature1);
        const chart2 = new ChoroPlot('plot2', 'plot1', 'legend2', geojson, format, listings, features, feature2);

        chart1.show();
        chart2.show();

        var button1Id = 'selectFeatureButton1',
            button2Id = 'selectFeatureButton2',
            locationButtonId = 'selectLocationButton';

        const scatter = new ScatterPlot('plot3', listings, 'price', 'bedrooms',
            'selectFeatureButton1', 'selectFeatureButton2')

        scatter.show();

        initSelector(`#${button1Id}`, features, chart1, scatter);
        initSelector(`#${button2Id}`, features, chart2, scatter, reverse = true);

        initLocationSelector(`#${locationButtonId}`, chart1, chart2, scatter)

    }).catch(error => console.log(error));


});

function initLocationSelector(id, chart1, chart2, scatter) {

    // Options
    const features = { 'romandie': 'French Switzerland', 'zurich': 'Zurich' }

    // add the options to the button
    d3.select(id)
        .selectAll('locationOptions')
        .data(Object.keys(features))
        .enter()
        .append('option')
        .text(d => features[d]) // text showed in the menu
        .attr("value", d => d) // corresponding value returned by the button

    // When the button is changed, run the updateChart function
    d3.select(id).on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
        chart1.updateLocation(selectedOption);
        chart2.updateLocation(selectedOption);
        scatter.updateLocation(selectedOption);
    });
}


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