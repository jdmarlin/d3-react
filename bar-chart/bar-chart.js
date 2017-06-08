import React, { Component } from 'react';
import * as d3 from 'd3';

import Tooltip from '../tooltip'
import './bar-chart.css';

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.getDimensions = this.getDimensions.bind(this);
        this.renderChart = this.renderChart.bind(this);
        this.tooltip = this.tooltip.bind(this);
        this.margin = { top: 20, right: 20, bottom: 20, left: 45 }
        this.state = {
            tooltip: {},
            mouse: []
        }
    }

    componentDidUpdate() {
        if (this.props.data) {
            this.renderChart();
        }
        else {
            console.warn('gimme some data :)')
        }
    }

    getDimensions() {
        return {
            width: this.chart.offsetWidth - this.margin.left - this.margin.right,
            height: this.props.height || '300' - this.margin.top - this.margin.bottom
        }
    }

    tooltip(dx, key, value, mouse) {
        let x = mouse[0] + this.margin.left;
        let y = mouse[1]
        this.setState({
            tooltip: { dx, key, value },
            mouse: [x, y]
        })
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
            .rollup(d => d3.sum(d, g => g[dy]))
            .entries(entries)
            .sort((a, b) => d3.ascending(a.value, b.value));

        const svg = chart.select('svg')
            .attr('width', width + this.margin.left + this.margin.right)
            .attr('height', height + this.margin.top + this.margin.bottom);

        const bars = svg.select('g.bars').selectAll('rect').data(data)
        const xAxis = svg.select('g.axis.x-axis').selectAll('text').data(data)

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

        bars.exit()
            .transition()
            .attr('y', d => y(0))
            .attr('height', 0)
            .remove()
            .duration(150)

        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr("x", d => data.length === 1 ? width / 4 : x(d.key))
            .attr('y', d => y(0))
            .attr('width', Math.min(x.bandwidth(), width / 2))
            .attr('height', 0)
            .attr('fill', '#00BCD4')
            .on('click', d => {
                // lift state up 
            })
            .on('mousemove', d => {
                let mouse = d3.mouse(d3.event.currentTarget)
                this.tooltip(dx, d.key, d.value, mouse);
            })
            .on('mouseout', d => {

            })
            .transition()
            .attr('y', d => y(Math.max(0, d.value)))
            .attr('height', d => Math.abs(y(d.value) - y(0)))
            .duration(300)

        svg.select('g').append('line')
            .attr('x1', 0)
            .attr('y1', y(0))
            .attr('x2', width)
            .attr('y2', y(0))
            .style('stroke', '#333')
            .style('stroke-width', 2);

        xAxis.exit()
            .transition()
            .remove()
            .duration(150)

        xAxis.enter()
            .append('text')
            .merge(xAxis)
            .attr('x', d => x(d.key) + x.bandwidth() / 2)
            .attr('y', d => y(0) + 12)
            .attr('text-anchor', 'middle')
            .attr('width', x.bandwidth())
            .text(d => d.key)
            .on('click', d => {
            })
            .on('mousemove', d => {
                let mouse = d3.mouse(d3.event.currentTarget)
                this.tooltip(dx, d.key, d.value, mouse);
            })
            .on('mouseleave', d => {
            })

        yAxis.call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(-width)
            .tickFormat(d3.format('.3s')))
            .selectAll('line')
            .attr('opacity', '0.3')
            .style('stroke-dasharray', '2,2');

        yAxis.select('path.domain')
            .remove();

    }

    render() {
        return (
            <div ref={chart => this.chart = chart} className="BarChart">
                <Tooltip tooltip={this.state.tooltip} mouse={this.state.mouse} />
                <svg>
                    <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
                        <g className="axis y-axis"></g>
                        <g className="bars"></g>
                        <g className="axis x-axis"></g>
                    </g>
                </svg>
            </div>
        )
    }
}
export default BarChart;
