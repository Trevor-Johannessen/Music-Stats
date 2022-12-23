import './style.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { chartColors } from '../../store';
import BarChart from '../../charts/BarChart/BarChart';
import { GlobalDataContext } from '../../dataContext'
import { getSettingsMenu } from './ChartSettings';

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
    const [chartType, setChartType] = useState('NONE');
    const [shadow, setShadow] = useState(['#e1e2d7', '']); // current and previous colors stored
    const [chartSettings, setChartSettings] = useState({xValue : 'genres', yValue: 'length', options: []})
    const [chartData, setChartData] = useState([]);
    const [settingsOpened, openSettings] = useState(false);
    const { dataRequest } = useContext(GlobalDataContext);

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

    function handleDbClick(event){
        event.stopPropagation();
        if(!settingsOpened && chartType != 'NONE')
            openSettings(true);
    }

    function handleDrop(event) {
        event.preventDefault();
        let newChartType = event.dataTransfer.getData('chartType');
        let chartColor = chartColors[chartType];
        setChartType(newChartType);
        // TODO: Move this to Data Context
        setData(newChartType);
        setShadow([chartColor, shadow[0]]) // Change this to new chart color later
    }

    function setData(type, newSettings=null){
        if (newSettings == null){
            newSettings = chartSettings;
        }
        switch(type){
            case 'BARCHART':
                dataRequest.setBarchartData(setChartData, newSettings.xValue, newSettings.yValue, newSettings.options)
                break;
        }
    }

    function submitSettings(newSettings){
        setChartSettings(newSettings);
        openSettings(false);
        setData(chartType, newSettings);
        
    }

    // TODO: need to figure out better way to do this
    let chart = "";
    let settingsMenu = getSettingsMenu(chartType, chartSettings, submitSettings);
    // PLACE CHART
    switch(chartType){
        case 'BARCHART':
            chart = (<BarChart width={width} height={height} data={chartData}/>)
            break;
    }

    return (
        <div 
            id = 'chart-space'
            ref={ref}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDoubleClick={handleDbClick}
            style={{boxShadow: `-10px 5px 5px ${shadow[0]}`}}
        >
            {settingsOpened ? settingsMenu : (<div><button onClick={() => setData('BARCHART')}>Refresh</button>{chart}</div>)}
            {/* {settingsOpened ? settingsMenu : chart} */}
        </div>
    )
}

export default ChartSpace;