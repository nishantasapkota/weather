const apiKey = "ba791b84cedde7a962a247256f519444" // Replace with your OpenWeather API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="
const defaultCity = "Kathmandu"; // Set default city

const searchForm = document.getElementById("cityInput")
const searchButton = document.getElementById("searchButton")
const weatherInfo = document.getElementById("weatherInfo")

async function fetchWeatherData(city = defaultCity) {
  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`)
    const data = await response.json()

    if (data.cod === "404") {
      weatherInfo.innerHTML = `<p class="text-red-500 text-center">City not found. Please try again.</p>`
      return
    }

    const cityName = data.name
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const weatherCondition = data.weather[0].main
    const weatherDescription = data.weather[0].description
    const temperature = Math.round(data.main.temp)
    const feelsLike = Math.round(data.main.feels_like)
    const pressure = data.main.pressure
    const humidity = data.main.humidity
    const windSpeed = data.wind.speed
    const windDirection = data.wind.deg
    const icon = data.weather[0].icon
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`

    weatherInfo.innerHTML = `
      <div class="text-center mb-6">
        <h2 class="text-3xl font-bold text-gray-800">${cityName}</h2>
        <p class="text-gray-600">${date}</p>
      </div>
      <div class="flex items-center justify-center mb-6">
        <img src="${iconUrl}" alt="${weatherDescription}" class="w-32 h-32">
        <div class="ml-4">
          <p class="text-5xl font-bold text-gray-800">${temperature}°C</p>
          <p class="text-xl text-gray-600">Feels like ${feelsLike}°C</p>
        </div>
      </div>
      <p class="text-xl text-center text-gray-700 mb-6"><strong>${weatherCondition}</strong> (${weatherDescription})</p>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-blue-100 rounded-xl p-4 flex flex-col items-center">
          <i class="fas fa-tachometer-alt text-2xl text-blue-500 mb-2"></i>
          <p class="text-gray-700"><strong>Pressure</strong></p>
          <p class="text-gray-600">${pressure} hPa</p>
        </div>
        <div class="bg-green-100 rounded-xl p-4 flex flex-col items-center">
          <i class="fas fa-tint text-2xl text-green-500 mb-2"></i>
          <p class="text-gray-700"><strong>Humidity</strong></p>
          <p class="text-gray-600">${humidity}%</p>
        </div>
        <div class="bg-yellow-100 rounded-xl p-4 flex flex-col items-center">
          <i class="fas fa-wind text-2xl text-yellow-500 mb-2"></i>
          <p class="text-gray-700"><strong>Wind Speed</strong></p>
          <p class="text-gray-600">${windSpeed} m/s</p>
        </div>
        <div class="bg-purple-100 rounded-xl p-4 flex flex-col items-center">
          <i class="fas fa-compass text-2xl text-purple-500 mb-2"></i>
          <p class="text-gray-700"><strong>Wind Direction</strong></p>
          <p class="text-gray-600">${windDirection}°</p>
        </div>
      </div>
    `
  } catch (err) {
    console.log(err)
    weatherInfo.innerHTML = `<p class="text-red-500 text-center">An error occurred. Please try again later.</p>`
  }
}

// Call fetchWeatherData with default city on page load
fetchWeatherData(); // Fetch weather data for Kathmandu initially

searchButton.addEventListener("click", () => {
  const city = searchForm.value.trim()
  if (city) {
    fetchWeatherData(city)
    searchForm.value = ""
  } else {
    weatherInfo.innerHTML = `<p class="text-red-500 text-center">Please enter a city name.</p>`
  }
})

// Add event listener for Enter key
searchForm.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchButton.click()
  }
})
