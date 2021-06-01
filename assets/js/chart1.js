// *******************//
//    IMPORTS         //
// *******************//
// import _ from 'lodash.js';

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
//     Map Plot      //
// *******************//
class MapPlot{

    constructor(id, legendId, geojson1, geojson2, geojson3, cities, data_vaud, data_geneva, data_zurich, features, places, times, place = 'Vaud', feature = 'price', time = 'June',  width = 350, height = 300) {

        this.id = id;
        
        // Initialisation:
        switch (place) {
            case 'Vaud':
                this.geojson = geojson1;
                this.listings = data_vaud[0];
                this.cities = cities[1];
                break;
            case 'Zurich':
                this.geojson = geojson3;
                this.listings = data_zurich[0];
                this.cities = cities[0];
                break;
            case 'Geneva':
                this.geojson = geojson2;
                this.listings = data_geneva[0];
                this.cities = cities[0];
                break;
            default:
                break;
        }
        
        // Keep cities and their locations:
        this.cities1 = cities[0]; 
        this.cities2 = cities[1]; 
        
        // Vaud:
        this.geojson1 = geojson1;
		this.data_vaud = data_vaud;
     
        // Geneva:
        this.geojson2 = geojson2;
		this.data_geneva= data_geneva;

        // Zurich:
        this.geojson3 = geojson3;
		this.data_zurich = data_zurich;

        // Geo place:
        this.places = places;
        this.place = place;
        
        // Features:
        this.features = features;
        this.updateFeature(feature);
        
        // Geo place:
        this.times = times;
        this.time = time;
        this.updateTime(this.time, this.place);

        
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
    
    updateTime(time, place) {
        this.time = time;
		this.place = place;
        switch (time) {
            case 'June':
                switch (this.place) {
                    case 'Vaud':
                        // update to June:
                        this.geojson = this.geojson1;
                        this.listings = this.data_vaud[0];
                        // cities locations without geneva, otherwise it comes on the map of vaud... 
                        this.cities = this.cities2;
                        break;
                    case 'Geneva':
                        // update to geneva:
                        this.geojson = this.geojson2;
                        this.listings = this.data_geneva[0];
                        this.cities = this.cities1;
                        break;
                    case 'Zurich':
                        // update to zurich:
                        this.geojson = this.geojson3;
                        this.listings = this.data_zurich[0];
                        this.cities = this.cities1;
                        break;
                    default:
                        break;
                }
				break;
            case 'July':
                switch (this.place) {
                    case 'Vaud':
                        // update to July:
                        this.geojson = this.geojson1;
                        this.listings = this.data_vaud[1];
                        // cities locations without geneva, otherwise it comes on the map of vaud... 
                        this.cities = this.cities2;
                        break;
                    case 'Geneva':
                        // update to geneva:
                        this.geojson = this.geojson2;
                        this.listings = this.data_geneva[1];
                        this.cities = this.cities1;
                        break;
                    case 'Zurich':
                        // update to zurich:
                        this.geojson = this.geojson3;
                        this.listings = this.data_zurich[1];
                        this.cities = this.cities1;
                        break;
                    default:
                        break;
                }
				break;
			case 'August':
                switch (this.place) {
                    case 'Vaud':
                        // update to July:
                        this.geojson = this.geojson1;
                        this.listings = this.data_vaud[2];
                        // cities locations without geneva, otherwise it comes on the map of vaud... 
                        this.cities = this.cities2;
                        break;
                    case 'Geneva':
                        // update to geneva:
                        this.geojson = this.geojson2;
                        this.listings = this.data_geneva[2];
                        this.cities = this.cities1;
                        break;
                    case 'Zurich':
                        // update to zurich:
                        this.geojson = this.geojson3;
                        this.listings = this.data_zurich[2];
                        this.cities = this.cities1;
                        break;
                    default:
                        break;
                }
				break;
			case 'September':
                switch (this.place) {
                    case 'Vaud':
                        // update to July:
                        this.geojson = this.geojson1;
                        this.listings = this.data_vaud[3];
                        // cities locations without geneva, otherwise it comes on the map of vaud... 
                        this.cities = this.cities2;
                        break;
                    case 'Geneva':
                        // update to geneva:
                        this.geojson = this.geojson2;
                        this.listings = this.data_geneva[3];
                        this.cities = this.cities1;
                        break;
                    case 'Zurich':
                        // update to zurich:
                        this.geojson = this.geojson3;
                        this.listings = this.data_zurich[3];
                        this.cities = this.cities1;
                        break;
                    default:
                        break;
                }
				break;
			case 'October':
                switch (this.place) {
                    case 'Vaud':
                        // update to July:
                        this.geojson = this.geojson1;
                        this.listings = this.data_vaud[4];
                        // cities locations without geneva, otherwise it comes on the map of vaud... 
                        this.cities = this.cities2;
                        break;
                    case 'Geneva':
                        // update to geneva:
                        this.geojson = this.geojson2;
                        this.listings = this.data_geneva[4];
                        this.cities = this.cities1;
                        break;
                    case 'Zurich':
                        // update to zurich:
                        this.geojson = this.geojson3;
                        this.listings = this.data_zurich[4];
                        this.cities = this.cities1;
                        break;
                    default:
                        break;
                }
				break;
			case 'November':
                switch (this.place) {
                    case 'Vaud':
                        // update to July:
                        this.geojson = this.geojson1;
                        this.listings = this.data_vaud[5];
                        // cities locations without geneva, otherwise it comes on the map of vaud... 
                        this.cities = this.cities2;
                        break;
                    case 'Geneva':
                        // update to geneva:
                        this.geojson = this.geojson2;
                        this.listings = this.data_geneva[5];
                        this.cities = this.cities1;
                        break;
                    case 'Zurich':
                        // update to zurich:
                        this.geojson = this.geojson3;
                        this.listings = this.data_zurich[5];
                        this.cities = this.cities1;
                        break;
                    default:
                        break;
                }
				break;
			case 'December':
                switch (this.place) {
                    case 'Vaud':
                        // update to July:
                        this.geojson = this.geojson1;
                        this.listings = this.data_vaud[6];
                        // cities locations without geneva, otherwise it comes on the map of vaud... 
                        this.cities = this.cities2;
                        break;
                    case 'Geneva':
                        // update to geneva:
                        this.geojson = this.geojson2;
                        this.listings = this.data_geneva[6];
                        this.cities = this.cities1;
                        break;
                    case 'Zurich':
                        // update to zurich:
                        this.geojson = this.geojson3;
                        this.listings = this.data_zurich[6];
                        this.cities = this.cities1;
                        break;
                    default:
                        break;
                }
				break;
            default:
                break;
        }
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
            .style("font", "10px sans-serif");

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
        if (this.place == 'Vaud') {
            var projection = d3.geoMercator().translate([-350, -100]).scale(14000).center([4.53, 47.3]);
            var path = d3.geoPath().projection(projection);
        }
        
        else if (this.place == 'Geneva') {
            var projection = d3.geoMercator().translate([-800, -800]).scale(35000).center([4.53, 47.3]);
            var path = d3.geoPath().projection(projection);
        }
        
        else if (this.place == 'Zurich') {
            var projection = d3.geoMercator().translate([100, 300]).scale(80000).center([8.5, 47.3]);
            var path = d3.geoPath().projection(projection);
        }
        
        this.svg
            .append('g').attr('id', 'map')
            .selectAll('path')
            .data(this.geojson.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'neighbourhood')
        
        // Add points with labels:
        this.svg.append("path")
        .datum(topojson.feature(this.cities, this.cities.objects.places))
        .attr("d", path)
        .attr("class", "place");
        
        this.svg.selectAll(".place-label")
        .data(topojson.feature(this.cities, this.cities.objects.places).features)
        .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });
        
        this.svg.selectAll(".place-label")
        .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
        .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; });

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

    update(option, legendText = 'Price', type = 'place') {
        switch (type) {
            case 'feature':
                this.updateFeature(option);
                break;
            case 'place':
                this.updateTime(this.time, option);
                this.updateFeature(this.feature);
                break;
            case 'time':
                this.updateTime(option, this.place);
                this.updateFeature(this.feature);
            default:
                break;
        }
        this.svg.selectAll("*").remove();
        this.show();
        this.fill();
        
        d3.select('svg#' + this.legendId)
        .selectAll('*')
        .remove()

        this.legend({
            selector: 'svg#' + this.legendId,
            color: this.colorScale,
            title: this.features[this.feature]
        });
        
        
    }

    legend({
        selector,
        color,
        title,
        tickSize = 16,
        width = 400,
        height = 60 + tickSize,
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

whenDocumentLoaded_(() => {

    var path = 'https://raw.githubusercontent.com/arnauddhaene/airbnb-visualized/main/data/'
    var geoJsonPath_Vaud = path+'vaud/neighbourhoods.geojson';
        
    var geoJsonPath_Geneve = path+'geneva/neighbourhoods.geojson';
    
    var geoJsonPath_Zurich = path+'zurich/neighbourhoods.geojson';

    var infoPath_Vaud = path+'vaud/listings-filtered_vaud.csv';
    var infoPath_Geneva = path+'geneva/listings-filtered_geneva.csv';
    var infoPath_Zurich = path+'zurich/listings-filtered_zurich.csv';
    
    var cities_location = path+'cities.json';
    
    var geojson_vaud = d3.json(geoJsonPath_Vaud)
    var geojson_geneva = d3.json(geoJsonPath_Geneve)
    var geojson_zurich = d3.json(geoJsonPath_Zurich)

    var data_vaud = d3.csv(infoPath_Vaud)
    var data_geneva = d3.csv(infoPath_Geneva)
    var data_zurich = d3.csv(infoPath_Zurich)
    
    // Listings info by month:
    var data_vaud_june = d3.csv(path+'vaud/listings-filtered_vaud_june.csv')
    var data_geneva_june = d3.csv(path+'geneva/listings-filtered_geneva_june.csv')
    var data_zurich_june = d3.csv(path+'zurich/listings-filtered_zurich_june.csv')
    
    var data_vaud_july = d3.csv(path+'vaud/listings-filtered_vaud_july.csv')
    var data_geneva_july = d3.csv(path+'geneva/listings-filtered_geneva_july.csv')
    var data_zurich_july = d3.csv(path+'zurich/listings-filtered_zurich_july.csv')
	
	var data_vaud_august = d3.csv(path+'vaud/listings-filtered_vaud_august.csv')
    var data_geneva_august = d3.csv(path+'geneva/listings-filtered_geneva_august.csv')
    var data_zurich_august = d3.csv(path+'zurich/listings-filtered_zurich_august.csv')    

	var data_vaud_september = d3.csv(path+'vaud/listings-filtered_vaud_september.csv')
    var data_geneva_september = d3.csv(path+'geneva/listings-filtered_geneva_september.csv')
    var data_zurich_september = d3.csv(path+'zurich/listings-filtered_zurich_september.csv')    
	
	var data_vaud_october = d3.csv(path+'vaud/listings-filtered_vaud_october.csv')
    var data_geneva_october = d3.csv(path+'geneva/listings-filtered_geneva_october.csv')
    var data_zurich_october = d3.csv(path+'zurich/listings-filtered_zurich_october.csv')    
	
	var data_vaud_november = d3.csv(path+'vaud/listings-filtered_vaud_november.csv')
    var data_geneva_november = d3.csv(path+'geneva/listings-filtered_geneva_november.csv')
    var data_zurich_november = d3.csv(path+'zurich/listings-filtered_zurich_november.csv')    
	
	var data_vaud_december = d3.csv(path+'vaud/listings-filtered_vaud_december.csv')
    var data_geneva_december = d3.csv(path+'geneva/listings-filtered_geneva_december.csv')
    var data_zurich_december = d3.csv(path+'zurich/listings-filtered_zurich_december.csv') 

    var cities_ = `{"type":"Topology","objects":{"places":{"type":"GeometryCollection","name":"ne_10m_populated_places","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}},"geometries":[{"type":"Point","properties":{"name":"Lausanne"},"coordinates":[1518,3107]},{"type":"Point","properties":{"name":"Zürich"},"coordinates":[7166,8099]},{"type":"Point","properties":{"name":"Geneva"},"coordinates":[0,1229]}]}},"arcs":[],"transform":{"scale":[0.0003360337661383773,0.0001705791570343072],"translate":[6.140028034091699,46.00038209948434]}}`; 
    
    var cities_vaud_ = `{"type":"Topology","objects":{"places":{"type":"GeometryCollection","name":"ne_10m_populated_places","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}},"geometries":[{"type":"Point","properties":{"name":"Lausanne"},"coordinates":[1518,3107]},{"type":"Point","properties":{"name":"Zürich"},"coordinates":[7166,8099]}]}},"arcs":[],"transform":{"scale":[0.0003360337661383773,0.0001705791570343072],"translate":[6.140028034091699,46.00038209948434]}}`;
    
    var cities_vaud = JSON.parse(cities_vaud_);
    var cities = JSON.parse(cities_);
    
    Promise.all([geojson_vaud, geojson_geneva, geojson_zurich, 
        cities, cities_vaud, 
		data_vaud_june, data_geneva_june, data_zurich_june, 
		data_vaud_july, data_geneva_july, data_zurich_july, 
		data_vaud_august, data_geneva_august, data_zurich_august, 
		data_vaud_september, data_geneva_september, data_zurich_september, 
		data_vaud_october, data_geneva_october, data_zurich_october, 
		data_vaud_november, data_geneva_november, data_zurich_november, 
		data_vaud_december, data_geneva_december, data_zurich_december]).then(response => {
        
		// Geojson infos:
        // Vaud:
        var geojson1 = response[0];
        
        // Geneva:
        var geojson2 = response[1];
        
        // Zurich:
        var geojson3 = response[2];
        
        // Cities locations: (cities of geneva and zurich, lausanne)
        var cities = [response[3], response[4]];		
        
        // Temporal data:
        var data_vaud_june = response[5].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_geneva_june = response[6].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_zurich_june = response[7].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        
        var data_vaud_july = response[8].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_geneva_july = response[9].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_zurich_july = response[10].filter(l => l['price'] <	 500&& l['maximum_nights'] < 1200 );

		var data_vaud_august = response[11].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_geneva_august = response[12].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_zurich_august = response[13].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
		
		var data_vaud_september = response[14].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_geneva_september = response[15].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_zurich_september = response[16].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
		
		var data_vaud_october= response[17].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_geneva_october = response[18].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_zurich_october = response[19].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
		
		var data_vaud_november= response[20].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_geneva_november = response[21].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_zurich_november = response[22].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
		
		var data_vaud_december = response[23].filter(l => l['price'] < 500 && l['maximum_nights'] < 1200 );
        var data_geneva_december = response[24].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
        var data_zurich_december = response[25].filter(l => l['price'] < 500&& l['maximum_nights'] < 1200 );
		
		var data_zurich = [data_zurich_june, data_zurich_july, data_zurich_august, 
							data_zurich_september, data_zurich_october, data_zurich_november,data_zurich_december ];
		var data_geneva = [data_geneva_june, data_geneva_july, data_geneva_august, 
							data_geneva_september, data_geneva_october, data_geneva_november, data_geneva_december];
		var data_vaud = [data_vaud_june, data_vaud_july, data_vaud_august, 
						data_vaud_september, data_vaud_october, data_vaud_november,data_vaud_december ];
		var features = {
            'price': 'Price ($)',
            'minimum_nights': 'Minimum number of nights',
			'maximum_nights':'Maximum number of nights',
            'number_of_reviews': 'Number of reviews'
        };
            
        var times = {
                'June': 'June',
                'July':'July', 
				'August':'August', 
				'September':'September', 
				'October':'October',
				'November':'November',
				'December':'December'	
            };
       
        const map4 = new MapPlot('plot4', 'legend4', geojson1, geojson2,  geojson3, cities, data_vaud, data_geneva, data_zurich, features, places, times, place = 'Vaud', feature ='price', time = 'June');

        map4.show();

        var button1Id = 'selectPlaceButton4';
        
        var button2Id = 'selectFeatureButton4';
        
        var button3Id = 'selectTimeButton4';

        var places = {
            'Vaud': 'Vaud',
            'Geneva':'Geneva',
            'Zurich':'Zurich'
        };
            
        initSelectorPlace_(`#${button1Id}`, places, map4);
        initSelector_(`#${button2Id}`, features, map4);
        initSelectorTime_(`#${button3Id}`, times, map4)

    }).catch(error => console.log(error));
    


});

function initSelectorPlace_(id, places, chart, reverse = false) {
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
        //chart.update_place(selectedOption, 'Price');
        chart.update(selectedOption, legendText = 'Price', type = 'place');
    });
}


function initSelector_(id, features, chart, reverse = false) {

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
        chart.update(selectedOption, features[selectedOption], type = 'feature');
    });
}

function initSelectorTime_(id, features, chart, reverse = false) {
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
        chart.update(selectedOption, legendText = 'Price', type = 'time');
    });
}