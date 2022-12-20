import './style.css';
import { useContext } from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import { GlobalStoreContext } from '../../store'


const Navbar = () => {
    const { store } = useContext(GlobalStoreContext);

    function toggleSettings(event){
        event.stopPropagation();
    }

    function toggleDropdown(event){
        event.stopPropagation();
        store.toggleDropdown();
    }






    return (
        <div id='navbar'>
            <span id="title">WEBSITE TITLE</span>
            <SettingsIcon style={{width: '5vw', height: '5vh'}} onClick={toggleSettings}/>
            <MenuIcon style={{width: '5vw', height: '5vh'}} onClick={toggleDropdown}/>
        </div>
    )
}

export default Navbar;