import { select } from "https://cdn.skypack.dev/d3-selection";
import { updateCharts } from "./script.js";
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-bar-chart
function StackedBarChart(data, {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 20, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 600, // outer width, in pixels
    height = 400, // outer height, in pixels
    xDomain, // array of x-values
    xRange = [marginLeft, width - marginRight], // [left, right]
    xPadding = 0.1, // amount of x-range to reserve to separate bars
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    zDomain, // array of z-values
    offset = d3.stackOffsetDiverging, // stack offset method
    order = d3.stackOrderNone, // stack order method
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    colors = d3.schemeTableau10, // array of colors
} = {}) {

    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const Z = d3.map(data, z);

    // Compute default x- and z-domains, and unique them.
    if (xDomain === undefined) xDomain = X;
    if (zDomain === undefined) zDomain = Z;
    xDomain = new d3.InternSet(xDomain);
    zDomain = new d3.InternSet(zDomain);

    // Omit any data not present in the x- and z-domains.
    const I = d3.range(X.length).filter(i => xDomain.has(X[i]) && zDomain.has(Z[i]));

    // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
    // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
    // each tuple has an i (index) property so that we can refer back to the
    // original data point (data[i]). This code assumes that there is only one
    // data point for a given unique x- and z-value.
    const series = d3.stack()
        .keys(zDomain)
        .value(([x, I], z) => Y[I.get(z)])
        .order(order)
        .offset(offset)
        (d3.rollup(I, ([i]) => i, i => X[i], i => Z[i]))
        .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));
    // Compute the default y-domain. Note: diverging stacks can be negative.
    if (yDomain === undefined) yDomain = d3.extent(series.flat(2));

    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
    const yScale = yType(yDomain, yRange);
    const color = d3.scaleOrdinal(zDomain, colors);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);

    // Compute titles.
    if (title === undefined) {
        const formatValue = yScale.tickFormat(100, yFormat);
        title = i => `${X[i]}\n${Z[i]}\n${formatValue(Y[i])}`;
    } else {
        const O = d3.map(data, d => d);
        const T = title;
        title = i => T(O[i], i, data);
    }

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft+10)
            .attr("y", 20)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    const bar = svg.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
            .attr("fill", ([{i}]) => color(Z[i]))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", ({i}) => xScale(X[i]))
        .attr("y", ([y1, y2]) => Math.min(yScale(y1), yScale(y2)))
        .attr("height", ([y1, y2]) => Math.abs(yScale(y1) - yScale(y2)))
        .attr("width", xScale.bandwidth())
        .on('click', (element) => {
            //console.log(selectedGenre)
            //console.log(element)
            
            let randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
            
            let selectedGenre = element.target.textContent.split('\n')[1]
            d3.selectAll('#rect_viz rect').filter((d, i) => data[i].genre == selectedGenre).attr("fill", randomColor)
            
            let requestBody = {trait : "Genre", replace : "True", table : {[selectedGenre] : randomColor}}

            let request = new XMLHttpRequest();
            request.open("PUT", "http://127.0.0.1:5000/set-colors/")
            request.send(JSON.stringify(requestBody))
            request.onload = () => {
                console.log("Updating Charts")
                updateCharts("Bar");
            }

        })
        .on("mouseover", (element) => {
            let selectedGenre = element.target.textContent.split('\n')[1]
            console.log(selectedGenre);
            d3.selectAll('#rect_viz rect').filter((d, i) => data[i].genre == selectedGenre).style("opacity", 1);
            d3.selectAll('#rect_viz rect').filter((d, i) => data[i].genre != selectedGenre).style("opacity", 0.4);
        })
        .on("mouseleave", (element) => {
            let selectedGenre = element.target.textContent.split('\n')[1]
            d3.selectAll('#rect_viz rect').filter((d, i) => data[i].genre != selectedGenre).style("opacity", 1);
        });

    if (title) bar.append("title")
        .text(({i}) => title(i));

    svg.append("g")
        .style("font-size", "8px")
        .attr("transform", `translate(0,${yScale(0)})`)
        .call(xAxis);

    
    return Object.assign(svg.node(), {scales: {color}});
}

export default function updateBar(){
    let request = new XMLHttpRequest();
    request.open("GET", "http://127.0.0.1:5000/bar-chart/")
    request.send();
    request.onload = () => { 
        console.log("GOT DATA");
        console.log(JSON.parse(request.response));
        let response = JSON.parse(request.response)
        let colors = response[0];
        let data = response[1];

        let genres = Object.keys(data[0])
        genres.splice(genres.length-1, 1)
        let strategies = genres.flatMap(genre => data.map(d => ({month: d.month, genre, plays: d[genre]})))
        console.log(strategies)

        function compareMonths(date){
            const monthsArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
            let monthYear = date.month.split('-');
            let month = -1;
            for(let i=0;i<monthsArray.length;i++){
                if (monthsArray[i] == monthYear[0]){
                    month = i;
                    break;
                }
            }
            //console.log(monthYear)
            //console.log(`${date.month} = ${month + (Number(monthYear[1])*10)}`)
            return month + (Number(monthYear[1])*10)
        }

        let colorArray = d3.schemeSpectral[genres.length]
        for(let i=0; i<colorArray.length; i++)
            if(colors[genres[i]] !== null)
                colorArray[i] = colors[genres[i]];
        console.log(genres)


        let chart = StackedBarChart(strategies, {
            x: d => d.month,
            y: d => d.plays,
            z: d => d.genre,
            xDomain: d3.groupSort(strategies, (D) => {return compareMonths(D[0]);}, d => d.month),
            yLabel: "Listens",
            zDomain: genres,
            colors: d3.schemeSpectral[genres.length],
            //colors: ["#ffffff","#eeeeee","#dddddd","#cccccc","#dddddd",],
            width : 425,
            height: 385
        })

        chart.id = "bar-chart"
        chart.classList.add("dataviz")
        let area = document.getElementById("rect_viz");
        area.innerHTML = "";
        area.appendChild(chart)
    }
}
updateBar()