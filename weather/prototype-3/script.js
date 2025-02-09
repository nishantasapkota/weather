const searchForm = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const weatherInfo = document.getElementById("weatherInfo");

async function fetchWeatherData(city) {
  try {
    let data;

    if (navigator.onLine) {
      // Fetch data from the API
      const response = await fetch(`http://localhost/report/weather/prototype-3/connection.php?q=${city}`);
      
      // Check if the response is OK and is JSON
      if (!response.ok) {
        const errorText = await response.text(); // Get the response body as text
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text(); // Get the response body as text
        throw new Error(`Received non-JSON response, response: ${errorText}`);
      }

      data = await response.json();

      // Save data to localStorage
      localStorage.setItem(city, JSON.stringify(data));
    } else {
      // Retrieve data from localStorage
      const cachedData = localStorage.getItem(city);
      if (cachedData) {
        data = JSON.parse(cachedData);
      } else {
        weatherInfo.innerHTML = `<p>No cached data available for ${city}. Please go online to fetch data.</p>`;
        return;
      }
    }

    if (data.length === 0) {
      weatherInfo.innerHTML = `<p>City not found. Please try again.</p>`;
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
    weatherInfo.innerHTML = `<p>An error occurred: ${err.message}. Please try again later.</p>`;
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