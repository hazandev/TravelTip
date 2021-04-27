import { utilService } from "../util/util-service.js";
import { weatherService } from "./wheather.service.js";
export const mapService = {
    initMap,
    addMarker,
    panTo,
    getLocationByVal,
    currentLocation,
    goLocation
}

let gCurrPos;
var gMap;
let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let labelIndex = 0;
let gMarker;
function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            gMap.addListener('click', (addEventListenerOnMap))
        })
}


function addEventListenerOnMap(mapsMouseEvent) {
    console.log(mapsMouseEvent)
    gCurrPos = mapsMouseEvent.latLng;
    addMarker(mapsMouseEvent.latLng);
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        id: utilService.makeId(),
        labels: labels[labelIndex++ % labels.length],
        position: loc,
        map: gMap
        // title: 'Hello World!'
    });
    if(gMarker) removeMarker(gMarker);
    gMarker = marker;
    return marker;
}

function removeMarker(marker) {
    marker.setMap(null);
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = ' AIzaSyAJxEq1dGkLrZA5cB3DKdS1-OgI5LDRxRE';
    //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


function getLocationByVal(location) {
    const API_KEY = ' AIzaSyAJxEq1dGkLrZA5cB3DKdS1-OgI5LDRxRE';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${API_KEY}`)
        .then((res) => {
            return res.data.results;
        })
        .catch((err) => {
            Swal.fire(
                'We sorry but we could not get it for you right now',
                'please try again later',
                'error'
            )
            return err;
        })
}


function goLocation(location) {
    initMap(location.lat, location.lng);
}

function currentLocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            initMap(pos.lat, pos.lng);
        },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}