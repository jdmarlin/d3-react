import React, { Component } from 'react';
import * as d3 from 'd3';

import './bar-chart.css';

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.getDimensions = this.getDimensions.bind(this);
        this.renderChart = this.renderChart.bind(this);
        this.tooltip = this.tooltip.bind(this);
        this.click = this.click.bind(this);
        this.margin = { top: 20, right: 20, bottom: 20, left: 55 }
    }

    componentDidUpdate() {
        if (this.props.data) {
            this.renderChart();
        }
    }

    getDimensions() {
        return {
            width: this.chart.offsetWidth - this.margin.left - this.margin.right,
            height: this.props.height || '300' - this.margin.top - this.margin.bottom
        }
    }

    tooltip(key, value, show) {
        const tooltip = d3.select(this.chart).select('div.Tooltip');
        tooltip.select('span.key').text(key);
        tooltip.select('span.value').text(value.toLocaleString());

        const w = tooltip.node().getBoundingClientRect().width,
            h = tooltip.node().getBoundingClientRect().height,
            x = d3.event.pageX - (w / 2),
            y = d3.event.pageY - h - 15,
            y2 = d3.event.pageY - h - 60

        if (show) {
            tooltip.classed('show', true)

            tooltip.style('left', `${x}px`)
            tooltip.transition().style('top', `${y}px`).duration(0)
        } else {
            tooltip.classed('show', false)
            tooltip.transition().delay(300).style('top', `${y2}px`).duration(150)
        }
    }

    click(bar) {
        this.props.filter(bar)
    }

    renderChart() {
        const chart = d3.select(this.chart),
            width = this.getDimensions().width,
            height = this.getDimensions().height,
            dx = this.props.keys[0],
            dy = this.props.keys[1],
            dz = this.props.keys[2]

        var entries = this.props.data;

        var keys = this.props.filterState ? Object.keys(this.props.filterState) : [];

        keys.forEach(key => {
            entries = entries.filter(d => this.props.filterState[key].indexOf(d[key]) > -1)
        })

        const data = d3.nest()
            .key(d => d[dx])
            .rollup(d => d3.sum(d, g => g[dy]))
            .entries(entries)
            .sort((a, b) => d3.ascending(a.value, b.value));

        const svg = chart.select('svg')
            .attr('width', width + this.margin.left + this.margin.right)
            .attr('height', height + this.margin.top + this.margin.bottom);

        const bars = svg.select('g.bars').selectAll('rect').data(data),
            yAxis = svg.select('g.axis.y-axis'),
            xAxis = svg.select('g.axis.x-axis')

        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.key))
            .padding(0.05);

        const y = d3.scaleLinear()
            .rangeRound([height, 0])
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
            .merge(bars)
            .attr('class', 'bar')
            .attr("x", d => data.length === 1 ? width / 4 : x(d.key))
            .attr('y', d => y(0))
            .attr('width', Math.min(x.bandwidth(), width / 2))
            .attr('height', 0)
            .attr('fill', '#00BCD4')
            .on('click', d => {
                this.tooltip(d.key, d.value, 0);
                this.click({ key: dx, value: d.key, ctrl: d3.event.ctrlKey });
            })
            .on('mousemove', d => {
                this.tooltip(d.key, d.value, 1);
            })
            .on('mouseout', d => {
                this.tooltip(d.key, d.value, 0);
            })
            .transition()
            .attr('y', d => y(Math.max(0, d.value)))
            .attr('height', d => Math.abs(y(d.value) - y(0)))
            .duration(300)

        svg.select('line.axis.zero-axis')
            .attr('x1', 0)
            .attr('y1', y(0))
            .attr('x2', width)
            .attr('y2', y(0))
            .style('stroke', 'black')
            .style('stroke-width', 1);

        xAxis.attr('transform', `translate(0, ${y(0)})`).transition().call(d3.axisBottom(x)
            .tickSize(0))

        xAxis.on('click', d => {
            console.log(d3.event.target.innerHTML + dx)
        })


        yAxis.transition().call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(-width)
            .tickFormat(d => {
                let s = d;
                let max = Math.max(Math.abs(y.domain()[0]), Math.abs(y.domain()[1]))
                if (max > 1e12) { s = d / 1e12 } else
                    if (max > 1e9) { s = d / 1e9 } else
                        if (max > 1e6) { s = d / 1e6 } else
                            if (max > 1e3) { s = d / 1e3 }
                return d3.format('.1f')(s);
            }))
            .duration(150)
            .selectAll('line')
            .attr('opacity', '0.5')
            .style('stroke-dasharray', '2,2')

        yAxis.select('path.domain')
            .remove();

    }

    render() {
        return (
            <div ref={chart => this.chart = chart} className="BarChart">
                <div className="Tooltip">
                    <span className="key"></span><br />
                    <span className="value"></span>
                </div>
                <svg>
                    <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
                        <g className="axis y-axis"></g>
                        <g className="bars"></g>
                        <g className="axis x-axis"></g>
                        <line className="axis zero-axis"></line>
                    </g>
                </svg>
            </div>
        )
    }
}
export default BarChart;
