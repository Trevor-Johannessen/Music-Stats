import './style.css';
import React, { useState } from 'react';

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
    const [chart, setChart] = useState(null);
    const [shadow, setShadow] = useState(['#e1e2d7', '']); // current and previous colors stored



    function handleDragOver(event) {
        event.preventDefault();
        
    }

    function handleDragEnter(event) {
        event.preventDefault();
        let chartColor = event.dataTransfer.getData('chartColor');
        setShadow([chartColor, shadow[0]])
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setShadow([shadow[1], shadow[0]])
    }

    function handleDrop(event) {
        event.preventDefault();
        let chartColor = event.dataTransfer.getData('chartColor');
        setShadow([chartColor, shadow[0]]) // Change this to new chart color later
    }

    return (
        <div 
            id = 'chart-space'
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{boxShadow: `-10px 5px 5px ${shadow[0]}`}}
        >
        </div>
    )
}

export default ChartSpace;