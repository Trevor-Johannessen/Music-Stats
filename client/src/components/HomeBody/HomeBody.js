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

    let littleButton = async () => {
        const response = await dataRequest.getBarchartData("albums", "plays", []).then(response => {
            return response;
        })
        console.log(response)
    }


    return (
        <div id='homebody'>
            {store.dropdownEnabled ? <ChartDropdown/> : ''}
            {store.settingsEnabled ? <ChartSettings/> : ''}
            <Navbar/>
            <div id='chart-area'>
                <ChartSpace/>
                <ChartSpace/>
                <ChartSpace/>
                <ChartSpace/>
                <ChartSpace/>
                <ChartSpace/>
            </div>
            <button onClick={littleButton}>Press Me!</button>
        </div>
    )
}

export default HomeBody;