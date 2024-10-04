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
const container = document.querySelector('.container');


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

        if (data.cod == 404) {  // Use loose equality (==) instead of strict equality (===)
            // Handle city not found
            container.style.display = 'none';
            notFound.style.display = 'block';
            return;
        } else if (data.cod == 200) {  // Use loose equality (==) instead of strict equality (===)
            container.style.display = '';
            notFound.style.display = 'none';
        }

        updateWeatherDisplay(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateWeatherDisplay(data) {
    // Update weather information
    // container.style.display = 'flex';
    // notFound.style.display = 'none';

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



// Define an array of countries, temperatures, and icons
const countries = [
    { name: 'UAE', city: 'Dubai' },
    { name: 'USA', city: 'New York' },
    { name: 'Canada', city: 'Toronto' },
    { name: 'Australia', city: 'Sydney' },
    { name: 'Germany', city: 'Berlin' },
    { name: 'Japan', city: 'Tokyo' },
    { name: 'Brazil', city: 'Rio de Janeiro' },
    { name: 'South Africa', city: 'Cape Town' },
];

const weatherIcons = [
    './Assets/images/weather images/clouds.png',
    './Assets/images/weather images/clear.png',
    './Assets/images/weather images/rain.png',
    './Assets/images/weather images/cloudy.png',
    './Assets/images/weather images/thunder.png',
    './Assets/images/weather images/snow.png',
    './Assets/images/weather images/mist.png'
];

// Get the other countries items
const otherCountriesItems = document.querySelectorAll('.other-countries-item');

// Function to fetch weather data for a single city
async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return {
        temperature: Math.round(data.main.temp),
        icon: getWeatherIcon(data.weather[0].icon),
        high: Math.round(data.main.temp_max),
        low: Math.round(data.main.temp_min)
    };
}

// Function to fetch weather data for all countries
async function fetchAllWeatherData() {
    const promises = countries.map(country => fetchWeatherData(country.city));
    return Promise.all(promises);
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Modified function to update the other countries items
async function updateOtherCountries() {
    try {
        // Shuffle the countries array
        const shuffledCountries = shuffleArray([...countries]);
        const weatherData = await Promise.all(shuffledCountries.slice(0, 8).map(country => fetchWeatherData(country.city)));
        
        shuffledCountries.slice(0, 8).forEach((country, index) => {
            if (otherCountriesItems[index]) {
                const imgElement = otherCountriesItems[index].querySelector('img');
                const tempElement = otherCountriesItems[index].querySelector('.other-countries-item-temp');
                const nameElement = otherCountriesItems[index].querySelector('.other-countries-item-info p:first-child');
                const highLowElement = otherCountriesItems[index].querySelector('.other-countries-item-info p:last-child');

                const { temperature, icon, high, low } = weatherData[index];

                // Use the Image constructor to preload the image
                const img = new Image();
                img.onload = function() {
                    imgElement.src = this.src;
                };
                img.src = `./Assets/images/weather images/${icon}.png`;

                tempElement.textContent = `${temperature}°`;
                nameElement.textContent = country.name;
                highLowElement.textContent = `H:${high}° L:${low}°`;
            }
        });
    } catch (error) {
        console.error('Error updating weather data:', error);
    }
}

// Update the other countries items every 30 seconds
setInterval(updateOtherCountries, 30000);

// Initial update
updateOtherCountries();



// get the daily report items
const dailyReportItems = document.querySelectorAll('.daily-report-item');

// function to get a random weather icon
function getRandomWeatherIcon() {
    return weatherIcons[Math.floor(Math.random() * weatherIcons.length)];
}

// function to update the daily report items    
function updateDailyReport() {
    dailyReportItems.forEach((item, index) => {
        item.querySelector('img').src = getRandomWeatherIcon();
        item.querySelector('p:first-child').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        item.querySelector('p:last-child').textContent = `${Math.floor(Math.random() * 30)}°`;
    });
}


   

    
