//  Current Date/Time
let now = new Date();

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
  let apiKey = "ef7a2bb41d1b15fcd08f581e9f05537a";
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
  let apiKey = "ef7a2bb41d1b15fcd08f581e9f05537a";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemp);
}

let btnCurrentLocation = document.querySelector("#current");
btnCurrentLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(getLocation);
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

//C/F display change
function showCelsiusTemp(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#currentTemp");
  let celsiusTemperature = ((fahrenheit - 32) * 5) / 9;
  celsius = celsiusTemperature
  currentTemp.innerHTML = Math.round(celsiusTemperature);
}

function showFahrenheitTemp(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#currentTemp");
  let fahrenheitTemp = Math.round((celsius * (9/5)) + 32);
  currentTemp.innerHTML = fahrenheitTemp;
}

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", showCelsiusTemp);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);



