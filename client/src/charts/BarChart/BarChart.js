import './style.css';
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from "d3";


const BarChart = (props) => {

    const ticks=6; // Ticks on the Y axis
    const tickWidth=12; // Width of Y axis ticks
    const marginLeft = 35;
    const marginRight = 0;
    const marginBottom = 45;
    const marginTop = 20;
    const width = Number(props['width'])-marginLeft-marginRight;
    const height = Number(props['height'])-marginBottom-marginTop;
    const xRange = [marginLeft, width, width-marginLeft];
    const yRange = [marginTop, height, height-marginTop];
    const yMin = 0;
    const yMax = 100;
    
    const data = [
        {name:"Mark", value: 90},
        {name:"Robert", value: 12},
        {name:"Emily", value: 34},
        {name:"Marion", value: 53},
        {name:"Nicolas", value: 98},
    ]

    const x = d3.scaleBand()
        .range([ xRange[0], xRange[1] ])
        .domain(data.map(function(d) { return d.name; }))
        .padding(0.2);
    const barWidth = x.bandwidth()

    const y = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([ yRange[1], yRange[0]]);

    const allRects = data.map((value,i) => {
        return (
            <rect
                key={i}
                fill='#69b3a2'
                stroke='black'
                x={x(value.name)+tickWidth}
                y={y(value.value)}
                width={barWidth}
                height={yRange[1] - y(value.value)}
            />
        );
    });

    const xAxis = (
        // draw vertical line
        <svg>
            <line
                x1={xRange[0]+tickWidth}
                y1={yRange[1]}
                x2={xRange[1]+tickWidth}
                y2={yRange[1]}
                stroke="black"
                strokeWidth="5"
            />
            {data.map((d, i) => {
                let xpos = x(d.name)+tickWidth+barWidth/2
                let ypos = yRange[1]+tickWidth
                return (
                    <svg>
                        <text x={xpos} y={ypos} class="small"  textAnchor="end" transform={`translate(-5, 5) rotate(-45, ${xpos}, ${ypos})`}>{d.name}</text>
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
                        <text x={marginLeft} y={yRange[0] + (yRange[2]/(ticks-1))*i+4} textAnchor="end" class="small">{Math.round(yMax/(ticks-1)) * (ticks-i-1)}</text>
                        <line
                            x1={xRange[0]}
                            y1={yRange[1] - (yRange[2]/(ticks-1))*i}
                            x2={xRange[0] + tickWidth}
                            y2={yRange[1] - (yRange[2]/(ticks-1))*i}
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