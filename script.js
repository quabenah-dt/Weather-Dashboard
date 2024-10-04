// // Get the search input and search icon elements
// const searchInput = document.querySelector('.search input');
// const searchIcon = document.querySelector('.search .material-symbols-outlined');

// // Add event listener for input changes
// searchInput.addEventListener('input', function() {
//     // If there's text in the input, hide the search icon
//     if (this.value.length > 0) {
//         searchIcon.style.display = 'none';
//     } else {
//         // If the input is empty, show the search icon
//         searchIcon.style.display = 'block';
//     }
// });

// // Add event listener for focus
// searchInput.addEventListener('focus', function() {
//     // Hide the search icon when the input is focused
//     searchIcon.style.display = 'none';
// });

// // Add event listener for blur (losing focus)
// searchInput.addEventListener('blur', function() {
//     // If the input is empty when losing focus, show the search icon
//     if (this.value.length === 0) {
//         searchIcon.style.display = 'block';
//     }
// });

// get my location
navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
});

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log("Latitude:", latitude, "Longitude:", longitude);
    // Call the function to get weather data using these coordinates
    getWeatherByCoords(latitude, longitude);
}

function error(err) {
    console.error('Error getting location:', err.message);
    // Fallback to a default location or prompt user to enter location manually
    alert("Unable to retrieve your location. Please enter your location manually.");
}   




// API KEY
const apiKey = '9d751db450eb388f855509b8ae7bccb8';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Select DOM elements
const userInput = document.getElementById('user-location');
const weatherInfo = document.querySelector('.weatherinfo');
const notFound = document.querySelector('.not-found');
const locationText = document.querySelector('.js-location-text');
const dateText = document.querySelector('.js-date-text-2');
const temperatureElement = document.querySelector('.js-temp');
const weatherDescription = document.querySelector('.temp-range');
const feelsLikeTemp = document.querySelector('.temp-range:last-child');
const weatherIcon = document.querySelector('.weatherinfo-icon');
const dailyReport = document.querySelector('.daily-report');
const weatherDetails = document.querySelector('.weather-details');

// Function to get weather data based on coordinates
async function getWeatherByCoords(latitude, longitude) {
    try {
        const response = await fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Modified success function to fetch weather data
function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);
    getWeatherByCoords(latitude, longitude);
}

// event listener for search button
userInput.addEventListener('change', async function() {
    if (userInput.value.trim() !== '') {
        await updateWeather(userInput.value);
        userInput.value = '';
        userInput.blur();
    }
    console.log(userInput.value);
});

async function updateWeather(city) {
    try {
        const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        console.log(data);

        if (data.cod === '404') {
            // Handle city not found
            weatherInfo.style.display = 'none';
            notFound.style.display = 'block';
            return;
        }

        updateWeatherDisplay(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateWeatherDisplay(data) {
    // Update weather information
    weatherInfo.style.display = 'flex';
    notFound.style.display = 'none';

    locationText.innerHTML = `<span class="material-symbols-outlined">pin_drop</span>${data.name}, ${data.sys.country}`;
    
    const currentDate = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    dateText.innerHTML = `<span class="material-symbols-outlined">calendar_month</span>${currentDate.toLocaleDateString('en-US', options)}`;

    temperatureElement.textContent = `${Math.round(data.main.temp)}°`;
    weatherDescription.textContent = data.weather[0].description;
    feelsLikeTemp.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;

    // Update weather icon
    const iconCode = data.weather[0].icon;
    const iconUrl = `./Assets/images/weather images/${getWeatherIcon(iconCode)}.png`;
    weatherIcon.innerHTML = `<img src="${iconUrl}" alt="weather-icon" class="weather-icon-img">`;

    // Update weather details
    updateWeatherDetails(data);
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'clear',
        '01n': 'clear',
        '02d': 'clouds',
        '02n': 'clouds',
        '03d': 'clouds',
        '03n': 'clouds',
        '04d': 'clouds',
        '04n': 'clouds',
        '09d': 'rain',
        '09n': 'rain',
        '10d': 'rain',
        '10n': 'rain',
        '11d': 'thunder',
        '11n': 'thunder',
        '13d': 'snow',
        '13n': 'snow',
        '50d': 'mist',
        '50n': 'mist'
    };
    return iconMap[iconCode] || 'clear';
}

function updateWeatherDetails(data) {
    const detailsItems = weatherDetails.querySelectorAll('.weather-details-item');
    
    // Update Wind Status
    detailsItems[0].querySelector('.number').innerHTML = `${data.wind.speed.toFixed(2)}<span>m/s</span>`;
    detailsItems[0].querySelector('li:last-child').textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    // Update Humidity
    detailsItems[1].querySelector('.number').innerHTML = `${data.main.humidity}<span>%</span>`;
    detailsItems[1].querySelector('li:last-child').textContent = getHumidityDescription(data.main.humidity);
    
    // Update Visibility
    detailsItems[2].querySelector('.number').innerHTML = `${(data.visibility / 1000).toFixed(1)}<span>km</span>`;
    detailsItems[2].querySelector('li:last-child').textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    // Update Pressure
    detailsItems[3].querySelector('li:first-child').textContent = 'Pressure';
    detailsItems[3].querySelector('.number').innerHTML = `${data.main.pressure}<span>hPa</span>`;
    detailsItems[3].querySelector('li:last-child').textContent = getPressureDescription(data.main.pressure);

    // Force a reflow to ensure the DOM updates
    weatherDetails.style.display = 'none';
    weatherDetails.offsetHeight; // Trigger reflow
    weatherDetails.style.display = '';
}

function getHumidityDescription(humidity) {
    if (humidity < 30) return 'Low humidity';
    if (humidity < 60) return 'Comfortable humidity';
    return 'High humidity';
}

function getPressureDescription(pressure) {
    if (pressure < 1000) return 'Low pressure';
    if (pressure > 1020) return 'High pressure';
    return 'Normal pressure';
}

// Automatically get user's location and update weather on page load
navigator.geolocation.getCurrentPosition(success, error);

function error() {
    console.log('Error getting location');
}