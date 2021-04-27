import { storageService } from './storageService.js'
export const locService = {
    getLocs,
    setLocation,
    getLocation
}


const KEY = 'locations';
var locs = storageService.loadFromStorage(KEY) || [];

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


function setLocation(lnglat, locationName) {
    const location = {
        name: locationName, lat: lnglat.lng, lng: lnglat.lat
    }
    locs.push(location)
    storageService.saveToStorage(KEY, locs);
    //Todo 1 - send request through function for api location 
    //Todo 2 insert it to the table  and saveToStorage
    //Todo 3 render table and location on the map
}

function getLocation(name){
    return locs[locs.findIndex( loc => {return loc.name === name})];
}

