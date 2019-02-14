import React, {Component} from 'react';

const _ = require('lodash');

import {
  VictoryStack,
  VictoryChart,
  VictoryPolarAxis,
  VictoryBar,
  VictoryTheme,
  VictoryLabel
} from 'victory';

const directions = {
  0: "sickdays", 45: "NE", 90: "N", 135: "NW",
  180: "W", 225: "SW", 270: "S", 315: "SE"
};

const orange = {base: "gold", highlight: "darkOrange"};

const red = {base: "tomato", highlight: "orangeRed"};

const innerRadius = 30;

class CompassCenter extends Component {

  render() {
    const {origin} = this.props;
    const circleStyle = {
      stroke: red.base, strokeWidth: 2, fill: orange.base
    };
    return (
      <g>
        <circle
          cx={origin.x} cy={origin.y} r={innerRadius} style={circleStyle}
        />
      </g>
    );
  }
}

class CenterLabel extends Component {
  render() {
    const {datum, active, color} = this.props;
    const text = [`${directions[datum._x]}`, `${Math.round(datum._y1)} mph`];
    const baseStyle = {fill: color.highlight, textAnchor: "middle"};
    const style = [
      {...baseStyle, fontSize: 18, fontWeight: "bold"},
      {...baseStyle, fontSize: 12}
    ];

    return active ?
      (
        <VictoryLabel
          text={text} style={style} x={175} y={175} renderInPortal
        />
      ) : null;
  }
}

class PolarChart extends Component {

  render() {
    let keys = _.keys(this.props.data);
    return (
      <VictoryChart
        style={this.props.style}
        polar
        animate={{duration: 500, onLoad: {duration: 500}}}
        theme={VictoryTheme.material}
        innerRadius={innerRadius}
        domainPadding={{y: 10}}
        events={[{
          childName: "all",
          target: "data",
          eventHandlers: {
            onMouseOver: () => {
              return [
                {target: "labels", mutation: () => ({active: true})},
                {target: "data", mutation: () => ({active: true})}
              ];
            },
            onMouseOut: () => {
              return [
                {target: "labels", mutation: () => ({active: false})},
                {target: "data", mutation: () => ({active: false})}
              ];
            }
          }
        }]}
      >
        <VictoryPolarAxis
          dependentAxis
          labelPlacement="vertical"
          style={{axis: {stroke: "none"}}}
          tickFormat={() => ""}
        />
        <VictoryPolarAxis
          labelPlacement="parallel"
          tickValues={keys.map((k) => +k)}
          tickFormat={keys}
        />
        <VictoryStack>
          {
            keys.map(key => {
              <VictoryBar
                style={{
                  data: {
                    fill: (d, a) => a ? orange.highlight : orange.base,
                    width: 40
                  }
                }}
                data={this.props.data}
                x="key"
                y="percentage"
                labels={() => ""}
                labelComponent={<CenterLabel color={orange}/>}
              />
            })
          }

        </VictoryStack>
        <CompassCenter/>
      </VictoryChart>
    );
  }
}

export default PolarChart;