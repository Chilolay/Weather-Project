//#region Current Date/time
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

function formatDate(_date) {
  return `<div>${days[_date.getDay()]}, ${
    months[_date.getMonth()]
  } ${_date.getDate()}</div>`;
}

function formatTime() {
  return `${now.getHours()}:${now.getMinutes()}`;
}

function newInnerHtml() {
  let newDateAndTime = `${formatDate(new Date())} ${formatTime()}`;
  return newDateAndTime;
}

let date = document.querySelector("#currentDate");
date.innerHTML = newInnerHtml();
//#endregion

//#region Search
function searchInput(event) {
  event.preventDefault();
  let apiKey = "ef7a2bb41d1b15fcd08f581e9f05537a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue.value}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then((response) => {
    let temp = Math.round(response.data.main.temp);
    let currentTemp = document.querySelector("#currentTemp");
    currentTemp.innerHTML = `${temp}°F`;

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
//#endregion

//#region Current Location button
function showTemp(response) {
  let temp = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector("#currentTemp");
  currentTemp.innerHTML = `${temp}°F`;
  let h1 = document.querySelector("h1, #currentCity");
  h1.innerHTML = response.data.name;
}
function getLocation(position) {
  let apiKey = "ef7a2bb41d1b15fcd08f581e9f05537a";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemp);
}

let btnCurrentLocation = document.querySelector("#current");
btnCurrentLocation.addEventListener("click", () =>
  navigator.geolocation.getCurrentPosition(getLocation)
);
//#endregion

// //#region C/F display change
// function changeUnitToCelsius() {
//     let currentTemp = document.querySelector("#currentTemp");
//     currentTemp.innerHTML = "15°";
// }

// let unitC = document.querySelector("#celsius")
// unitC.addEventListener("click", changeUnitToCelsius);

// function changeUnitToFahrenheit() {
//   let currentTemp = document.querySelector("#currentTemp");
//   currentTemp.innerHTML = "59°";
// }

// let unitF = document.querySelector("#fahrenheit");
// unitF.addEventListener("click", changeUnitToFahrenheit);
// //#endregion
