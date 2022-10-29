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
let nextContainer = document.querySelector('.next .container');
const cityNameInp = document.querySelector('#cityName');
const searchCity = document.querySelector('#searchCity');
const yourLocationWeather = document.querySelector('#yourLocationWeather');

// fetch data from openWeather API
const getWeatherDataByCity = async (cityName) => {
	let response = await fetch(
		`${BASE_URL}q=${cityName}&appid=${API_KEY}&units=metric`
	);
	return await response.json();
};

//get weather data by location
const getWeatherDataByLocation = async (lat, lon) => {
	let response = await fetch(
		`${BASE_URL}lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
	);
	return await response.json();
};

//fetch api for the next 8 days
const weatherForNextDays = async (cityName) => {
	let response = await fetch(
		`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}/next7days?unitGroup=metric&key=23VPXAF7FCGPMNCAXB9QQK7SY`
	);
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
		//refresh data for current city
		dataRefresher();
	}
}

//toastr options
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
    <h2 id="currCity" class="cityName">${city}</h2>
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

//render the map in the map window
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

//render the weather for the next 7 days
function renderNext(days) {
	nextContainer.innerHTML = '';
	let html = '';
	days.forEach((day, index) => {
		const { datetime, tempmax, tempmin, conditions, preciptype } = day;
		let today;
		switch (new Date(datetime).getDay()) {
			case 0:
				today = 'Sunday';
				break;
			case 1:
				today = 'Monday';
				break;
			case 2:
				today = 'Tuesday';
				break;
			case 3:
				today = 'Wednesday';
				break;
			case 4:
				today = 'Thursday';
				break;
			case 5:
				today = 'Friday';
				break;
			case 6:
				today = 'Saturday';
		}

		html += `
		 <div class='day-${index + 1} zoom'>
			<div class='dayDetails'>
				<p class='date'>${datetime}</p>
				<p class='name'>${today}</p>
			</div>
			<div class='temps'>
				<p class='morning'>
					<i class='gg-sun'></i>${Math.trunc(tempmax)} <sup>o</sup>C
				</p>
				<p class='night'>
					<i class='fa-regular fa-moon'></i>${Math.trunc(tempmin)} <sup>o</sup>C
				</p>
				<p class='state'>${
					(preciptype?.at(0) ?? conditions)
						.replace('Partially cloudy', 'Cloudy')
						.charAt(0)
						.toUpperCase() +
					(preciptype?.at(0) ?? conditions)
						.replace('Partially cloudy', 'Cloudy')
						.slice(1)
				}</p>
			</div>
		</div>
		`;
	});

	nextContainer.insertAdjacentHTML('afterbegin', html);
}

//get current location and render data
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
			return name;
		});
		weatherForNextDays(
			`${position.coords.latitude},${position.coords.longitude}`
		).then(({ days }) => renderNext(days));
	}, showError);
}

getCurrentLocation();



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

//make the spinner refresh the weather data for the targeted city
function dataRefresher() {
	let currCity = document.getElementById('currCity').innerHTML;
	getWeatherDataByCity(currCity).then((data) => {
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
		weatherForNextDays(currCity).then(({ days }) => {
			renderNext(days);
		});
		mainContent.hidden = false;
		preloader.style.display = 'none';
	});
}




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
			toastr.error("Location doesn't exist.");
		});
	weatherForNextDays(cityName).then(({ days }) => {
		renderNext(days);
	});
}
searchCity.addEventListener('submit', searchHandler);