import './style.css';
import { useContext, useEffect } from 'react'
import Navbar from '../Navbar/Navbar'
import ChartSpace from '../ChartSpace/ChartSpace'
import ChartDropdown from '../ChartDropdown/ChartDropdown'
import ChartSettings from '../PageSettings/PageSettings'
import BarChart from '../../charts/BarChart/BarChart'
import { GlobalStoreContext } from '../../store'
import { GlobalDataContext } from '../../dataContext'

const HomeBody = () => {
    const { store } = useContext(GlobalStoreContext);
    const { dataRequest } = useContext(GlobalDataContext);



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
            <button onClick={() => dataRequest.getBarchartData("albums", "plays", [])}>Press Me!</button>
            {store.dropdownEnabled ? <ChartDropdown/> : ''}
            {store.settingsEnabled ? <ChartSettings/> : ''}
        </div>
    )
}

export default HomeBody;