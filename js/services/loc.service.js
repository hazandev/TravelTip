export const locService = {
    getLocs,
    searchLocation
}

var locs = [
    { name: 'Loc1', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Loc2', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


function searchLocation(location){
    //Todo 1 - send request through function for api location 
    //Todo 2 insert it to the table  and saveToStorage
    //Todo 3 render table and location on the map
}