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
const ChartSpace = () => {
    const [chart, setchart] = useState(null);
    let shadowColor = '#0ff';





    return (
        <div 
            id = 'chart-space'
            style={{boxShadow: `-10px 5px 5px ${shadowColor}`}}
        >
        </div>
    )
}

export default ChartSpace;