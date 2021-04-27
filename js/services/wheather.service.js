export const weatherService = {
    getWheater
}
const API_KET_WHATHER = '726fc16ec3914313d5989755d84d4daf';


function getWheater(latlng) {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latlng.lat}&lon=${latlng.lng}&appid=${API_KET_WHATHER}`)
        .then(res => res.data)
        .catch((err) => {
            Swal.fire(
                'We sorry but we could not get it for you right now',
                'please try again later',
                'error'
            )
            return err;
        })
}

