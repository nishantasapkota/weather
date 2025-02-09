const searchForm = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const weatherInfo = document.getElementById("weatherInfo");

async function fetchWeatherData(city) {
  try {
    const response = await fetch(`http://localhost/report/weather/prototype-2/connection.php?q=${city}`);
    const data = await response.json();

    if (data.length === 0) {
      weatherInfo.innerHTML = `<p>City not found or data is outdated. Please try again.</p>`;
      return;
    }

    const weather = data[0];
    const cityName = weather.city;
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const weatherCondition = weather.condition;
    const temperature = weather.temperature;
    const pressure = weather.pressure;
    const humidity = weather.humidity;
    const windSpeed = weather.wind_speed;
    const windDirection = weather.wind_direction;
    const icon = weather.icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    weatherInfo.innerHTML = `
      <h2>${cityName}</h2>
      <p>${date}</p>
      <img src="${iconUrl}" alt="${weatherCondition}">
      <p><strong>Weather:</strong> ${weatherCondition}</p>
      <p><strong>Temperature:</strong> ${temperature}°C</p>
      <p><strong>Pressure:</strong> ${pressure} hPa</p>
      <p><strong>Humidity:</strong> ${humidity}%</p>
      <p><strong>Wind:</strong> ${windSpeed} m/s at ${windDirection}°</p>
    `;
  } catch (err) {
    console.log(err);
    weatherInfo.innerHTML = `<p>An error occurred. Please try again later.</p>`;
  }
}

searchButton.addEventListener("click", () => {
  const city = searchForm.value.trim();
  if (city) {
    fetchWeatherData(city);
    searchForm.value = "";
  } else {
    weatherInfo.innerHTML = `<p>Please enter a city name.</p>`;
  }
});

// Set default city to Kathmandu on page load
fetchWeatherData("Kathmandu");