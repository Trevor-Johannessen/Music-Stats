import axios from 'axios'
//axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

export const getBarchartData = (x, y, filters) => {
    let bodyDict = {
        xValue: x,
        yValue: y,
        filters: filters
    }
    console.log('Sending Barchart Request')
    console.log(bodyDict)
    return api.put(`/bar-chart/`, bodyDict)
}

const apis = {
    getBarchartData
}

export default apis
