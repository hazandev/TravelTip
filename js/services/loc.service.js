import { storageService } from './storageService.js'
import { mapService } from './map.service.js'
import { utilService } from '../util/util-service.js'
export const locService = {
    getLocs,
    setLocation,
    getLocation,
    getLocationIdx,
    removeLocation
}


const KEY = 'locations';
var locs = storageService.loadFromStorage(KEY) || [];

function getLocs() {
    return new Promise((resolve, reject) => {
        resolve(locs);
    });
}


function setLocation(lnglat, locationName,weatherObj) {
    const location = {
        id: utilService.makeId(), name: locationName, lat: lnglat.lat, lng: lnglat.lng , weatherObj
    }
    locs.push(location)
    storageService.saveToStorage(KEY, locs)
    // send request through function for api location 
    mapService.initMap(location.lat, location.lng);
    //- send request through function for api location 
    // insert it to the table  and saveToStorage
    // render table and location on the map
}

function getLocation(id) {
    return locs.find(loc => { return loc.id === id });
}

function getLocationIdx(id) {
    return locs.findIndex(loc => { return loc.id === id });
}

function removeLocation(idx) {
    locs.splice(idx, 1);
    storageService.saveToStorage(KEY, locs);
}

