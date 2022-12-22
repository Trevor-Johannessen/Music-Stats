import './style.css';
import React, { useState, useEffect, useRef } from 'react';
import { chartColors } from '../../store';
import BarChart from '../../charts/BarChart/BarChart';

/*
    ChartSpace:
        This component will hold d3 charts for display
        
        Functions:
            -A chartspace will recieve a chart by dragging the chart icon into the space
            -When a chartspace recieves a chart it will gain a gradient shadow color coded with the chart
            -When dragging a chart over a chartspace, the chartspace will change its shadow to be color coded with the dragging chart
            -When the dragged object leaves the chartspace, the chartspace shadow will be color coded with the chart it is holding 
*/
const ChartSpace = (props) => {
    const [chart, setChart] = useState('');
    const [shadow, setShadow] = useState(['#e1e2d7', '']); // current and previous colors stored

    const ref = useRef(null);
    let width = ref.current ? ref.current.offsetWidth : 0
    let height = ref.current ? ref.current.offsetHeight : 0
    


    function handleDragOver(event) {
        event.preventDefault();
        
    }

    function handleDragEnter(event) {
        event.preventDefault();
        let chartColor = chartColors[event.dataTransfer.getData('chartType')];
        setShadow([chartColor, shadow[0]])
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setShadow([shadow[1], shadow[0]])
    }

    function handleDrop(event) {
        event.preventDefault();
        let chartType = event.dataTransfer.getData('chartType');
        let chartColor = chartColors[chartType];
        console.log(`width = ${width}`)
        console.log(`height = ${height}`)
        setChart(<BarChart width={width} height={height}/>)
        setShadow([chartColor, shadow[0]]) // Change this to new chart color later

    }

    return (
        <div 
            id = 'chart-space'
            ref={ref}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{boxShadow: `-10px 5px 5px ${shadow[0]}`}}
        >
            {chart}
        </div>
    )
}

export default ChartSpace;