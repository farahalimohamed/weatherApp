const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');
const forecastCards = document.querySelectorAll('.card');
const weatherContainer = document.querySelector('.weather-container');
const spinner = document.querySelector('#loadingSpinner');

const key = 'a89dc0104a364dff9a901622241312';

async function getWeather(location) {
    try {
        weatherContainer.style.display = 'none';
        spinner.classList.remove('d-none');
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location}&days=3`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const weatherData = await response.json();

        forecastCards.forEach((card, index) => {
            const dayForecast = weatherData.forecast.forecastday[index];
            const currentDay = weatherData.current;

            if (dayForecast) {
                const dayElem = card.querySelector('.day');
                const dateElem = card.querySelector('.today-date');
                const tempElem = card.querySelector('.temp');
                const conditionElem = card.querySelector('.condition');
                const cityElem = card.querySelector('.city');
                const iconElem = card.querySelector('.weather-icon');

                if (dayElem) dayElem.textContent = getDayName(dayForecast.date); 
                if (dateElem) dateElem.textContent = getDayWithMonth(dayForecast.date);
                if (tempElem) tempElem.textContent = `${Math.round(dayForecast.day.avgtemp_c)}°C`;
                if (conditionElem) conditionElem.textContent = dayForecast.day.condition.text;
                if (cityElem) cityElem.textContent = weatherData.location.name;
                if (iconElem) iconElem.src = `https:${dayForecast.day.condition.icon}`;

                if (index === 0) {
                    const windElem = card.querySelector('.wind');
                    const conditionPercentElem = card.querySelector('.condition-percent');
                    const directionElem = card.querySelector('.direction');

                    if (windElem) {
                        windElem.innerHTML = `<i class="fas fa-wind fa-fw" style="color: #868B94;"></i> <span>${dayForecast.day.maxwind_kph} km/h</span>`;
                        windElem.style.display = 'block';
                    }
                    if (conditionPercentElem) {
                        conditionPercentElem.innerHTML = `<i class="fas fa-tint fa-fw" style="color: #868B94;"></i> <span>${dayForecast.day.daily_chance_of_rain}%</span>`;
                        conditionPercentElem.style.display = 'block';
                    }
                    if (directionElem) {
                        directionElem.innerHTML = `<i class="fas fa-compass fa-fw" style="color: #868B94;"></i> <span>${currentDay.wind_dir}</span>`;
                        directionElem.style.display = 'block';
                    }
                } else {
                    const windElem = card.querySelector('.wind');
                    const conditionPercentElem = card.querySelector('.condition-percent');
                    const directionElem = card.querySelector('.direction');

                    if (windElem) windElem.style.display = 'none';
                    if (conditionPercentElem) conditionPercentElem.style.display = 'none';
                    if (directionElem) directionElem.style.display = 'none';
                }
            }
        });
    } catch (error) {
        console.error('Detailed Weather fetch error:', error);
        forecastCards.forEach(card => {
            card.innerHTML = `<div class="col-12 text-center text-danger">Could not fetch weather data: ${error.message}</div>`;
        });
    } finally{
        spinner.classList.add('d-none');
        weatherContainer.style.display = 'block';
    }
}

function showToast(message) {
    const toastEl = document.querySelector('#locationToast');
    const toastBody = toastEl.querySelector('.toast-body');
    toastBody.textContent = message;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}
function getCurrentLocation() {
    weatherContainer.style.display = 'none';
    spinner.classList.remove('d-none');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const location = `${lat},${lon}`;
                getWeather(location);
                spinner.classList.add('d-none');
                weatherContainer.style.display = 'block';
            },
            error => {
                console.error('Error getting location:', error);
                showToast('Unable to fetch your location.');
                getWeather('Cairo');
                spinner.classList.add('d-none');
                weatherContainer.style.display = 'block';
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
        getWeather('Cairo');
        spinner.classList.add('d-none');
        weatherContainer.style.display = 'block';
    }
}


function getDayName(dateString) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
}

function getDayWithMonth(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()} ${getMonthName(dateString)}`;
}

function getMonthName(dateString) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = new Date(dateString);
    return months[monthName.getMonth()];
}

searchInput.addEventListener('input', () => {
    const location = searchInput.value.trim();
    if (location.length > 2) {
        getWeather(location);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    getCurrentLocation();
});
