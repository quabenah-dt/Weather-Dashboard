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

// container
const container = document.querySelector('.container');

// API KEY
const apiKey = '9d751db450eb388f855509b8ae7bccb8';

// NOT FOUND
const notFound = document.getElementById('not-found-container');

// weather info
const weatherInfo = document.querySelector('.weatherinfo');

// daily report
const dailyReport = document.querySelector('.daily-report');

// weather icon
const weatherIcon = document.querySelector('.weather-icon img');    

// temperature
const temperature = document.querySelector('.temp');

// humidity
const humidity = document.querySelector('.humidity');

// wind speed
const windSpeed = document.querySelector('.wind-speed');

// wind direction
const windDirection = document.querySelector('.wind-direction');

// pressure
const pressure = document.querySelector('.pressure');

// visibility
const visibility = document.querySelector('.visibility');   

// USER LOCATION
const userLocation = document.getElementById('user-location');

userLocation.addEventListener('change', async function() {
    if (userLocation.value.trim() !== '') {
        await updateWeatherInfo(userLocation.value);
        userLocation.value = '';
        userLocation.blur();
    }
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

async function updateWeatherInfo(userLocation) {
    const weatherData = await getFetchData('weather', userLocation);
   
    if (weatherData.cod !== 200) {
        showDisplayError(notFound);
        return;
    }

    showWeatherInfo(weatherData);
} 

function showDisplayError(notFound) {
    notFound.style.display = 'block';
    container.style.display = 'none';
}

function showWeatherInfo(weatherData) {
    notFound.style.display = 'none';
    container.style.display = 'block';
}


