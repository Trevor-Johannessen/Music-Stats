import './style.css';
import Navbar from '../Navbar/Navbar'
import ChartSpace from '../ChartSpace/ChartSpace'
const HomeBody = () => {








    return (
        <div id='homebody'>
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