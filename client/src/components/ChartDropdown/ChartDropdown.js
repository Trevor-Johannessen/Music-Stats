import './style.css';
import BarIcon from '../../charts/BarChart/Icon.svg'
import PieIcon from '../../charts/PieChart/Icon.svg'

const ChartDropdown = () => {

    function handleDragStart(event){
        event.preventDefault();

    }



    return (
        <div id='chart-dropdown'>
            <img 
                className="chart-svg"
                src={BarIcon} 
                alt="Bar Chart"
                onDragStart={(event) => handleDragStart(event)}
            />
            <img 
                className="chart-svg"
                src={PieIcon} 
                alt="Pie Chart"
                onDragStart={(event) => handleDragStart(event)}
            />
        </div>
    )
}

export default ChartDropdown;