const APIkey = "bf78c31f08302cdbdd2390f6de936883"
const searchBtn = document.getElementById("search-btn")
const searchInputEl = document.getElementById("input")
var cityName = searchInputEl.value

const getCoordinates = function(cityName) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},&limit=1&appid=${APIkey}`)
    .then(response => {
        if (response.ok) {
            return response.json() // returns readable for javascript
        }
    })
    .then(data => { // get the needed data from the json which is lat, lon
        let latitude = data[0].lat
        let longitude = data[0].lon

        getWeatherData(latitude, longitude)
    })
}

const getWeatherData = function(latitude, longitude) {

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${APIkey}`)
    .then(response => {
        if(response.ok) {
            return response.json()
        }
    })
    .then(data => {
        console.log(data) // only returns weather data, not the city name, not date
    })
}

searchBtn.addEventListener("click", function() { 
    event.preventDefault()
    cityName = searchInputEl.value
    getCoordinates(cityName);
    console.log(cityName)
})