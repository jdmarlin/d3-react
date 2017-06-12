import React from 'react';
import * as d3 from 'd3';

const margin = { top: 20, right: 20, bottom: 20, left: 55 }

var data


const AxisX = (props) => {
    return (
        <g className="axis x-axis" transform={`translate(0, height)`}></g>
    )
}

const AxisY = (props) => {
    return (
        <g></g>
    )
}

const Line = (props) => {
    return (
        <path></path>
    )
}

const Chart = (props) => (
    <div>
        <svg height={props.height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <AxisX />
                <AxisY />
                <Line />
            </g>
        </svg>

    </div>
)

export default Chart