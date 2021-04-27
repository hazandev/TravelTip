import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/wheather.service.js'

window.onload = onInit;

function onInit() {
    addEventListenrs();
    const latLng = mapService.getLatLngUrl();
    mapService.initMap(latLng.lat, latLng.lng)
        .then(() => {
            console.log('Map is ready');
            renderTable();
        })
        .catch(() => console.log('Error: cannot init map'));
}

function addEventListenrs() {
    document.querySelector('.btn-pan').addEventListener('click', (ev) => {
        console.log('Panning the Map');
        mapService.panTo(35.6895, 139.6917);
    })
    document.querySelector('.btn-add-marker').addEventListener('click', (ev) => {
        console.log('Adding a marker');
        mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
    })
    document.querySelector('.btn-get-locs').addEventListener('click', (ev) => {
        locService.getLocs()
            .then(locs => {
                console.log('Locations:', locs)
                document.querySelector('.locs').innerText = JSON.stringify(locs)
            })

    })
    document.querySelector('.search-container').addEventListener('submit', onSearch);
    document.querySelector('.btn-my-location').addEventListener('click', onSetMyLocation);
    document.querySelector('.btn-copy-link').addEventListener('click', onCopyLink);
    document.querySelector('.btn-user-pos').addEventListener('click', (ev) => {
        getPosition()
            .then(pos => {
                console.log('User position is:', pos.coords);
                document.querySelector('.user-pos').innerText =
                    `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            })
            .catch(err => {
                console.log('err!!!', err);
            })
    })

}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function onSearch(ev) {
    ev.preventDefault();
    //Recive the user search value
    const searchVal = document.querySelector('input[name="search"]').value;
    //Contains the object value of the search
    mapService.getLocationByVal(searchVal)
        .then((res) => {

            const lnglat = res[0].geometry.location;
            const locationName = res[0].formatted_address;
            weatherService.getWheater(lnglat)
                .then((values) => {
                    renderWeather(values);
                    locService.setLocation(lnglat, locationName);
                    renderLocationName(locationName);
                    renderTable();
                })

        })
}

//Function that changes the header value to the location name
function renderLocationName(locationName) {
    const elLocatioHeader = document.querySelector('.location-header');
    elLocatioHeader.innerText = locationName;
}


function onSetMyLocation() {
    mapService.currentLocation();
}
function renderTable() {
    console.log('entered')
    let tableData = '';
    locService.getLocs()
        .then(locs => {
            locs.forEach(location => {
                tableData +=
                    `<tr>
                <td>${location.name}</td>
                <td>${location.lat}</td>
                <td>${location.lng}</td>
                <td><button class="btn btn-go" data-id="${location.id}">Go</button></td>
                <td><button class="btn btn-delete" data-id="${location.id}">Delete</button></td>
            </tr>
            `
            })
            let elTbl = `
        <table style="float:right">
        <tr>
          <th>Name</th>
          <th>Location lat</th>
          <th>Location lng</th>
        </tr>
        ${tableData}
        </table>`;
            document.querySelector('.table-container').innerHTML = elTbl;
            addClickListener();
        });


}

function onCopyLink() {
    let currentUrl = new URL(window.location.href);
    // console.log(currentUrl.href)
    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', currentUrl);
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      };
      copyToClipboard(currentUrl)
}
function renderWeather(data) {
    const elWeatherdata = document.querySelector('.weather-data');
    const elLocationName = document.querySelector('.location-name');
    elLocationName.innerText = data.name;
    console.log(data)
    let tempCelsius = data.main.temp - 273.15;
    let tempCelsiusMin = data.main.temp_max - 273.15;
    let tempCelsiusMax = data.main.temp_min - 273.15;

    const str = `${parseInt(tempCelsius)} temprature from ${parseInt(tempCelsiusMin)} to ${parseInt(tempCelsiusMax)} wind ${data.wind.speed} m/s`
    elWeatherdata.innerText = str;
}
function addClickListener() {
    const btnsGo = document.querySelectorAll('.btn-go');
    btnsGo.forEach((btn) => {
        btn.addEventListener('click', onGoLocation);
    })
    const btnsDelete = document.querySelectorAll('.btn-delete');
    btnsDelete.forEach((btn) => {
        btn.addEventListener('click', onDeleteLocation);
    })
}
//When clicking go , This will set the new location
function onGoLocation(ev) {
    const nameLocation = ev.target.getAttribute('data-id');
    const location = locService.getLocation(nameLocation);
    mapService.goLocation(location);

}

function onDeleteLocation(ev) {
    const nameLocation = ev.target.getAttribute('data-id');
    const locationIdx = locService.getLocationIdx(nameLocation);
    locService.removeLocation(locationIdx);
    renderTable();
}