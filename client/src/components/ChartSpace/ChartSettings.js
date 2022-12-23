
import './style.css';
import { Select, MenuItem, Box, Button } from '@mui/material';


const handleSubmit = (event, setSettings, type) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget)
    switch(type){
        case 'BARCHART':
            console.log(`x : ${formData.xSelector}, y : ${formData.ySelector}`)
            let options = [];
            let settingsDict = {xValue : formData.get('xSelector'), yValue : formData.get('ySelector'), options : options}
            setSettings(settingsDict);
            break;
    }
}

const barchartSettings = (settings, setSettings, closeSettings) => (
    <div id='barchart-settings'>
        <span id="barchart-settings-title">Barchart Settings:</span>
        <Box component="form" onSubmit={(event) => handleSubmit(event, setSettings, 'BARCHART')}>
        <Select id="barchart-x-selector" name='xSelector' defaultValue={settings.xValue}>
            <MenuItem value='artists'>Artist</MenuItem>
            <MenuItem value='albums'>Album</MenuItem>
            <MenuItem value='genres'>Genre</MenuItem>
        </Select>
        <Select id="barchart-y-selector" name='ySelector' defaultValue={settings.yValue}>
            <MenuItem value='plays'>Plays</MenuItem>
            <MenuItem value='skips'>Skips</MenuItem>
            <MenuItem value='length'>Avg. Length</MenuItem>
            <MenuItem value='count'>Count</MenuItem>
        </Select>
        <Select id='barchart-include-exclude'>
            <MenuItem>Include</MenuItem>
            <MenuItem>Exclude</MenuItem>
        </Select>
        <Button
            type='submit'
        >
            Confirm
        </Button>
        </Box>
    </div>
);

const defaultSettings = (
    <div>

    </div>
)

export function getSettingsMenu(type, settings, setSettings){
    switch(type){
        case 'BARCHART':
            return barchartSettings(settings, setSettings);
        case 'NONE':
            return defaultSettings;
    }
}