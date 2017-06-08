import React, { Component } from "react";
import './tooltip.css';

class Tooltip extends Component {
    constructor(props) {
        super(props);
        this.formatNumber = this.formatNumber.bind(this);
        this.formatText = this.formatText.bind(this);
    }

    formatNumber(number) {
        if (number) {
            return number.toLocaleString();
        }
    }

    // from camel case to readable
    formatText(text) {
        if (!text) {
            return text;
        }
        text = text.trim();
        var newText = '';
        for (var i = 0; i < text.length; i++) {
            if (/[A-Z]/.test(text[i]) && i != 0 && /[a-z]/.test(text[i - 1])) {
                newText += ' ';
            }
            if (i == 0 && /[a-z]/.test(text[i])) {
                newText += text[i].toUpperCase();
            } else {
                newText += text[i];
            }
        }

        return newText;
    }

    render() {
        let width = this.tooltip ? this.tooltip.clientWidth : 110;
        let height = this.tooltip ? this.tooltip.clientHeight : 110;
        let dx = this.formatText(this.props.tooltip.dx)
        let key = this.formatText(this.props.tooltip.key)
        let value = this.formatNumber(this.props.tooltip.value)
        let x = (this.props.mouse[0] || 0) - width / 2
        let y = this.props.mouse[1] - (height - 5)
        return (
            <div ref={tooltip => this.tooltip = tooltip} className="Tooltip" style={{ transform: `translate(${x}px, ${y}px)` }}>
                <span className="dx">{dx}</span>
                <br />
                <span className="key">{key} </span>
                <span className="value">{value}</span>
            </div>
        );
    }
}
export default Tooltip;