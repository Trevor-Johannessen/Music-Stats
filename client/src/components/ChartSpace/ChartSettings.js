
import './style.css';
import { Select, MenuItem, Box, Button, Typography, FormHelperText, FormControl, Grid, TextField} from '@mui/material';

/*
    TODO:
        -Try and restructure reduce overhead for adding new charts
        -Play with how the filtering works and see what options to hide
        -Add way to remove rules
*/

const handleSubmit = (event, settings, setSettings, type, closeMenu) => {
    console.log("In handle submit")
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    switch(type){
        case 'BARCHART':
            let settingsDict = {};
            let options = [...settings.options]
            if(formData.get('xSelector')){
                if (formData.get('quantifierType') != 'None') 
                    options = [...options, {status : formData.get('quantifierInclusion'), type : formData.get('quantifierType'), comparator : '', value : formData.get('quantifierValue')}];
                settingsDict = {xValue : formData.get('xSelector'), yValue : formData.get('ySelector'), options : options}
            }else{
                let options = [...settings.options, {status : formData.get('filterType'), type : formData.get('filterAttribute'), comparator : formData.get('filterOperation'), value : formData.get('filterValue')}];
                settingsDict = {xValue : settings.xValue, yValue : settings.yValue, options : options}
            }
            setSettings(settingsDict, closeMenu);
            break;
    }
}

export function getEditMenu(settings, setEdit, setSettings) {
    
    const newSettings = settings;


    return (
        <div id='edit-rules'>
            <Box sx={{width: '100%', height:'100%'}}>
                <Button
                    onClick={() => {setSettings(newSettings, true); setEdit(false)}}
                >
                    DONE
                </Button>
            </Box>
        </div>
    )
}

const barchartSettings = (settings, editRules, setSettings) => (
    <div id='barchart-settings'>
        <Typography id='barchart-settings-title' >Barchart Settings:</Typography>
        <Box component='form' sx={{width: '100%', height:'100%'}}  onSubmit={(event) => handleSubmit(event, settings, setSettings, 'BARCHART', true)}>
            <Grid container >
                <Grid item xs={6}>
                    <Select                                                     // select X axis
                        id="barchart-x-selector" 
                        className='barchart-selector' 
                        name='xSelector' 
                        defaultValue={settings.xValue}
                        sx={{width: '50%', height:'50%'}}
                    >
                        <MenuItem value='artists'>Artist</MenuItem>
                        <MenuItem value='albums'>Album</MenuItem>
                        <MenuItem value='songs'>Song</MenuItem>
                        <MenuItem value='genres'>Genre</MenuItem>
                    </Select>
                        <FormHelperText>X-Axis</FormHelperText>
                </Grid>
                <Grid item xs={6}>
                    <Select                                                     // SELECT Y AXIS
                        id="barchart-y-selector" 
                        className='barchart-selector' 
                        name='ySelector' 
                        defaultValue={settings.yValue}
                        sx={{width: '50%', height:'50%'}}
                        >
                        <MenuItem value='plays'>Plays</MenuItem>
                        <MenuItem value='skips'>Skips</MenuItem>
                        <MenuItem value='length'>Length</MenuItem>
                        <MenuItem value='count'>Count</MenuItem>
                    </Select>
                        <FormHelperText>Y-Axis</FormHelperText>
                </Grid>
                <Grid item xs={5}>
                    <Select
                        name="quantifierInclusion"
                        xs={{width: '100%'}}
                        defaultValue='INCLUDES'
                        style={{minWidth : '100%'}} // I have no idea why it won't spread otherwise and 1 minute of google did not solve my issue
                    >
                        <MenuItem value='INCLUDES'>Include</MenuItem>
                        <MenuItem value='EXCLUDES'>Exclude</MenuItem>
                    </Select>
                    <FormHelperText>Include/Exclude</FormHelperText>
                </Grid>
                <Grid item xs={2}>
                    <Select
                        name="quantifierType"
                        xs={{width: '100%'}}
                        defaultValue='none'
                    >
                        <MenuItem value='none'>None</MenuItem>
                        <MenuItem value='LIMIT#'>Top #</MenuItem>
                        <MenuItem value='LIMIT%'>Top %</MenuItem>
                    </Select>
                    <FormHelperText>Quantity Type</FormHelperText>
                </Grid>
                <Grid item xs={5}>
                    <TextField
                        name="quantifierValue"
                        type="number"
                        xs={{width: '100%'}}
                        label="Quantity"
                    >
                    </TextField>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        type='submit'
                    >
                        Confirm
                    </Button>
                </Grid>
            </Grid>
        </Box>
        <Box component='form' sx={{width: '100%', height:'100%'}}  onSubmit={(event) => handleSubmit(event, settings, setSettings, 'BARCHART', false)}>
            <Grid container>
                <Grid item xs={4}>
                    <Select 
                        id='barchart-include-exclude'
                        sx={{width: '100%', height:'50%'}}
                        defaultValue='INCLUDES'
                        name="filterType"
                    >
                        <MenuItem value='INCLUDES'>Include</MenuItem>
                        <MenuItem value='EXCLUDES'>Exclude</MenuItem>
                    </Select>
                    <FormHelperText>Inclued/Exclude</FormHelperText>
                </Grid>
                <Grid item xs={4}>
                    <Select
                        sx={{width: '100%', height: '50%'}}
                        defaultValue='artists'
                        name="filterAttribute"
                    >
                        <MenuItem value='artists'>Artist</MenuItem>
                        <MenuItem value='albums'>Album</MenuItem>
                        <MenuItem value='genres'>Genre</MenuItem>
                        <MenuItem value='plays'>Plays</MenuItem>
                        <MenuItem value='skips'>Skips</MenuItem>
                        <MenuItem value='count'>Count</MenuItem>
                    </Select>
                    <FormHelperText>Attribute</FormHelperText>
                </Grid>
                <Grid item xs={4}>
                    <Select
                        sx={{width: '100%', height: '50%'}}
                        defaultValue='contains'
                        name="filterOperation"
                    >
                        <MenuItem value='contains'>Contains</MenuItem>
                        <MenuItem value='>'>{'>'}</MenuItem>
                        <MenuItem value='>='>{'>='}</MenuItem>
                        <MenuItem value='='>{'='}</MenuItem>
                        <MenuItem value='<='>{'<='}</MenuItem>
                        <MenuItem value='<'>{'<'}</MenuItem>
                    </Select>
                    <FormHelperText>Attribute</FormHelperText>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        sx={{width: '100%'}}
                        name='filterValue'
                        label='String or Number'
                    >
                        </TextField>
                </Grid>
                <Grid item xs={2}>
                    <Button
                        type='submit'
                    >
                        ADD RULE
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    <Button
                        onClick={() => editRules(true)}
                    >
                        EDIT RULES
                    </Button>
                </Grid>
            </Grid>
        </Box>
    </div>
);

const defaultSettings = (
    <div>
        How did you get here?
    </div>
)

export function getSettingsMenu(type, settings, editRules, setSettings){
    switch(type){
        case 'BARCHART':
            return barchartSettings(settings, editRules, setSettings);
        case 'NONE':
            return defaultSettings;
    }
}