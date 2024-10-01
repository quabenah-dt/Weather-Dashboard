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



// USER LOCATION

const userLocation = document.getElementById('user-location')

userLocation.addEventListener('change', function() {
    if (userLocation.value.trim() !== '') {
        updateWeatherInfo();
        userLocation.value = '';
        userLocation.blur();
    }
});

function updateWeatherInfo(userLocation) {
    const weatherData = getFetchData();
}

