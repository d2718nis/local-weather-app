// ========== Forecast Only ==========
// Display forecast
function displayForecast(json) {
	//displayLocalTime();
	displayForecastIcon(json.list, $(".forecast-icon"));
	displayForecastTemperature(json.list, $(".forecast-temperature"));
}
// Display forecast icons
function displayForecastIcon(jsonList, iconElements) {
// TODO: do one JSON request instead of six here IMPORTANT
	var getIconsInfo = $.getJSON("https://gist.githubusercontent.com/tbranyen/62d974681dea8ee0caa1/raw/3405bfb2a76b7cbd90fde33d8536f0cd13706955/icons.json");
	getIconsInfo.then(function(json) {
		jsonList.forEach(function(item, index) {
			if (index > 0) {
				var code = item.weather[0].id;
				var icon = json[code].icon;
				// Note: 7xx and 9xx do not get prefixed w/ day/night
				if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
					//var timeOfTheDay = calculateDayNightTime(sunriseTime, sunsetTime);
					icon = "day-" + icon;
				}
				iconElements.eq(index - 1).removeClass();
				iconElements.eq(index - 1).addClass("forecast-icon wi wi-" + icon);
				iconElements.eq(index - 1).attr("alt", json[code].label);
			}
		});
	});
	getIconsInfo.catch(function(err) {
		alert("ForecastIconsInfo: " + JSON.stringify(err));
	});
}
// Display current Forecast temperature
function displayForecastTemperature(jsonList, temperatureElements) {
	var temperature;
	var tempMin = 10000;
	var tempMax = -275;
	var scale;
	// Display forecast temperature
	jsonList.forEach(function(item, index) {
		if (index > 0) {
			temperature = Math.round(item.temp.day - 273.15);
			tempMin = temperature < tempMin ? temperature : tempMin;
			tempMax = temperature > tempMax ? temperature : tempMax;
			temperature = temperature > 0 ? "+" + temperature : temperature;
			temperatureElements.eq(index - 1).text(temperature);
			// TODO: display chart bars
		}
	});
	// .height() / Math.abs() = Infinity for some reason
	var tempMinAbs = tempMin < 0 ? -tempMin : tempMin;
	var tempMaxAbs = tempMax < 0 ? -tempMax : tempMax;
	scale = calculateChartScale(tempMinAbs, tempMaxAbs, $(".forecast-chart-top"));
	// Display forecast chart bars
	jsonList.forEach(function(item, index) {
		if (index > 0) {
			temperature = Math.round(item.temp.day - 273.15);
			console.log(temperature);
			// TODO: fix this
			if (temperature > 0) {
				// .forecast-chart-top:nth > .forecast-chart-bar
				$(".forecast-chart-bar").each(function(barIndex, barItem) {
					if (Math.floor(barIndex / 2) == index - 1 && $(this).parent().hasClass("forecast-chart-top")) {
						$(this).height(Math.floor(Math.abs(temperature) * scale));
					}
				});
			} else if (temperature < 0) {
				// .forecast-chart-bottom:nth > .forecast-chart-bar
				$(".forecast-chart-bar").each(function(barIndex, barItem) {
					if (Math.floor(barIndex / 2) == index - 1 && $(this).parent().hasClass("forecast-chart-bottom")) {
						$(this).height(Math.floor(Math.abs(temperature) * scale));
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
// Display weather
function displayWeather(json) {
	displayLocation(json.sys.country, json.name);
	displayLocalTime();
	displayWeatherIcon(json.weather[0].id, json.sys.sunrise, json.sys.sunset, "#weather-icon", ".conditions-text");
	displayWeatherTemperature(json.main.temp);
	displayWind(json.wind.speed, json.wind.deg);
	displayHumidity(json.main.humidity);
	//$(".weather-window").css("display", "inline-block");
}
// Display weather icon using https://erikflowers.github.io/weather-icons/
function displayWeatherIcon(iconId, sunriseTime, sunsetTime, iconElement, labelElement) {
	// TODO: do one JSON request instead of six here IMPORTANT
	var getIconsInfo = $.getJSON("https://gist.githubusercontent.com/tbranyen/62d974681dea8ee0caa1/raw/3405bfb2a76b7cbd90fde33d8536f0cd13706955/icons.json");
	getIconsInfo.then(function(json) {
		var code = iconId;
		var icon = json[code].icon;
		// Note: 7xx and 9xx do not get prefixed w/ day/night
		if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
			var timeOfTheDay = calculateDayNightTime(sunriseTime, sunsetTime);
			if (timeOfTheDay == "night" && icon == "sunny") {
				icon = "clear";
			}
			icon = timeOfTheDay + "-" + icon;
		}
		$(iconElement).removeClass();
		$(iconElement).addClass("wi wi-" + icon);
		$(iconElement).attr("alt", json[code].label);
		if (labelElement != "")
			$(labelElement).text(json[code].label);
	});
	getIconsInfo.catch(function(err) {
		alert("WeatherIconInfo: " + JSON.stringify(err));
	});
}
// Display current Weather temperature
function displayWeatherTemperature(temperature) {
	var temperature = Math.round(temperature - 273.15);
	temperature = temperature > 0 ? "+" + temperature : temperature;
	$(".temperature-value").text(temperature);
}
// Display current wind speed and wind degree
function displayWind(windSpeed, windDegree) {
	$("#wind").text(windSpeed);
	$("#wind-direction").removeClass();
	$("#wind-direction").addClass("wi wi-wind from-" + Math.round(windDegree) + "-deg");
}
// Display location
function displayLocation(countryCode, cityName) {
	$(".location").text(cityName);
}
// Display humidity
function displayHumidity(humidity) {
	$("#humidity").text(humidity);
}
// ========== Weather Only ==========



// Return "day" either "night" depending on time and sunrise/sunset
function calculateDayNightTime(sunriseTime, sunsetTime) {
	var now = new Date();
	var nowHours = Math.round(now.getTime() / 1000);
	if (!(nowHours > sunriseTime && nowHours < sunsetTime)) {
		return "night";
	}
	return "day";
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
		$(".date").text(day + ", " + now.getDate() + " " + month);
		// Forecast date for 5 days
		$(".forecast-date").each(function(index) {
			$(this).text(days[now.getDay() + index + 1].slice(0, 3));
		});
		// TODO: autoupdate maybe?
		//var t = setTimeout(startClock, 500);
}

function rand256() {
	return Math.floor(Math.random() * 256);
}

$(document).ready(function() {
	// Testing purposes
	var randomIp = rand256() + "." + rand256() + "." + rand256() + "." + rand256();

	var getIP = $.getJSON("https://freegeoip.net/json/");
	getIP.then(function(ipData) {
		var lat = ipData.latitude;
		var lon = ipData.longitude;
		// Weather API request
		// freecodecamp's openweathermap.org API kery used here
		var getWeatherInfo = $.getJSON("https://jsonp.afeld.me/?callback=&url=\
			http%3A%2F%2Fapi.openweathermap.org%2Fdata%2F2.5%2Fweather%3Flat%3D" 
			+ lat + "%26lon%3D" + lon + "%26appid%3D061f24cf3cde2f60644a8240302983f2");
		getWeatherInfo.then(function(weatherData) {
			displayWeather(weatherData);
		});
		getWeatherInfo.catch(function(err) {
			alert("WeatherInfo: " + JSON.stringify(err));
		});
		// Forecast API request
		// cnt=6 because API returns first value for today
		var getForecastInfo = $.getJSON("https://jsonp.afeld.me/?callback=&url=\
			http%3A%2F%2Fapi.openweathermap.org%2Fdata%2F2.5%2Fforecast%2Fdaily%3Flat%3D" 
			+ lat + "%26lon%3D" + lon + "%26appid%3D061f24cf3cde2f60644a8240302983f2%26cnt=6");
		getForecastInfo.then(function(forecastData) {
			displayForecast(forecastData);
		});
		getForecastInfo.catch(function(err) {
			alert("ForecastInfo: " + JSON.stringify(err));
		});
	});
	getIP.catch(function(err) {
		alert("IPinfo: " + JSON.stringify(err));
	});

	// Easter egg
	$(".app-title").on("click", function() {
		if ($(".app-title").text() == "Local Weather App") {
			$(".app-title").text("Make America Code Again");
		} else {
			$(".app-title").text("Local Weather App");
		}
	});
});
