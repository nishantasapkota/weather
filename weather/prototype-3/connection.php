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

// Fetch 5 days of weather data from OpenWeather API
$apiKey = "ba791b84cedde7a962a247256f519444"; // Replace with your OpenWeather API key
$apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=$cityName&units=metric&appid=$apiKey";
$response = file_get_contents($apiUrl);
$data = json_decode($response, true);

if ($data['cod'] === "200") {
    $dailyData = []; // Array to hold daily aggregated data

    // Aggregate data for each day
    foreach ($data['list'] as $forecast) {
        $date = date('Y-m-d', $forecast['dt']); // Get the date

        // Initialize the entry if it doesn't exist
        if (!isset($dailyData[$date])) {
            $dailyData[$date] = [
                'city' => $data['city']['name'],
                'condition' => $forecast['weather'][0]['main'],
                'temperature' => $forecast['main']['temp'],
                'pressure' => $forecast['main']['pressure'],
                'humidity' => $forecast['main']['humidity'],
                'wind_speed' => $forecast['wind']['speed'],
                'wind_direction' => $forecast['wind']['deg'],
                'icon' => $forecast['weather'][0]['icon'],
                'timestamp' => date('Y-m-d H:i:s', $forecast['dt']) // Store the timestamp
            ];
        }
    }

    // Convert the associative array to a numerically indexed array
    $rows = array_values($dailyData);

    // Clear previous data for the city (optional)
    $deleteQuery = "DELETE FROM weather WHERE city = '{$rows[0]['city']}'";
    mysqli_query($conn, $deleteQuery);

    // Insert aggregated data into the database
    foreach ($rows as $entry) {
        $insertQuery = "INSERT INTO weather (city, `condition`, temperature, pressure, humidity, wind_speed, wind_direction, icon, timestamp)
                        VALUES ('{$entry['city']}', '{$entry['condition']}', {$entry['temperature']}, {$entry['pressure']}, {$entry['humidity']}, {$entry['wind_speed']}, {$entry['wind_direction']}, '{$entry['icon']}', '{$entry['timestamp']}')";
        mysqli_query($conn, $insertQuery);
    }

    // Fetch the data from the database to return
    $fetchQuery = "SELECT * FROM weather WHERE city = '{$rows[0]['city']}' ORDER BY timestamp DESC";
    $result = mysqli_query($conn, $fetchQuery);
    $finalRows = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $finalRows[] = $row;
    }

    // Return the aggregated data as a response
    echo json_encode($finalRows);
} else {
    echo json_encode([]);
    exit;
}
?>