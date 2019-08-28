import React, { Component, Fragment } from 'react';
import { default as OriginalCountUp } from "react-countup";
import { default as FormatNumber } from 'format-number';

var numberFormatter = FormatNumber({ prefix: "R$ ", decimal: ",", integerSeparator: "." });
class CountUp extends Component {
    render() {
        return (
            <OriginalCountUp start={this.props.Start} end={this.props.Value} duration={1} formattingFn={val => numberFormatter(val)} />
        );
    }
} export default CountUp;