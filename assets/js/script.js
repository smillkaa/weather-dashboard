// setting api key as const and getting the html elements
const APIkey = "bf78c31f08302cdbdd2390f6de936883"
let searchBtn = document.getElementById("search-btn")
let searchInputEl = document.getElementById("input")
let cityName
const temp = document.getElementById('temp')
const wind = document.getElementById('wind')
const humidity = document.getElementById('humidity')
const uvIndex = document.getElementById('uv-index')
const cityDisplayed = document.getElementById('city-name')
const DateTime = luxon.DateTime
const date = document.getElementById('date')
const icon1El = document.getElementById('icon-current')
const forecastTitleEl = document.getElementById('forecast')
const forecastContainer = document.getElementById('forecast-cards')
const cityList = document.getElementById('city-list')
let historyList = JSON.parse(localStorage.getItem("city")) || []

// getting coordinates for weather api fetch link
const getCoordinates = function(cityName) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName},&limit=1&appid=${APIkey}`)
    .then(response => {
        if (response.ok) {
            return response.json() // returns readable for javascript
        }
    })
    .then(data => { // get the needed data from the json which is lat, lon
        let latitude = data[0].lat
        let longitude = data[0].lon

        getWeatherData(latitude, longitude, cityName)
    })
}

// getting weather data
const getWeatherData = function(latitude, longitude, cityName) {

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${APIkey}`)
    .then(response => {
        if(response.ok) {
            return response.json()
            .then(function(data) {
            
                // displaying current weather data
                cityDisplayed.textContent = cityName
                date.textContent = '(' + (DateTime.now().toLocaleString(DateTime.DATE_SHORT)) + ')'
                let weatherIcon = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png"
                icon1El.innerHTML = "<img src=" + weatherIcon + ">"
                temp.textContent = "Temp: " + data.current.temp + ' \u00B0F'
                wind.textContent = "Wind: " + data.current.wind_speed + " mph"
                humidity.textContent = "Humidity: " + data.current.humidity + "%"
                uvIndex.innerHTML = `UV Index: <span id = 'uv-value'>${data.current.uvi}</span>`
                let uvValue = document.getElementById('uv-value')
                if (data.current.uvi <= 2 ) {
                    uvValue.style.backgroundColor = "#84e16a"
                    uvValue.style.color = "white"
                }
                else if (data.current.uvi <= 5 || data.current.uvi >= 3) {
                    uvValue.style.backgroundColor = "#fff700"
                }
                if (data.current.uvi >= 7) {
                    uvValue.style.backgroundColor = "rgb(199, 58, 58)"
                    uvValue.style.color = "white"
                }
                // displaying 5 day forecast data
                forecastTitleEl.innerHTML = "<h3>5 Day Forecast:</h3>"

                forecastContainer.innerHTML = " "
                for (let i = 1; i < 6; i++) {
                
                    let card = document.createElement('div')
                    card.classList.add('card')
                    forecastContainer.appendChild(card)
                    
                    let date = document.createElement('div')
                    date.classList.add('card-date')
                    card.appendChild(date)
                    test = data.daily[i].dt
                    var day = new Date(test*1000)
                    date.textContent = day.toLocaleDateString()
                    
                    let icon = document.createElement('div')
                    card.appendChild(icon)
                    let weatherIcon = "http://openweathermap.org/img/wn/" + data.daily[1].weather[0].icon + ".png"
                    icon.innerHTML = "<img src=" + weatherIcon + ">"
                    
                    let temp = document.createElement('div')
                    temp.classList.add('card-text')
                    card.appendChild(temp)
                    temp.textContent = "Temp: " + data.daily[i].temp.day + ' \u00B0F'

                    let wind = document.createElement('div')
                    wind.classList.add('card-text')
                    card.appendChild(wind)
                    wind.textContent = "Wind: " + data.daily[i].wind_speed + " mph"

                    let humidity = document.createElement('div')
                    humidity.classList.add('card-text')
                    card.appendChild(humidity)
                    humidity.textContent = "Humidity: " + data.daily[i].humidity + "%"
        
                }
            })
        }
    })
}

// function to create search history buttons
function searchHistory() {
    cityList.innerHTML = ""
    for (let i = 0; i < historyList.length; i++) {
        let cityBtn = document.createElement('button')
        cityBtn.classList.add('city-btn', 'col-12')
        cityBtn.textContent = historyList[i]
        cityList.appendChild(cityBtn)

        // displays weather data when city button is clicked
        cityBtn.addEventListener("click", function(event) {
            this.value = cityBtn.textContent
            cityName = this.value
            getCoordinates(cityName)
        })
    }
}   

function pageLoad() {
    if (historyList.length) {
        let lastSearch = historyList[historyList.length-1]
        getCoordinates(lastSearch)
    }
    else {
        cityDisplayed.textContent = "Welcome to Weather Dashboard!"
        cityDisplayed.style.color = "#66a1c5"
    }
}
    
// function to set local storage
function setLocalStorage() {
    historyList.push(cityName)
    localStorage.setItem("city", JSON.stringify(historyList))
}

// search button preventing from refreshing, calling all the functions above and clearing search form
searchBtn.addEventListener("click", function(event) { 
    event.preventDefault()
    cityName = searchInputEl.value.trim()
    console.log(cityName)
    if (cityName) {
        getCoordinates(cityName)
        setLocalStorage()
        searchHistory()
        
    }
    
    searchInputEl.value = ""
    
})

searchHistory()
pageLoad()