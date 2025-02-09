<?php


error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$serverName = "localhost";
$userName = "root";
$password = "";
$databaseName = "prototype2";

// Establish database connection
$conn = mysqli_connect($serverName, $userName, $password, $databaseName);

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

// Get city name from query parameter or default to "Kathmandu"
$cityName = isset($_GET['q']) ? $_GET['q'] : "Kathmandu";

// Check if data is older than 2 hours
$checkDataQuery = "SELECT * FROM weather WHERE city = '$cityName' AND timestamp >= NOW() - INTERVAL 2 HOUR";
$result = mysqli_query($conn, $checkDataQuery);

if (mysqli_num_rows($result) === 0) {
  // Fetch new data from OpenWeather API
  $apiKey = "ba791b84cedde7a962a247256f519444"; // Replace with your OpenWeather API key
  $apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=$cityName&units=metric&appid=$apiKey";
  $response = file_get_contents($apiUrl);
  $data = json_decode($response, true);

  if ($data['cod'] === 200) {
    // Extract relevant data
    $city = $data['name'];
    $condition = $data['weather'][0]['main'];
    $temperature = $data['main']['temp'];
    $pressure = $data['main']['pressure'];
    $humidity = $data['main']['humidity'];
    $windSpeed = $data['wind']['speed'];
    $windDirection = $data['wind']['deg'];
    $icon = $data['weather'][0]['icon'];

    // Insert new data into the database
    $insertQuery = "INSERT INTO weather (city, `condition`, temperature, pressure, humidity, wind_speed, wind_direction, icon, timestamp)
                    VALUES ('$city', '$condition', $temperature, $pressure, $humidity, $windSpeed, $windDirection, '$icon', NOW())";
    mysqli_query($conn, $insertQuery);
  } else {
    echo json_encode([]);
    exit;
  }
}

// Fetch data from the database
$fetchQuery = "SELECT * FROM weather WHERE city = '$cityName' ORDER BY timestamp DESC LIMIT 1";
$result = mysqli_query($conn, $fetchQuery);
$rows = [];

while ($row = mysqli_fetch_assoc($result)) {
  $rows[] = $row;
}

echo json_encode($rows);
?>