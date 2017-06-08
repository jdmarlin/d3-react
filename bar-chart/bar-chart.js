import React, { Component } from 'react';
import * as d3 from 'd3';

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.renderChart = this.renderChart.bind(this);
    }

    componentDidUpdate() {
        this.renderChart();
    }

    renderChart() {
        console.log('hi')
    }

    render() {
        return (
            <div>
                Hello :)
            </div>
        )
    }
}
export default BarChart;