import React from 'react';
import * as d3 from 'd3';

const margin = { top: 20, right: 20, bottom: 20, left: 55 }

const getDimensions = {
    width: (chart) => chart != undefined ? (chart.offsetWidth - margin.left - margin.right) : 1000,
    height: (props = 300) => props
}

const nestData = (props) => {
    const dx = props.keys[0],
        dy = props.keys[1],
        dz = props.keys[2],
        keys = Object.keys(props.filterState);

    var entries = props.data;

    keys.forEach(key => {
        entries = entries.filter(d => props.filterState[key].indexOf(d[key]) > -1)
    })

    var nest = [];

    var testData = d3.nest()
        .key(d => d[dx])
        .sortKeys(d3.ascending)
        .key(d => d[dz])
        .rollup(d => d3.sum(d, g => g[dy]))
        .entries(entries);

    testData.forEach(d => {
        d.values.forEach(i => {
            nest.push({
                key: d.key,
                value: i.value,
                z: i.key
            })
        })
    })

    var data = d3.nest()
        .key(d => d[dx])
        .sortKeys(d3.ascending)
        .rollup(d => d3.sum(d, g => g[dy]))
        .entries(entries)

    var parseTime = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ')



    nest.forEach(d => {
        d.key = parseTime(d.key)
    })

    data.forEach(d => {
        d.key = parseTime(d.key)
    })

    return data;
}

const XAxis = (props) => {
    const x = d3.scaleTime()
        .rangeRound([0, props.width])
        .domain(d3.extent(props.data, d => d.key))

    const xAxis = d3.select(props.chart).select('g.axis.x-axis')
        .call(d3.axisBottom(x).tickSize(0))

    return (
        <g transform={`translate(0, ${props.height})`} className="axis x-axis">

        </g>
    )
}

const YAxis = (props) => {
    const y = d3.scaleLinear()
        .rangeRound([props.height, 0])
        .domain(d3.extent(props.data, d => d.value))

    const yAxis = d3.select(props.chart).select('g.axis.y-axis')
        .call(d3.axisLeft(y))

    return (
        <g className="axis y-axis"></g>
    )
}

const Line = (props) => {
    var chart = d3.select(props.chart)

    const x = d3.scaleTime()
        .rangeRound([0, props.width])
        .domain(d3.extent(props.data, d => d.key))

    const y = d3.scaleLinear()
        .rangeRound([props.height, 0])
        .domain(d3.extent(props.data, d => d.value))

    const line = d3.line()
        .defined(d => d.key)
        .x(d => x(d.key))
        .y(d => y(d.value))

    const path = chart.select('path.lines')

    path.datum(props.data)
        .attr('fill', 'none')
        .attr('stroke', 'lightcoral')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 2.5)
        .attr('d', line);

    return (
        <path className="lines"></path>
    )
}

const LineChart = (props) => {
    const chart = this.chart;

    const width = getDimensions.width(chart);
    const height = getDimensions.height(props.height);

    const svg = d3.select(chart).select('svg')
        .attr('width', width + margin.top + margin.bottom)
        .attr('height', height + margin.left + margin.right);


    const data = nestData(props);

    return (
        <div ref={(ref) => { this.chart = ref }} className="LineChart">
            <svg>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <XAxis chart={chart} data={data} width={width} height={height} />
                    <YAxis chart={chart} data={data} width={width} height={height} />
                    <Line chart={chart} data={data} width={width} height={height} />
                </g>
            </svg>
        </div>
    )
}
export default LineChart;