import './style.css';
import React, { useState, useRef, useEffect, useContext } from 'react';
import * as d3 from "d3";
import { GlobalDataContext } from '../../dataContext'

const BarChart = (props) => {
    const { dataRequest } = useContext(GlobalDataContext);
    


    // useEffect(() => {
    //     getAllData();
    // }, []);

    // const getAllData = () => {
    //     let temp = dataRequest.getBarchartData(settings.xValue, settings.yValue, settings.options);
    //     console.log(temp)
    //     setData(temp)
    // }

    const ticks = 6; // Ticks on the Y axis
    const tickWidth = 12; // Width of Y axis ticks
    const marginLeft = 35;
    const marginRight = 0;
    const marginBottom = 45;
    const marginTop = 20;
    const width = Number(props['width']) - marginLeft - marginRight;
    const height = Number(props['height']) - marginBottom - marginTop;
    const xRange = [marginLeft, width, width - marginLeft];
    const yRange = [marginTop, height, height - marginTop];
    const data = props['data'];
    // const data = [
    //     {x:"Mark", y: 90},
    //     {x:"Robert", y: 12},
    //     {x:"Emily", y: 34},
    //     {x:"Marion", y: 53},
    //     {x:"Nicolas", y: 98},
    // ]
    
    
    const yMin = data.length != 0 ? data.reduce((minimum, current) => minimum > current.y ? current.y : minimum, Infinity) : 0; // not sure why data does not evaluate to false on its own when empty
    const yMax = data.length != 0 ? data.reduce((maximum, current) => maximum < current.y ? current.y : maximum, -Infinity) : 100;

    const x = d3.scaleBand()
        .range([xRange[0], xRange[1]])
        .domain(data.map(function (d) { return d.x; }))
        .padding(0.2);
    const barWidth = x.bandwidth()

    const y = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([yRange[1], yRange[0]]);

    const allRects = data.map((value, i) => {
        return (
            <rect
                key={i}
                fill='#69b3a2'
                stroke='black'
                x={x(value.x) + tickWidth}
                y={y(value.y)}
                width={barWidth}
                height={yRange[1] - y(value.y)}
            />
        );
    });

    const xAxis = (
        // draw vertical line
        <svg>
            <line
                x1={xRange[0] + tickWidth}
                y1={yRange[1]}
                x2={xRange[1] + tickWidth}
                y2={yRange[1]}
                stroke="black"
                strokeWidth="5"
            />
            {data.map((d, i) => {
                let xpos = x(d.x) + tickWidth + barWidth / 2
                let ypos = yRange[1] + tickWidth
                return (
                    <svg>
                        <text x={xpos} y={ypos} className="small" textAnchor="end" transform={`translate(-5, 5) rotate(-45, ${xpos}, ${ypos})`}>{d.x}</text>
                        <line
                            x1={xpos}
                            y1={yRange[1]}
                            x2={xpos}
                            y2={yRange[1] + tickWidth}
                            stroke="black"
                            strokeWidth="2"
                        />
                    </svg>
                )
            })
            }
        </svg>
    )

    const yAxis = (
        // draw vertical line
        <svg>
            <line
                x1={xRange[0] + tickWidth}
                y1={yRange[0]}
                x2={xRange[0] + tickWidth}
                y2={yRange[1]}
                stroke="black"
                strokeWidth="5"
            />
            // draw ticks
            {Array.from(Array(ticks)).map((d, i) => {
                return (
                    <svg>
                        <text x={marginLeft} y={yRange[0] + (yRange[2] / (ticks - 1)) * i + 4} textAnchor="end" className="small">{Math.round(yMax / (ticks - 1)) * (ticks - i - 1)}</text>
                        <line
                            x1={xRange[0]}
                            y1={yRange[1] - (yRange[2] / (ticks - 1)) * i}
                            x2={xRange[0] + tickWidth}
                            y2={yRange[1] - (yRange[2] / (ticks - 1)) * i}
                            stroke="black"
                            strokeWidth="2"
                        />
                    </svg>
                )
            })
            }
        </svg>
    );

    return (
        <div>
            <svg width={props['width']} height={props['height']}>
                {allRects}
                {xAxis}
                {yAxis}
            </svg>
        </div>
    );
}
export default BarChart;