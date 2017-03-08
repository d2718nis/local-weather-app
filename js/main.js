const iconCodes = {
	'wi-forecast-io-clear-day': {
		'icon': 'day-sunny',
		'label': 'Sunny day'
	},
	'wi-forecast-io-clear-night': {
		'icon': 'night-clear',
		'label': 'Clear night'
	},
	'wi-forecast-io-cloudy': {
		'icon': 'cloudy',
		'label': 'Cloudy'
	},
	'wi-forecast-io-fog': {
		'icon': 'fog',
		'label': 'Fog'
	},
	'wi-forecast-io-hail': {
		'icon': 'hail',
		'label': 'Hail'
	},
	'wi-forecast-io-partly-cloudy-day': {
		'icon': 'day-cloudy',
		'label': 'Cloudy day'
	},
	'wi-forecast-io-partly-cloudy-night': {
		'icon': 'night-cloudy',
		'label': 'Cloudy night'
	},
	'wi-forecast-io-rain': {
		'icon': 'rain',
		'label': 'Rain'
	},
	'wi-forecast-io-sleet': {
		'icon': 'sleet',
		'label': 'Sleet'
	},
	'wi-forecast-io-snow': {
		'icon': 'snow',
		'label': 'Snow'
	},
	'wi-forecast-io-thunderstorm': {
		'icon': 'thunderstorm',
		'label': 'Thunderstorm'
	},
	'wi-forecast-io-tornado': {
		'icon': 'tornado',
		'label': 'Tornado'
	},
	'wi-forecast-io-wind': {
		'icon': 'strong-wind',
		'label': 'Strong wind'
	}
};

// ========== Forecast Only ==========
// Display forecast
function displayForecast(json) {
	//displayLocalTime();
	displayForecastIcon(json.daily.data, $('.forecast-icon'));
	displayForecastTemperature(json.daily.data, $('.celsius-forecast > .forecast-temperature'), $('.fahrenheit-forecast > .forecast-temperature'));
}
// Display forecast icons
function displayForecastIcon(jsonList, iconElements) {
	jsonList.forEach(function(item, index) {
		if (index > 0) {
			let icon, label;
			if (iconCodes['wi-forecast-io-' + item.icon]) {
				icon = iconCodes['wi-forecast-io-' + item.icon].icon;
				label = iconCodes['wi-forecast-io-' + item.icon].label;
			} else {
				icon = 'na';
				label = item.icon.charAt(0).toUpperCase() + item.icon.slice(1).replace(/-/g, ' ');
			}
			iconElements.eq(index - 1).removeClass();
			iconElements.eq(index - 1).addClass('forecast-icon wi wi-' + icon);
			iconElements.eq(index - 1).attr('alt', label);
		}
	});
}
// Display current Forecast temperature
function displayForecastTemperature(jsonList, tempCelsElements, tempFahrElements) {
	var temperatureCels;
	var temperatureFahr;
	var tempMin = 10000;
	var tempMax = -275;
	var scale;
	// Display forecast temperature
	jsonList.forEach(function(item, index) {
		if (index > 0) {
			temperatureCels = Math.round((item.temperatureMin + item.temperatureMax) / 2);
			temperatureFahr = Math.round(convertCelsToFahr(temperatureCels));
			tempMin = temperatureCels < tempMin ? temperatureCels : tempMin;
			tempMax = temperatureCels > tempMax ? temperatureCels : tempMax;
			temperatureCels = temperatureCels > 0 ? '+' + temperatureCels : temperatureCels;
			temperatureFahr = temperatureFahr > 0 ? '+' + temperatureFahr : temperatureFahr;
			// Write temperature values
			tempCelsElements.eq(index - 1).text(temperatureCels);
			tempFahrElements.eq(index - 1).text(temperatureFahr);
		}
	});
	var tempMinAbs = tempMin < 0 ? -tempMin : tempMin;
	var tempMaxAbs = tempMax < 0 ? -tempMax : tempMax;
	scale = calculateChartScale(tempMinAbs, tempMaxAbs, $('.forecast-chart-top'));
	// Display forecast chart bars
	jsonList.forEach(function(item, index) {
		if (index > 0) {
			temperatureCels = Math.round((item.temperatureMin + item.temperatureMax) / 2);
			if (temperatureCels > 0) {
				// .forecast-chart-top:nth > .forecast-chart-bar
				$('.forecast-chart-bar').each(function(barIndex, barItem) {
					if (Math.floor(barIndex / 2) == index - 1 && $(this).parent().hasClass('forecast-chart-top')) {
						$(this).height(Math.floor(Math.abs(temperatureCels) * scale));
					}
				});
			} else if (temperatureCels < 0) {
				// .forecast-chart-bottom:nth > .forecast-chart-bar
				$('.forecast-chart-bar').each(function(barIndex, barItem) {
					if (Math.floor(barIndex / 2) == index - 1 && $(this).parent().hasClass('forecast-chart-bottom')) {
						$(this).height(Math.floor(Math.abs(temperatureCels) * scale));
					}
				});
			}
		}
	});
}
// Calculate chart scale
function calculateChartScale(tempMinAbs, tempMaxAbs, elemForBarPlacement) {
	if (tempMinAbs > tempMaxAbs && tempMinAbs != 0) {
		return elemForBarPlacement.eq(0).height() / tempMinAbs;
	} else if(tempMaxAbs > tempMinAbs && tempMaxAbs != 0) {
		return elemForBarPlacement.eq(0).height() / tempMaxAbs;
	}
	return 0;
}
// ========== Forecast Only ==========



// ========== Weather Only ==========
function displayWeather(json, city) {
	displayLocation('country', city);
	displayLocalTime();
	displayWeatherIcon(json.currently.icon, json.daily.data[0].sunriseTime, json.daily.data[0].sunsetTime, '#weather-icon', '.conditions-text');
	displayWeatherTemperature(json.currently.temperature);
	displayWind(json.currently.windSpeed, json.currently.windBearing);
	displayHumidity(json.currently.humidity);
}
// Display weather icon using https://erikflowers.github.io/weather-icons/
function displayWeatherIcon(iconId, sunriseTime, sunsetTime, iconElement, labelElement) {
	let icon, label;
	if (iconCodes['wi-forecast-io-' + iconId]) {
		icon = iconCodes['wi-forecast-io-' + iconId].icon;
		label = iconCodes['wi-forecast-io-' + iconId].label;
	} else {
		icon = 'na';
		label = iconId.charAt(0).toUpperCase() + iconId.slice(1).replace(/-/g, ' ');
	}
	$(iconElement).removeClass();
	$(iconElement).addClass('wi wi-' + icon);
	$(iconElement).attr('alt', label);
	if (labelElement != '')
		$(labelElement).text(label);
}
// Display current Weather temperature
function displayWeatherTemperature(temperature) {
	var temperatureCels = Math.round(temperature);
	var temperatureFahr = Math.round(convertCelsToFahr(temperatureCels));
	temperatureCels = temperatureCels > 0 ? '+' + temperatureCels : temperatureCels;
	temperatureFahr = temperatureFahr > 0 ? '+' + temperatureFahr : temperatureFahr;
	$('.celsius-weather > .temperature-value').text(temperatureCels);
	$('.fahrenheit-weather > .temperature-value').text(temperatureFahr);
}
// Display current wind speed and wind degree
function displayWind(windSpeed, windDegree) {
	var windSpeedMph = Math.round(windSpeed / 0.44704 * 100) / 100;
	$('.metric-wind > .wind-value').text(windSpeed);
	$('.imperial-wind > .wind-value').text(windSpeedMph);
	$('#wind-direction').removeClass();
	$('#wind-direction').addClass('wi wi-wind from-' + Math.round(windDegree) + '-deg');
}
// Display location
function displayLocation(countryCode, cityName) {
	$('.location').text(cityName);
}
// Display humidity
function displayHumidity(humidity) {
	$('#humidity').text(humidity);
}
// ========== Weather Only ==========



// ========== Helpers ==========
// Return 'day' either 'night' depending on time and sunrise/sunset
function calculateDayNightTime(sunriseTime, sunsetTime) {
	var now = new Date();
	var nowHours = Math.round(now.getTime() / 1000);
	if (!(nowHours > sunriseTime && nowHours < sunsetTime)) {
		return 'night';
	}
	return 'day';
}
// Display Date and Time
function displayLocalTime() {
		var now = new Date();
		var hours = now.getHours();
		var minutes = now.getMinutes();
		var days = ['Sunday','Monday','Tuesday','Wednesday',
			'Thursday','Friday','Saturday'];
		var months = ['January','February','March','April','May','June',
			'July','August','September','October','November','December'];
		var day = days[now.getDay()].slice(0, 3);
		var month = months[now.getMonth()].slice(0, 3);
		// Weather date
		$('.date').text(day + ', ' + now.getDate() + ' ' + month);
		// Forecast date for 5 days
		$('.forecast-date').each(function(index) {
			// +1 for the day after that (tomorrow and so forth)
			var dayIndex = now.getDay() + index + 1;
			// if dayIndex out of days array, go to the beginning
			dayIndex = dayIndex >= days.length ? dayIndex - days.length : dayIndex;
			$(this).text(days[dayIndex].slice(0, 3));
		});
		// TODO: autoupdate maybe?
		// var t = setTimeout(startClock, 500);
}
// Celcius to Fahrenheits
function convertCelsToFahr(tempCels) {
	return tempCels * 1.8 + 32;
}
// ========== Helpers ==========



// ========== API requests ==========
const apiKeys = ['5cd469b839b56731a61e8d6090778380',
	'12007aa00bea21e0c8f9c65e26dd8194',
	'7fa872912245327ebd26b60bfebdc458',
	'3b216c44c5be1bedc54d65a7f3414f6c'];
// Forecast.io Weather API request
function requestWeatherAndForecast(apiKey, lat, lon, city) {
	var getWeatherInfo = $.getJSON(
		`https://api.darksky.net/forecast/${apiKey}/${lat},${lon}?exclude=minutely,hourly,alerts,flags&units=si&callback=?`);
	getWeatherInfo.then(function(data) {
		displayWeather(data, city);
		displayForecast(data);
	});
	getWeatherInfo.catch(function(err) {
		alert('WeatherInfo: ' + JSON.stringify(err));
	});
}
// Try to retrieve position by ip address
function requestByIp() {
	// https://freegeoip.net/json/ returns .latitude, .longitude
	// http://ip-api.com/json returns .lat, .lon
	var getIP = $.getJSON('https://freegeoip.net/json/');
	getIP.then(function(ipData) {
		// Weather and Forecast API request
		requestWeatherAndForecast(apiKeys[0], ipData.latitude, ipData.longitude, ipData.city);
	});
	getIP.catch(function(err) {
		alert('IPinfo: ' + JSON.stringify(err));
	});
}
// ========== API requests ==========


$(document).ready(function() {
	// Preload weather by ip API before navigator.geolocation
	requestByIp();

	if (navigator.geolocation) {
		getGeoLocation = navigator.geolocation.getCurrentPosition(function(pos) {
			var lat = pos.coords.latitude;
			var lon = pos.coords.longitude;
			// Need to get city name, forecast.io doesn't provide one
			var getIP = $.getJSON('https://freegeoip.net/json/');
			getIP.then(function(ipData) {
				// Weather and Forecast API request
				requestWeatherAndForecast(apiKeys[0], lat, lon, ipData.city);
			});
			getIP.catch(function(err) {
				alert('IPinfo: ' + JSON.stringify(err));
			});
		}, 
		function(err) {
			console.log('NavigatorGeolocation: ' + JSON.stringify(err));
		});
	}

	// Imperaial/metric switch logics
	$('.celsius-switch').on('click', function() {
		if (!$(this).hasClass('units-switch-active')) {
			$('.fahrenheit-switch').removeClass('units-switch-active');
			$(this).addClass('units-switch-active');
			$('.fahrenheit-weather, .fahrenheit-forecast, .imperial-wind').css('display', 'none');
			$('.celsius-weather, .celsius-forecast, .metric-wind').css('display', 'inline-block');
		}
	});
	$('.fahrenheit-switch').on('click', function() {
		if (!$(this).hasClass('units-switch-active')) {
			$('.celsius-switch').removeClass('units-switch-active');
			$(this).addClass('units-switch-active');
			$('.celsius-weather, .celsius-forecast, .metric-wind').css('display', 'none');
			$('.fahrenheit-weather, .fahrenheit-forecast, .imperial-wind').css('display', 'inline-block');
		}
	});

	// Easter egg
	$('.app-title').on('click', function() {
		if ($('.app-title').text() == 'Local Weather App') {
			$('.app-title').text('Make America Code Again');
		} else {
			$('.app-title').text('Local Weather App');
		}
	});
});
