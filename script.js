// Select DOM elements for search functionality
const searchInput = document.querySelector('.search input');
const searchIcon = document.querySelector('.search .material-symbols-outlined');

// Event listener for input changes
searchInput.addEventListener('input', function() {
    // Hide search icon when there's text in the input
    if (this.value.length > 0) {
        searchIcon.style.display = 'none';
    } else {
        // Show search icon when input is empty
        searchIcon.style.display = 'block';
    }
});

// Event listener for input focus
searchInput.addEventListener('focus', function() {
    // Hide search icon when input is focused
    searchIcon.style.display = 'none';
});

// Event listener for input blur (losing focus)
searchInput.addEventListener('blur', function() {
    // Show search icon if input is empty when losing focus
    if (this.value.length === 0) {
        searchIcon.style.display = 'block';
    }
});

//  WEARHER INFORMATION

// Get user's geolocation
navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
});

// Success callback for geolocation
function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log("Latitude:", latitude, "Longitude:", longitude);
    // Fetch weather data using coordinates
    getWeatherByCoords(latitude, longitude);
}

// Error callback for geolocation
function error(err) {
    console.error('Error getting location:', err.message);
    // Alert user to enter location manually if geolocation fails
    alert("Unable to retrieve your location. Please enter your location manually.");
}   

// API configuration
const apiKey = '9d751db450eb388f855509b8ae7bccb8';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Select DOM elements for weather display
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

// Function to fetch weather data using coordinates
async function getWeatherByCoords(latitude, longitude) {
    try {
        const response = await fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Event listener for search input
userInput.addEventListener('change', async function() {
    if (userInput.value.trim() !== '') {
        await updateWeather(userInput.value);
        userInput.value = '';
        userInput.blur();
    }
    console.log(userInput.value);
});

// Function to update weather based on city input
async function updateWeather(city) {
    try {
        const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        console.log(data);

        if (data.cod == 404) {
            // Hide main container and show 'not found' message
            container.style.display = 'none';
            notFound.style.display = 'block';
            return;
        } else if (data.cod == 200) {
            // Show main container and hide 'not found' message
            container.style.display = '';
            notFound.style.display = 'none';
        }

        updateWeatherDisplay(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Function to update the weather display with fetched data
function updateWeatherDisplay(data) {
    // Update location
    locationText.innerHTML = `<span class="material-symbols-outlined">pin_drop</span>${data.name}, ${data.sys.country}`;
    
    // Update date
    const currentDate = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    dateText.innerHTML = `<span class="material-symbols-outlined">calendar_month</span>${currentDate.toLocaleDateString('en-US', options)}`;

    // Update temperature and description
    temperatureElement.textContent = `${Math.round(data.main.temp)}°`;
    weatherDescription.textContent = data.weather[0].description;
    feelsLikeTemp.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;

    // Update weather icon
    const iconCode = data.weather[0].icon;
    const iconUrl = `./Assets/images/weather images/${getWeatherIcon(iconCode)}.png`;
    weatherIcon.innerHTML = `<img src="${iconUrl}" alt="weather-icon" class="weather-icon-img">`;

    // Update detailed weather information
    updateWeatherDetails(data);
}

// Function to map API icon codes to local image files
function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'clear', '01n': 'clear',
        '02d': 'clouds', '02n': 'clouds',
        '03d': 'clouds', '03n': 'clouds',
        '04d': 'clouds', '04n': 'clouds',
        '09d': 'rain', '09n': 'rain',
        '10d': 'rain', '10n': 'rain',
        '11d': 'thunder', '11n': 'thunder',
        '13d': 'snow', '13n': 'snow',
        '50d': 'mist', '50n': 'mist'
    };
    return iconMap[iconCode] || 'clear';
}

// Function to update detailed weather information
function updateWeatherDetails(data) {
    const detailsItems = weatherDetails.querySelectorAll('.weather-details-item');
    
    // Update Wind Status
    detailsItems[0].querySelector('.number').innerHTML = `${data.wind.speed.toFixed(2)}<span>m/s</span>`;
    detailsItems[0].querySelector('li:last-child').textContent = getWindDescription(data.wind.speed);
    
    // Update Humidity
    detailsItems[1].querySelector('.number').innerHTML = `${data.main.humidity}<span>%</span>`;
    detailsItems[1].querySelector('li:last-child').textContent = getHumidityDescription(data.main.humidity);
    
    // Update Visibility
    detailsItems[2].querySelector('.number').innerHTML = `${(data.visibility / 1000).toFixed(1)}<span>km</span>`;
    detailsItems[2].querySelector('li:last-child').textContent = getVisibilityDescription(data.visibility);
    
    // Update Pressure
    detailsItems[3].querySelector('.number').innerHTML = `${data.main.pressure}<span>hPa</span>`;
    detailsItems[3].querySelector('li:last-child').textContent = getPressureDescription(data.main.pressure);

    // Force DOM update
    weatherDetails.style.display = 'none';
    weatherDetails.offsetHeight; // Trigger reflow
    weatherDetails.style.display = '';
}

// Helper functions to get descriptions for weather details
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

function getWindDescription(windSpeed) {
    if (windSpeed < 0.5) return 'Calm';
    if (windSpeed < 3.3) return 'Light air';
    if (windSpeed < 5.5) return 'Light breeze';
    if (windSpeed < 7.9) return 'Gentle breeze';
    if (windSpeed < 10.7) return 'Moderate breeze';
    if (windSpeed < 13.8) return 'Fresh breeze';
    return 'Strong breeze or higher';
}

function getVisibilityDescription(visibility) {
    const visibilityKm = visibility / 1000;
    if (visibilityKm < 1) return 'Very poor visibility';
    if (visibilityKm < 4) return 'Poor visibility';
    if (visibilityKm < 10) return 'Moderate visibility';
    if (visibilityKm < 20) return 'Good visibility';
    return 'Excellent visibility';
}

// Automatically get user's location and update weather on page load
navigator.geolocation.getCurrentPosition(success, error);

// Define an array of countries and their cities for the 'Other Countries' section
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

// Array of weather icon paths
const weatherIcons = [
    './Assets/images/weather images/clouds.png',
    './Assets/images/weather images/clear.png',
    './Assets/images/weather images/rain.png',
    './Assets/images/weather images/cloudy.png',
    './Assets/images/weather images/thunder.png',
    './Assets/images/weather images/snow.png',
    './Assets/images/weather images/mist.png'
];

// Select all 'Other Countries' items in the DOM
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

// Function to shuffle an array randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to update the 'Other Countries' section
async function updateOtherCountries() {
    try {
        // Shuffle the countries array and select the first 8
        const shuffledCountries = shuffleArray([...countries]);
        const weatherData = await Promise.all(shuffledCountries.slice(0, 8).map(country => fetchWeatherData(country.city)));
        
        // Update each 'Other Countries' item with fetched data
        shuffledCountries.slice(0, 8).forEach((country, index) => {
            if (otherCountriesItems[index]) {
                const imgElement = otherCountriesItems[index].querySelector('img');
                const tempElement = otherCountriesItems[index].querySelector('.other-countries-item-temp');
                const nameElement = otherCountriesItems[index].querySelector('.other-countries-item-info p:first-child');
                const highLowElement = otherCountriesItems[index].querySelector('.other-countries-item-info p:last-child');

                const { temperature, icon, high, low } = weatherData[index];

                // Preload and set the weather icon
                const img = new Image();
                img.onload = function() {
                    imgElement.src = this.src;
                };
                img.src = `./Assets/images/weather images/${icon}.png`;

                // Update temperature, country name, and high/low temperatures
                tempElement.textContent = `${temperature}°`;
                nameElement.textContent = country.name;
                highLowElement.textContent = `H:${high}° L:${low}°`;
            }
        });
    } catch (error) {
        console.error('Error updating weather data:', error);
    }
}

// Update 'Other Countries' section every 30 seconds
setInterval(updateOtherCountries, 30000);

// Initial update of 'Other Countries' section
updateOtherCountries();

// Select all daily report items in the DOM
const dailyReportItems = document.querySelectorAll('.daily-report-item');

// Function to get a random weather icon
function getRandomWeatherIcon() {
    return weatherIcons[Math.floor(Math.random() * weatherIcons.length)];
}

// Function to update the daily report items (placeholder functionality)
function updateDailyReport() {
    dailyReportItems.forEach((item, index) => {
        item.querySelector('img').src = getRandomWeatherIcon();
        item.querySelector('p:first-child').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        item.querySelector('p:last-child').textContent = `${Math.floor(Math.random() * 30)}°`;
    });
}

// Note: The updateDailyReport function is not called in this code snippet.
// Consider implementing a proper forecast API call to populate this section with real data.
