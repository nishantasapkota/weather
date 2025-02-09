document.addEventListener('DOMContentLoaded', function() {
    fetchWeatherData('Kathmandu');
});

document.getElementById('searchButton').addEventListener('click', function () {
    const city = document.getElementById('cityInput').value;
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

function fetchWeatherData(city) {
    if (!navigator.onLine) {
        const storedData = localStorage.getItem(city);
        if (storedData) {
            displayWeatherData(JSON.parse(storedData));
        } else {
            document.getElementById('weatherInfo').innerHTML =
                '<p class="text-center text-gray-500">No weather data available offline for this city.</p>';
        }
        return;
    }

    fetch(`connection.php?q=${city}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                localStorage.setItem(city, JSON.stringify(data));
                displayWeatherData(data);
            } else {
                document.getElementById('weatherInfo').innerHTML =
                    '<p class="text-center text-gray-500">No weather data found for this city.</p>';
            }
        })
        .catch((error) => {
            console.error('Error fetching weather data:', error);
        });
}

function displayWeatherData(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    const currentWeather = data[0];
    const forecast = data.slice(1, 6);

    let html = `
        <h2 class="text-3xl font-bold mb-6">Weather Forecast for ${currentWeather.city}</h2>
        <div class="mb-8">
            <h3 class="text-2xl font-bold mb-4">Current Weather</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="text-center">
                    <div class="text-6xl font-bold text-blue-500">${currentWeather.temperature}°C</div>
                    <div class="text-gray-500">Temperature</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl mb-2">
                        <img src="http://openweathermap.org/img/wn/${currentWeather.icon}.png" alt="${currentWeather.condition}" class="inline-block">
                    </div>
                    <div class="text-gray-500">${currentWeather.condition}</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-blue-500">${currentWeather.humidity}%</div>
                    <div class="text-gray-500">Humidity</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-blue-500">${currentWeather.wind_speed} m/s</div>
                    <div class="text-gray-500">Wind Speed</div>
                </div>
            </div>
        </div>
        <div>
            <h3 class="text-2xl font-bold mb-4">5-Day Forecast</h3>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
    `;

    forecast.forEach((day, index) => {
        const date = new Date(day.timestamp);
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
        html += `
            <div class="bg-gray-50 rounded-xl p-4 text-center">
                <div class="font-semibold mb-2">${dayName}</div>
                <div class="text-4xl mb-2">
                    <img src="http://openweathermap.org/img/wn/${day.icon}.png" alt="${day.condition}" class="inline-block">
                </div>
                <div class="text-2xl font-bold">${day.temperature}°C</div>
                <div class="text-gray-500">${day.condition}</div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    weatherInfo.innerHTML = html;
}