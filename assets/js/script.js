var openWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?"
var coordinatesURL = "https://api.openweathermap.org/geo/1.0/direct?q="
var iconURL = "https://openweathermap.org/img/wn/"
var apiKey = "f3dba74b10e97d17df14938e32c71b69";
var searchButton = document.querySelector("#search-btn");
var cityEl = document.querySelector(".city");
var tempEl = document.querySelector(".temp");
var windEl = document.querySelector(".wind");
var humidityEl = document.querySelector(".humidity");
var searchCard = document.querySelector(".card-footer");

var date = dayjs().format("DD/MM/YYYY")
var city;

document.getElementsByClassName("weather-info")[0].style.display = "none";
document.getElementsByClassName("forecast")[0].style.display = "none";

searchButton.addEventListener("click", function (event) {
    city = document.querySelector("#city").value;
    weather();
});

//Get weather from OpenWeatherAPI 
function weather() {
    //Get coordinates from city name
    var cityCoordinatesURL = coordinatesURL + city + "&appid=" + apiKey;

    fetch(cityCoordinatesURL).then(function (response) {
        console.log(response)
        return response.json();
    })
        .then(function (data) {
            console.log(data)
            cityLat = data[0].lat;
            cityLon = data[0].lon;

            //Get information of weather forecast
            var weatherCallURL = openWeatherURL + "lat=" + cityLat + "&lon=" + cityLon + "&appid=" + apiKey

            fetch(weatherCallURL).then(function (response) {
                return response.json();
            })
                .then(function (data) {
                    localFunc();
                    //Today's Weather
                    document.getElementsByClassName("weather-info")[0].style.display = "";
                    cityEl.textContent = city + " " + date
                    var temp = data.list[0].main.temp;
                    tempEl.textContent = "Temperature: " + temp + " " + "Fº"
                    var wind = data.list[0].wind.speed;
                    windEl.textContent = "Wind: " + wind + " " + "MPH"
                    var humidity = data.list[0].main.humidity;
                    humidityEl.textContent = "Humidity: " + humidity + " " + "%"

                    //5-day forecast
                    document.getElementsByClassName("forecast")[0].style.display = "";
                    for (var i = 1; i <= 5; i++) {
                        var dates = dayjs().add(i, "day").format("DD/MM/YYYY")
                        $("#date0" + i).text(dates)
                        temp = data.list[i].main.temp;
                        $("#temp0" + i).text("Temperature: " + temp + " " + "Fº")
                        wind = data.list[i].wind.speed;
                        $("#wind0" + i).text("Wind: " + wind + " " + "MPH")
                        humidity = data.list[i].main.humidity;
                        $("#humidity0" + i).text("Humidity: " + humidity + " " + "%")
                    }
                })
        });
}

function localFunc() {
    var cityButton = JSON.parse(localStorage.getItem("city"));
    console.log("city buttn", cityButton)
    
    if (!cityButton) {
        localStorage.setItem("city", JSON.stringify([city]));
    } else {
        if (cityButton.includes(city)) {
            return;
        }
        cityButton.unshift(city);
        localStorage.setItem("city", JSON.stringify(cityButton));
        var citiesBtn = document.createElement("button");
        citiesBtn.setAttribute("class", "btn btn-outline-primary w-100 search-history")
        citiesBtn.textContent = city

        searchCard.appendChild(citiesBtn);
        citiesBtn.addEventListener("click", function (event) {
            city = event.target.textContent
            weather();
        })
    }

}

function displayBtn() {
    var cityButton = JSON.parse(localStorage.getItem("city"));
    if (cityButton) {
        for (var i = 0; i < cityButton.length; i++) {
            var citiesBtn = document.createElement("button");
            citiesBtn.setAttribute("class", "btn btn-outline-primary w-100 search-history")
            citiesBtn.textContent = cityButton[i]

            searchCard.appendChild(citiesBtn);
            citiesBtn.addEventListener("click", function (event) {
                city = event.target.textContent
                weather();
            })
        }
    }

}

displayBtn();






//al guardar en local storage que el botón sea el nombre de la ciudad y al dar click al botón se vuelva a correr toda la función de weather
