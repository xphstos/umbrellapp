// Loader
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function bodyState() {
    body.classList.toggle('loading');
    startScreen.classList.toggle('show');
    topBar.classList.toggle('show');
  }, 4000);
});



// Globals
var apiKey = "4fcfd0e36d9d6ef651e8c3db1492d16c",
  weatherApp = new XMLHttpRequest(),
  body = document.querySelector("body"),
  startScreen = document.querySelector("#wrapper .start-screen"),
  results = document.querySelector("#wrapper .results");
topBar = document.querySelector("#topbar");

// Reload
function reload() {
  location.reload();
}

// Add Bookmark
function bookmarkMe() {
  if ('sidebar' in window && 'addPanel' in window.sidebar) {
    window.sidebar.addPanel(location.href, document.title, "");
  } else if ( /*@cc_on!@*/ false) { // IE Favorite
    window.external.AddFavorite(location.href, document.title);
  } else { // webkit - safari/chrome
    alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
  }
}

// WeatherForm submit
function citySearch() {
  var city = document.querySelector("#cityname").value;
  getWeather(city);
}

// Geolocation 
function getLocation() {
  var message = document.querySelector("#geolocate .messages");

  // Not supported
  if (!navigator.geolocation) {
    message.innerHTML = "Geolocation is not supported by your browser";
    message.classList.toggle('hide');
    return;
  }

  function success(position) {
    var latitude = position.coords.latitude.toFixed(2);
    var longitude = position.coords.longitude.toFixed(2);

    getWeather(undefined, latitude, longitude);

  }

  function error() {
    message.innerHTML = "Unable to retrieve your location";
    message.classList.toggle('hide');
  }


  navigator.geolocation.getCurrentPosition(success, error);

}


function getWeather(city, lat, lon) {

  var currentCity = document.querySelector(".today .currentcity"),
    weatherIcon = document.querySelector(".today .weathericon i"),
    max = document.querySelector(".today .temperatures .max"),
    min = document.querySelector(".today .temperatures .min"),
    message = document.querySelector("#citysearch .messages");

  if (city && !lat && !lon) {
    weatherApp.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey, false);
  } else if (!city && lat && lon) {
    weatherApp.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey, false);
  }

  weatherApp.send();

  var weatherInfo = JSON.parse(weatherApp.response);

  if (validateRequest(weatherApp.status)) {

    currentCity.innerHTML = weatherInfo.name + ', ' + weatherInfo.sys.country;
    weatherIcon.classList.add('w-' + weatherInfo.weather[0].id);
    max.innerHTML = weatherInfo.main.temp_max + ' &deg;C';
    min.innerHTML = weatherInfo.main.temp_min + ' &deg;C';


    if (city && !lat && !lon) {
      getNextDays(city);
    } else if (!city && lat && lon) {
      getNextDays(undefined, lat, lon);
    }

    body.classList.remove('loading');
    body.classList.add('results');
    results.classList.add('show');

  } else {
    message.classList.toggle('hide');
    message.innerHTML = "There was an error! Please try again.";
  }
}


function getNextDays(city, lat, lon) {

  var nextDays = document.querySelector(".results .next-week"),
    max = document.querySelector(".next-week .temperatures .max"),
    min = document.querySelector(".next-week .temperatures .min");

  if (city && !lat && !lon) {
    weatherApp.open("GET", "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + apiKey, false);
  } else if (!city && lat && lon) {
    weatherApp.open("GET", "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey, false);
  }

  weatherApp.send();

  var weatherInfo = JSON.parse(weatherApp.response);

  nextDays.innerHTML = '';

  if (validateRequest(weatherApp.status)) {

    var nextDays = document.querySelector(".results .next-week"),
      newElements = populateMarkup(weatherInfo.list);

    nextDays.innerHTML = nextDays.innerHTML + newElements;

  } else if (weatherApp.status !== 200) {
    console.log("There was an error! Please try again.");
  }
}


function populateMarkup(dayData) {
  var max = document.querySelector(".next-week .temperatures .max"),
    min = document.querySelector(".next-week .temperatures .min"),
    weatherIcon = document.querySelector(".next-week .weathericon i"),
    newElement = '',
    date = new Date(),
    day = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat'
    ],
    nextDays = [];
  for (var dayCount = date.getDay() + 1, i = 0; i < 5; i++) {

    dayCount = dayCount > 6 ? 0 : dayCount;
    nextDays.push(day[dayCount]);

    newElement += '<li><div class="day">' + day[dayCount] + '</div>' +
                  '<div class="weathericon"><i class="w-' + dayData[i].weather[0].id + '"></i></div>' +
                  '<div class="temperatures">' +
                  '<span class="max">' + Math.round(dayData[i].main.temp_max) + ' &deg;C</span>' +
                  '<span class="min">' + Math.round(dayData[i].main.temp_min) + ' &deg;C</span>' +
                  '</div></li>';
    dayCount++;
  }
  return newElement;

}


function validateRequest(request) {
  return (request === 200);
}