import './style.css';
import BarIcon from '../../charts/BarChart/Icon.svg'
import PieIcon from '../../charts/PieChart/Icon.svg'

const ChartDropdown = () => {

    function handleDragStart(event, chartColor){
        event.dataTransfer.setData('chartColor', chartColor);
    }

    return (
        <div id='chart-dropdown'>
            <img 
                className="chart-svg"
                src={BarIcon} 
                alt="Bar Chart"
                draggable='true'
                onDragStart={(event) => handleDragStart(event, "#ff0000")}
            />
            <img 
                className="chart-svg"
                src={PieIcon} 
                alt="Pie Chart"
                draggable='true'
                onDragStart={(event) => handleDragStart(event, "#000000")}
            />
        </div>
    )
}

export default ChartDropdown;