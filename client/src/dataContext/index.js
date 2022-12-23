import { createContext, useState } from 'react'
import api from './data-request-api'

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalDataContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalDataActionType = {
    TOGGLE_DROPDOWN: "TOGGLE_DROPDOWN",
    TOGGLE_SETTINGS: "TOGGLE_SETTINGS",
}

export const chartColors = {
    BARCHART: "#ff0000",
    PIECHART: "#000000",
}


function GlobalDataContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [dataRequest, setDataRequest] = useState({

    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const dataReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            default:
                return dataRequest
            
        }
    }

    dataRequest.setBarchartData = (stateFunction, xValue, yValue, filters) =>{
        console.log("Getting barchart data.");
        console.log(`xValue = ${xValue}`)
        console.log(`yValue = ${yValue}`)
        if(!xValue || !yValue)
            return [];
        async function asyncGetData(xValue, yValue, filters){
            console.log(`Query Values = ${xValue}, ${yValue}`);
            console.log(filters)
            const response = await api.getBarchartData(xValue, yValue, filters);
            console.log("Response = ")
            console.log(response)
            stateFunction(response.data)
        }
        asyncGetData(xValue, yValue, filters)
    } 



    return (
        <GlobalDataContext.Provider value={{
            dataRequest
        }}>
            {props.children}
        </GlobalDataContext.Provider>
    );
}

export default GlobalDataContext;
export { GlobalDataContextProvider };