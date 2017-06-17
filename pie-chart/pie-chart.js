import React from 'react';
import * as d3 from 'd3';

const margin = { top: 20, bottom: 20, left: 55, right: 10 }

const getDimensions = (props) => {
    var width = props.chart ? props.chart.offsetWidth : 300;
    var height = props.height || 300

    return {
        width: width,
        height: height
    }
}

const nestData = (props) => {
    var data = props.data
    var dx = props.keys[0]
    var dy = props.keys[1]

    return d3.nest()
        .key(d => d[dx])
        .rollup(d => d3.sum(d, g => g[dy]))
        .entries(data)
}

const Chart = (props) => {
    var width = getDimensions(props).width
    var height = getDimensions(props).height
    var radius = Math.min(width, height) / 2

    var data = nestData(props)
    var color = d3.scaleOrdinal(d3.schemeCategory10)

    var pie = d3.pie()
        .sort(null)
        .value(d => d.value)

    var data = pie(data)

    var path = d3.arc()
        .innerRadius(0)
        .outerRadius(100)

    var arc = data.map((d, i) => {
        return (
            <path className="arc" key={`arc-${d.data.key}`} d={path(d)} fill={color(i)}></path>
        )
    })

    return (
        <svg width={width} height={height}>
            <g transform={`translate(${width / 2},${height / 2})`}>
                <g>
                    {arc}
                </g>
            </g>x``
        </svg>
    )
}
export default Chart;