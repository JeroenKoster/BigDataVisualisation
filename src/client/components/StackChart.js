import React, {Component} from 'react';

const _ = require('lodash');

import {
  VictoryStack,
  VictoryChart,
  VictoryLegend,
  VictoryBar,
  VictoryTooltip,
  VictoryAxis


class StackChart extends Component {

  keyToColor(key) {
    const green = ["Tot 25", "Geen alcohol", "Ja", "Tot 6,5 mmol/l"];
    const yellow = ["1 tot 15 gl. /week"];
    const orange = ["25 tot 30", "16 tot 25 gl. / week"];
    const red = ["30 en hoger", "25 of meer gl. /week", "Nee", "6,5 mmol/l of hoger"];

    if (green.includes(key)) {
      return "#8BC34A"
    }
    else if (yellow.includes(key)) {
      return "#FFC107"
    }
    else if (orange.includes(key)) {
      return "#FF9800"
    }
    else if (red.includes(key)) {
      return "#F44336"
    }
    else return "black"
  }


  render() {
    // let data = this.getStackData();
    let keys = _.keys(this.props.data);
    let colorScale = keys.map(key => {
      return this.keyToColor(key)
    });
    return (
      <VictoryChart
        style={this.props.style}
      >
        <VictoryAxis
          style={{axisLabel: {fontFamily: "graduate"}, tickLabels: {fontFamily: "graduate"}}}
          label="Age"
        />
        <VictoryAxis
          style={{axisLabel: {fontFamily: "graduate"}, tickLabels: {fontFamily: "graduate"}}}
          dependentAxis
          tickFormat={(p) => `${p}%`}
        />
        <VictoryLegend x={25} y={0}
                       titleOrientation="top"
                       orientation="horizontal"
                       gutter={10}
                       style={{title: {fontSize: 5}, labels: {fontFamily: "graduate"}}}
                       data={keys.map(key => ({name: key}))}
                       colorScale={colorScale}

                       events={[{
                         target: "data",
                         eventHandlers: {
                           onClick: () => {
                             return [
                               {
                                 target: "data",
                                 mutation: (props) => {
                                   console.log(props);
                                   const fill = props.style && props.style.fill;
                                   const color = this.keyToColor(props.datum.name);
                                   return fill === color ? null : {style: {fill: color}};
                                 }
                               }, {
                                 target: "labels",
                                 mutation: (props) => {
                                   const fill = props.style && props.style.fill;
                                   const color = this.keyToColor(props.datum.name);
                                   return fill === color ? null : {style: {fill: color, fontFamily: "graduate"}};
                                 }
                               }
                             ];
                           }
                         }
                       }]}
        />
        <VictoryStack
        >
          {
            keys.map(key => {
              let color = this.keyToColor(key);
              return <VictoryBar
                animate={{
                  duration: 800,
                  onLoad: {duration: 800},
                  onExit: {duration: 800}
                }}
                barRatio={1}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{
                      stroke: color
                    }}
                  />
                }
                data={this.props.data[key]}
                name={key}
                key={key}
                alignment="start"
                style={{
                  data: {
                    fill: color,
                    stroke: color,
                    fillOpacity: 0.7,
                    strokeWidth: 1
                  },
                  labels: {fill: color}
                }}
                labels={(d) => `${this.props.theme}: ${key}\n Age: ${d.key}\n Percentage: ${Math.round(d.percentage * 10) / 10}`}
                x="key"
                y="percentage"
                events={[{
                  target: "data",
                  eventHandlers: {
                    onMouseOver: () => {
                      return [
                        {
                          target: "data",
                          mutation: () => ({style: {fill: color, fillOpacity: 1}})
                        }, {
                          target: "labels",
                          mutation: () => ({active: true})
                        }
                      ];
                    },
                    onMouseOut: () => {
                      return [
                        {
                          target: "data",
                          mutation: () => {
                          }
                        }, {
                          target: "labels",
                          mutation: () => ({active: false})
                        }
                      ];
                    },
                    onClick: () => {
                      this.setState({selection: key});
                    }
                  }

                }]}
              />
            })
          }
        </VictoryStack>
      </VictoryChart>
    );
  }
}

export default StackChart;