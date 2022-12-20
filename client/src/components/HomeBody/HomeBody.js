import './style.css';
import Navbar from '../Navbar/Navbar'
import ChartSpace from '../ChartSpace/ChartSpace'
import ChartDropdown from '../ChartDropdown/ChartDropdown'

const HomeBody = () => {



    return (
        <div id='homebody'>
            <ChartDropdown/>
            <Navbar/>
            <div id='chart-area'>
                <ChartSpace/>
                <ChartSpace/>
                <ChartSpace/>
                <ChartSpace/>
                <ChartSpace/>
                <ChartSpace/>
            </div>
        </div>
    )
}

export default HomeBody;