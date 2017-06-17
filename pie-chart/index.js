import React, { Component } from 'react';
import Chart from './pie-chart';
import * as d3 from 'd3';

export default class LineChart extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div ref={ref => this.chart = ref} >
                <Chart
                    chart={this.chart}
                    height={this.props.height}
                    data={this.props.data}
                    keys={this.props.keys} />
            </div>
        )
    }
}