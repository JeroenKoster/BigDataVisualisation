import React, {Component} from 'react';

const _ = require('lodash');

import {
  VictoryStack,
  VictoryChart,
  VictoryLegend,
  VictoryBar,
  VictoryTooltip
} from 'victory';

export class GroupedChart extends Component {

  keyToColor(key) {
    const green = ["Tot 25", "Geen alcohol", "Ja"];
    const yellow = ["1 tot 15 gl. /week"];
    const orange = ["25 tot 30", "16 tot 25 gl. / week"];
    const red = ["30 en hoger", "25 of meer gl. /week", "Nee"];

    if (green.includes(key)) {
      return "green"
    }
    else if (yellow.includes(key)) {
      return "yellow"
    }
    else if (orange.includes(key)) {
      return "orange"
    }
    else if (red.includes(key)) {
      return "red"
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
        animate={{ duration: 500 }}
        style={this.props.style}
      >
        <VictoryLegend x={75} y={0}
                       titleOrientation="top"
                       orientation="horizontal"
                       gutter={10}
                       style={{title: {fontSize: 10}}}
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
                                   const fill = props.style && props.style.fill;
                                   return fill === "#c43a31" ? null : {style: {fill: "#c43a31"}};
                                 }
                               }, {
                                 target: "labels",
                                 mutation: (props) => {
                                   const fill = props.style && props.style.fill;
                                   return fill === "#c43a31" ? null : {style: {fill: "#c43a31"}};
                                 }
                               }
                             ];
                           }
                         }
                       }]}
        />
        <VictoryGroup
          offset={0}
        >
          {
            keys.map(key => {
              return <VictoryBar
                barRatio={1}
                color={this.keyToColor(key)}
                labelComponent={<VictoryTooltip/>}
                data={this.props.data[key]}
                name={key}
                key={key}
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
                          mutation: () => ({style: {fill: "blue", width: 4}})
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
        </VictoryGroup>
      </VictoryChart>
    );
  }
}

export default GroupedChart;