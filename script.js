//  Current Date/Time
let now = new Date();
let apiKey = "ef7a2bb41d1b15fcd08f581e9f05537a";
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let day = days[now.getDay()];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let fahrenheit = 59;
let celsius = 15;

function formatDate(_date) {
  return `<div>${days[_date.getDay()]}, ${
    months[_date.getMonth()]
  } ${_date.getDate()}</div>`;
}

function formatTime() {
  return `${now.getHours()}:${now.getMinutes()}`;
}

function newInnerHtml() {
  let newDateAndTime =
    formatDate(new Date()) + "\u00A0" + "\u00A0" + formatTime();
  return newDateAndTime;
}

let date = document.querySelector("#currentDate");
date.innerHTML = newInnerHtml();

// Search
function searchInput(event) {
  event.preventDefault();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue.value}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then((response) => {
    displayIcon(response);
    weatherDescription(response);
    windSpeed(response);
    humidity(response);

    fahrenheit = response.data.main.temp;

    let temp = Math.round(response.data.main.temp);
    let currentTemp = document.querySelector("#currentTemp");
    currentTemp.innerHTML = `${temp}`;

    let changeCity = document.querySelector("#currentCity");
    if (inputValue.value.trim().length) {
      let newCity =
        inputValue.value[0].toUpperCase() + inputValue.value.substring(1);
      changeCity.innerHTML = newCity;
    }
  });

  //Get current location, lat and long and send it to displayForcast
  navigator.geolocation.getCurrentPosition(displayForecast);
}

let inputValue = document.querySelector("#input");
let btnSearch = document.querySelector("button, #search");
btnSearch.addEventListener("click", (event) => searchInput(event));
inputValue.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchInput(event);
  }
});

// Current Location button
function showTemp(response) {
  let temp = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector("#currentTemp");
  let h1 = document.querySelector("h1, #currentCity");

  fahrenheit = response.data.main.temp;

  currentTemp.innerHTML = `${temp}`;
  h1.innerHTML = response.data.name;
  displayIcon(response);
  weatherDescription(response);
  windSpeed(response);
  humidity(response);
}

function getLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemp);
}

let btnCurrentLocation = document.querySelector("#current");
btnCurrentLocation.addEventListener("click", () => {
  //
  navigator.geolocation.getCurrentPosition((pos) => {
    getLocation(pos);
    displayForecast(pos)
  });
});

// Current Weather/Icon
function displayIcon(response) {
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}

// Current Weather description
function weatherDescription(response) {
  let description = document.querySelector("#weatherDescription");
  description.innerHTML = response.data.weather[0].description;
}

// Current Wind Speed
function windSpeed(response) {
  let speed = document.querySelector("#windSpeed");
  speed.innerHTML = Math.round(response.data.wind.speed);
}

// current Humidity
function humidity(response) {
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;
}

// C/F display change
function showCelsiusTemp(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#currentTemp");
  let celsiusTemperature = ((fahrenheit - 32) * 5) / 9;
  celsius = celsiusTemperature;
  currentTemp.innerHTML = Math.round(celsiusTemperature);

  changeCurrentDaysTemp("max", "celsius");
  changeCurrentDaysTemp('min','celsius')

}

/**
 * Changes the current temperatures for imperial to metric for low and high temps
 * @function
 * @param {string} temp_guage - String name of a class for the daily max or min forecast
 * @param {string} temp_type - Either imperial or celsius, used for internal conversion from and to
 */

function changeCurrentDaysTemp(temp_guage, temp_type){

    let temp_state = {
      min: "weather-forecast-daily-min",
      max: "weather-forecast-daily-max",
      type: {
        celsius: {
          formula: (temp) => {
            return Math.round(((Number(temp) - 32) * 5) / 9);
          },
          from: "imperial",
          to: "celsius",
        },
        imperial: {
          formula: (temp) => {
            return Math.round(Number(temp * (9 / 5) + 32));
          },
          from: "celsius",
          to: "imperial",
        },
      },
    };

    let weather_collection = Array.from(
      document.getElementsByClassName(temp_state[temp_guage])
    );

    weather_collection.forEach((v) => {
      let attributes = Array.from(v.attributes);
      attributes = attributes.filter(
        (v) =>
          v.name == "data-measurement" &&
          v.nodeValue == temp_state.type[temp_type].from
      );

      if (attributes.length) {
        v.innerHTML = temp_state.type[temp_type].formula(v.innerHTML)
        attributes[0].nodeValue = temp_state.type[temp_type].to;
      }
    });
}

function showFahrenheitTemp(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#currentTemp");
  let fahrenheitTemp = Math.round(celsius * (9 / 5) + 32);
  currentTemp.innerHTML = fahrenheitTemp;

    changeCurrentDaysTemp("max", "imperial");
    changeCurrentDaysTemp("min", "imperial");
}

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", showCelsiusTemp);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

// 5 day forecast cards
function displayForecast(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  axios.get(apiUrl).then(
    res => 
      forecast(res.data.daily)
    
  )
}

const forecast = (days) => {
  let forecast = document.querySelector("#weather-forecast");
  days = days.splice(0,5)
  let forecastHTML = `<div class="row">`;
  days.forEach((day) => {
    forecastHTML += `<div class="col">
            <div class="card">
              <div class="card-body">
                <div class="card-title">${formatDay(day.dt)}</div>
                <img
                  src="http://openweathermap.org/img/wn/${
                    day.weather[0].icon
                  }@2x.png"
                  alt=""
                />
              <div class="card-subtext">
                <span class="weather-forecast-daily-max" data-measurement="imperial">${Math.round(
                  day.temp.max
                )}</span>
                <span id="degree-icon">°</span>
                <span class="weather-forecast-daily-min" data-measurement="imperial">${Math.round(
                  day.temp.min
                )}</span>
                <span id="degree-icon">°</span>
              </div>
              </div>
            </div>
          </div>`;
  });

  forecastHTML += `</div>`;
  forecast.innerHTML = forecastHTML;
};

navigator.geolocation.getCurrentPosition(displayForecast);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}
