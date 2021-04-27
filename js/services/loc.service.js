import { storageService } from './storageService.js'
import { mapService } from './map.service.js'
export const locService = {
    getLocs,
    setLocation
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
        name: locationName, lat: lnglat.lat, lng: lnglat.lng
    }
    locs.push(location)
    storageService.saveToStorage(KEY, locs)
    // send request through function for api location 
    mapService.initMap(location.lat, location.lng);
    //Todo 2 insert it to the table  and saveToStorage
    //Todo 3 render table and location on the map
}