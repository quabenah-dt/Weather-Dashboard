// Get the search input and search icon elements
const searchInput = document.querySelector('.search input');
const searchIcon = document.querySelector('.search .material-symbols-outlined');

// Add event listener for input changes
searchInput.addEventListener('input', function() {
    // If there's text in the input, hide the search icon
    if (this.value.length > 0) {
        searchIcon.style.display = 'none';
    } else {
        // If the input is empty, show the search icon
        searchIcon.style.display = 'block';
    }
});

// Add event listener for focus
searchInput.addEventListener('focus', function() {
    // Hide the search icon when the input is focused
    searchIcon.style.display = 'none';
});

// Add event listener for blur (losing focus)
searchInput.addEventListener('blur', function() {
    // If the input is empty when losing focus, show the search icon
    if (this.value.length === 0) {
        searchIcon.style.display = 'block';
    }
});

// API KEY
const apiKey = '9d751db450eb388f855509b8ae7bccb8';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';

// Select DOM elements
// const searchButton = document.getElementById('search-button');
const userInput = document.getElementById('user-location');
const weatherInfo = document.querySelector('.weatherinfo');
const notFound = document.querySelector('.not-found');
const locationText = document.querySelector('.js-location-text');
const dateText = document.querySelector('.js-date-text-2');
const temperatureElement = document.querySelector('.js-temp');
const weatherDescription = document.querySelector('.temp-range');
const feelsLikeTemp = document.querySelector('.temp-range:last-child');
const weatherIcon = document.querySelector('.weather-icon img');
const dailyReport = document.querySelector('.daily-report');
const weatherDetails = document.querySelector('.weather-details');

// event listener for search button
userInput.addEventListener('change', async function() {
    if (userInput.value.trim() !== '') {
        await updateWeather(userInput.value);
        userInput.value = '';
        userInput.blur();
    }
    console.log(userInput.value);
});

async function getFetchData(endpoint, userLocation) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${userLocation}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function updateWeather(location) {
    try {
        const weatherData = await getFetchData('weather', location);
        // Update the UI with the weather data
        if (weatherData.cod === 200) {
            // Show weather info and hide not found message
            weatherInfo.style.display = 'block'
            notFound.style.display = 'none';

            // Update location & date
            locationText.innerHTML = `<p class="location-text js-location-text"><span class="material-symbols-outlined">pin_drop</span>${weatherData.name}</p>`;
            dateText.innerHTML = `<p class="location-text js-date-text"><span class="material-symbols-outlined">calendar_month</span>${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>`;
            
            // Update temperature
            temperatureElement.innerHTML = `${Math.round(weatherData.main.temp)}&deg;C`;

            // Update weather description
            weatherDescription.textContent = weatherData.weather[0].description;

            // Update feels like temperature
            feelsLikeTemp.textContent = `Feels like ${Math.round(weatherData.main.feels_like)}°C`;

            // // Update weather icon
            // const iconCode = weatherData.weather[0].icon;
            // weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
            // weatherIcon.alt = weatherData.weather[0].description;

            // // Update weather details
            // // You might need to adjust these selectors based on your HTML structure
            // document.querySelector('.humidity').textContent = `${weatherData.main.humidity}%`;
            // document.querySelector('.wind').textContent = `${weatherData.wind.speed} m/s`;
            // document.querySelector('.pressure').textContent = `${weatherData.main.pressure} hPa`;

            // Note: Daily report update would require additional API call to get forecast data
        } else {
            // Show not found message and hide weather info
            weatherInfo.style.display = 'none';
            notFound.style.display = 'flex';
        }
        console.log(weatherData);
    } catch (error) {
        console.error('Error updating weather info:', error);
        // Handle the error (e.g., show an error message to the user)
    }
}