import { utilService } from "../util/util-service.js";
import { weatherService } from "./wheather.service.js";
export const mapService = {
    initMap,
    addMarker,
    panTo,
    getLocationByVal,
    currentLocation,
    goLocation,
    getLatLngUrl
}

let gCurrPos;
var gMap;
let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let labelIndex = 0;
let gMarker;
function initMap(lat, lng) {
    setUrl(lat, lng);
    // location.replace(currentUrl);
    // console.log(currentUrl.search)
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
    if (gMarker) removeMarker(gMarker);
    gMarker = marker;
    return marker;
}

function removeMarker(marker) {
    marker.setMap(null);
}


function setUrl(lat, lng) {
    let currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.get('lat') && currentUrl.searchParams.get('lng')) {
        currentUrl.searchParams.set('lat', lat);
        currentUrl.searchParams.set('lng', lng);
    } else {
        currentUrl.searchParams.append('lat', lat);
        currentUrl.searchParams.append('lng', lng);
    }

    history.pushState(null, null, currentUrl);
}
//function that will get the lat and lng from the url
function getLatLngUrl() {
    let currentUrl = new URL(window.location.href);
    let lat = +currentUrl.searchParams.get('lat');
    let lng = +currentUrl.searchParams.get('lng');

    if (lat && lng) {
        let latLng = { lat, lng };
        console.log(latLng);
        return latLng;
    }
    lat = 32.0749831;
    lng = 34.9120554;
    let latLng = { lat, lng };
    return latLng
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
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&region=ISR&language=EN`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


function getLocationByVal(location) {
    const API_KEY = ' AIzaSyAJxEq1dGkLrZA5cB3DKdS1-OgI5LDRxRE';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${API_KEY}&region=ISR&language=EN`)
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