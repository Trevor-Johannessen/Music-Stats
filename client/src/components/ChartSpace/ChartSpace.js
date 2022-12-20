import './style.css';
import React, { useState } from 'react';
import { color } from '@mui/system';

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
    const [shadow, setShadow] = useState('#e1e2d7');



    function handleDragOver(event) {
        event.preventDefault();
        
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setShadow('#0ff')
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setShadow('#e1e2d7')
    }

    function handleDrop(event) {
        event.preventDefault();
        setShadow('#e1e2d7') // Change this to new chart color later
    }

    return (
        <div 
            id = 'chart-space'
            draggable='true'
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{boxShadow: `-10px 5px 5px ${shadow}`}}
        >
        </div>
    )
}

export default ChartSpace;