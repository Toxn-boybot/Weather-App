// Global Variables
const API_KEY = 'fe586bfd0c39e7cce1749fe151398673';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?';
let mainContent = document.querySelector('main');
mainContent.hidden = true;
let todaySection = document.querySelector('.today');
let tempContainer = document.querySelector('.temp');
let detailsContainer = document.querySelector('.values');
let preloader = document.querySelector('.preloader');
let mapContainer = document.querySelector('.map');
const cityNameInp = document.querySelector('#cityName');
const searchCity = document.querySelector('#searchCity');
const yourLocationWeather = document.querySelector('#yourLocationWeather');

//gives you the weather data for your current location
yourLocationWeather.addEventListener('click', getCurrentLocation);

//searches the city name input
function searchHandler(e) {
	e.preventDefault();
	let cityName = cityNameInp.value;
	getWeatherDataByCity(cityName)
		.then((data) => {
			const { name, main, weather, wind, visibility } = data;
			renderTemp(name, Math.trunc(main.temp), weather[0].main);
			renderDetails(
				main.feels_like,
				main.humidity,
				wind.speed,
				(visibility * 0.001).toFixed(2),
				main.temp_max,
				main.temp_min
			);
			renderMap(name);
			mainContent.hidden = false;
			preloader.style.display = 'none';
		})
		.catch((e) => {
			toastr.error('Location doesn\'t exist.');
		});;
}
searchCity.addEventListener('submit', searchHandler);
// Approach #1
// const getData = (cityName) => {
//   let response = fetch(`${BASE_URL}q=${cityName}&appid=${API_KEY}`)
//     .then((res) => res.json())
//     .then((data) => console.log(data));
// };

// Approach #2
const getWeatherDataByCity = async (cityName) => {
	let response = await fetch(
		`${BASE_URL}q=${cityName}&appid=${API_KEY}&units=metric`
	)
	return await response.json();
};

//Make the refresh button spin on click
function spinning() {
	const spinner = document.getElementById('spinner');
	spinner.classList.add('spinner');

	//Show notification when clicking the refresh button using toastr js
	toastr.success('Weather updated');
	//remove the focus from the button
	const refreshButton = document.getElementById('refreshButton');
	refreshButton.blur();
	//remove the spin class again
	const spinTime = setTimeout(RemoveSpin, 1000);
	function RemoveSpin() {
		spinner.classList.remove('spinner');
	}
}

toastr.options = {
	closeButton: true,
	debug: false,
	newestOnTop: false,
	progressBar: false,
	positionClass: 'toast-top-right',
	preventDuplicates: false,
	onclick: null,
	showDuration: '300',
	hideDuration: '1000',
	timeOut: '5000',
	extendedTimeOut: '1000',
	showEasing: 'swing',
	hideEasing: 'linear',
	showMethod: 'fadeIn',
	hideMethod: 'fadeOut',
};

//rendering the temperature section
function renderTemp(city, temp, state) {
	tempContainer.innerHTML = '';
	const html = `
    <div class="icon">
      <button id="refreshButton" onclick="spinning()">
        <i id="spinner" type="button" class="fa-solid fa-rotate"></i>
      </button>
    </div>
    <h2 class="cityName">${city}</h2>
    <h2 class="cityTemp">
      ${temp} <sup>o</sup>C
    </h2>
    <h2 class="State">${state}</h2>
  `;
	tempContainer.insertAdjacentHTML('afterbegin', html);
}

//rendering the details section
function renderDetails(FT, humid, windS, visi, maxT, minT) {
	detailsContainer.innerHTML = '';
	const html = `
							<p class="feltTemp">${FT}<sup>o</sup> C</p>
							<p class="humidity">${humid}%</p>
							<p class="wind">${windS} Km/h</p>
							<p class="visibility">${visi} Km</p>
							<p class="maxTemp">${maxT}<sup>o</sup> C</p>
							<p class="minTemp">${minT}<sup>o</sup> C</p>
	`;
	detailsContainer.insertAdjacentHTML('afterbegin', html);
}
//change the map location in the map window
function renderMap(cityName) {
	mapContainer.innerHTML = '';
	const html = `
	<iframe 
							height="300"
							width="100%"
							loading="lazy"
							allowfullscreen=""
							referrerpolicy="no-referrer-when-downgrade"
							src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAq15HbfCRMW7RqNb5LUNyOLyfzpYI0wl4&amp;q=${cityName}"
						></iframe>
	`;
	mapContainer.insertAdjacentHTML('afterbegin', html);
}
function getCurrentLocation() {
	navigator.geolocation.getCurrentPosition((position) => {
		getWeatherDataByLocation(
			position.coords.latitude,
			position.coords.longitude
		).then((data) => {
			const { name, main, weather, wind, visibility } = data;
			renderTemp(name, Math.trunc(main.temp), weather[0].main);
			renderDetails(
				main.feels_like,
				main.humidity,
				wind.speed,
				(visibility * 0.001).toFixed(2),
				main.temp_max,
				main.temp_min
			);
			renderMap(name);
			mainContent.hidden = false;
			preloader.style.display = 'none';
			toastr.success('Weather updated');
		});
	}, showError);
}

getCurrentLocation();

const getWeatherDataByLocation = async (lat, lon) => {
	let response = await fetch(
		`${BASE_URL}lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
	);
	return await response.json();
};

function showError(error) {
	console.log(error);
	switch (error.code) {
		case error.PERMISSION_DENIED:
			mainContent.hidden = true;
			preloader.style.display = 'flex';
			toastr.error('User denied the request for Geolocation.');
			break;
		case error.POSITION_UNAVAILABLE:
			mainContent.hidden = true;
			preloader.style.display = 'flex';
			toastr.error('Location information is unavailable.');
			break;
		case error.TIMEOUT:
			mainContent.hidden = true;
			preloader.style.display = 'flex';
			toastr.error('The request to get user location timed out.');
			break;
		case error.UNKNOWN_ERROR:
			mainContent.hidden = true;
			preloader.style.display = 'flex';
			toastr.error('An unknown error occurred.');
			break;
	}
}
