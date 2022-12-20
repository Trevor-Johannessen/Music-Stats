import './style.css';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {








    return (
        <div id='navbar'>
            <span id="title">WEBSITE TITLE</span>
            <SettingsIcon style={{width: '5vw', height: '5vh'}}/>
            <MenuIcon style={{width: '5vw', height: '5vh'}}/>
        </div>
    )
}

export default Navbar;