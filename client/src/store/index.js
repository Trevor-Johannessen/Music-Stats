import { createContext, useState } from 'react'

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    TOGGLE_DROPDOWN: "TOGGLE_DROPDOWN",
    TOGGLE_SETTINGS: "TOGGLE_SETTINGS",
}

export const chartColors = {
    BARCHART: "#ff0000",
    PIECHART: "#000000",
}


// THIS WILL STORE THE PAGE SETINGS
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        dropdownEnabled: false,
        settingsEnabled: false,
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.TOGGLE_DROPDOWN: {
                return setStore({
                    dropdownEnabled: !store.dropdownEnabled,
                    settingsEnabled: store.settingsEnabled
                });
            }
            case GlobalStoreActionType.TOGGLE_SETTINGS: {
                return setStore({
                    dropdownEnabled: store.dropdownEnabled,
                    settingsEnabled: !store.settingsEnabled
                });
            }
            
            default:
                return store;
        }
    }


    store.toggleDropdown = () => {
        storeReducer({
                    type: GlobalStoreActionType.TOGGLE_DROPDOWN
                });
    }

    store.toggleSettings = () => {
        storeReducer({
                    type: GlobalStoreActionType.TOGGLE_SETTINGS
                });
    }






    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };