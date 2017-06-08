import React, { Component } from 'react';
import * as d3 from 'd3';

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.getDimensions = this.getDimensions.bind(this);
        this.renderChart = this.renderChart.bind(this);
        this.margin = { top: 20, right: 20, bottom: 20, left: 35 }
    }

    componentDidUpdate() {
        this.renderChart();
    }

    getDimensions() {
        return {
            width: this.chart.offsetWidth - this.margin.left - this.margin.right,
            height: this.props.height || '300' - this.margin.top - this.margin.bottom
        }
    }

    renderChart() {
        const chart = d3.select(this.chart),
            width = this.getDimensions().width,
            height = this.getDimensions().height,
            dx = this.props.keys[0],
            dy = this.props.keys[1],
            dz = this.props.keys[2]
            
        var entries = this.props.data;

        const data = d3.nest()
            .key(d => d[dx])
            .rollup(d => d3.sum(d, g => -g[dy]))
            .entries(entries);

        const svg = chart.select('svg')
            .attr('width', width + this.margin.left + this.margin.right)
            .attr('height', height + this.margin.top + this.margin.bottom);

        const bars = svg.select('g.bars')
        const xAxis = svg.select('g.axis.x-axis')
        const yAxis = svg.select('g.axis.y-axis')

        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.key))
            .padding(0.1);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([
                Math.min(0, d3.min(data, d => d.value)),
                Math.max(0, d3.max(data, d => d.value))
            ])
            .nice();
        
        bars.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.key))
            .attr('y', d => y(Math.max(0, d.value)))
            .attr('width', x.bandwidth())
            .attr('height', d => Math.abs(y(d.value) - y(0)))
            .attr('fill', '#00BCD4')
            .on('mouseover', d => {
               // add tooltip
            })
            .on('mouseout', d => {

            })
            .on('click', d => {
                // life state up 
            })


        xAxis.attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickSize(0))
            .select('path.domain')
            .remove();

        yAxis.call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(-width))
            .selectAll('line')
            .style('stroke-dasharray', '2, 2');

        yAxis.select('path.domain')
            .remove();
           
    }

    render() {
        console.log(this.props);
        return (
            <div ref={chart => this.chart = chart}>
                <svg>
                    <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
                        <g className="axis x-axis"></g>
                        <g className="axis y-axis"></g>
                        <g className="bars"></g>
                        <line></line>
                    </g>
                </svg>
            </div>
        )
    }
}
export default BarChart;