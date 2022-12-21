import './style.css';
import { useContext } from 'react'
import Navbar from '../Navbar/Navbar'
import ChartSpace from '../ChartSpace/ChartSpace'
import ChartDropdown from '../ChartDropdown/ChartDropdown'
import ChartSettings from '../PageSettings/PageSettings'
import { GlobalStoreContext } from '../../store'

const HomeBody = () => {
    const { store } = useContext(GlobalStoreContext);


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
        </div>
    )
}

export default HomeBody;