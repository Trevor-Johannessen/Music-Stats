import './style.css';
import BarIcon from '../../charts/BarChart/Icon.svg'
import PieIcon from '../../charts/PieChart/Icon.svg'

const ChartDropdown = () => {

    function handleDragStart(event, chartType){
        event.dataTransfer.setData('chartType', chartType);
    }

    return (
        <div id='chart-dropdown'>
            <img 
                className="chart-svg"
                src={BarIcon} 
                alt="Bar Chart"
                draggable='true'
                onDragStart={(event) => handleDragStart(event, "BARCHART")}
            />
            <img 
                className="chart-svg"
                src={PieIcon} 
                alt="Pie Chart"
                draggable='true'
                onDragStart={(event) => handleDragStart(event, "PIECHART")}
            />
        </div>
    )
}

export default ChartDropdown;