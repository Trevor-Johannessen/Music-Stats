import './style.css';
import React, { useState } from 'react';


const PageSettings = (props) => {
    const [chart, setChart] = useState(null);
    const [shadow, setShadow] = useState(['#e1e2d7', '']); // current and previous colors stored



    return (
        <div 
            id = 'page-settings'
            
        >
        <span id="settings-title">Settings:</span>
        </div>
    )
}

export default PageSettings;