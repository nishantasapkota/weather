CREATE DATABASE IF NOT EXISTS prototype2;
USE prototype2;

CREATE TABLE IF NOT EXISTS weather (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  `condition` VARCHAR(100) NOT NULL,
  temperature FLOAT NOT NULL,
  pressure FLOAT NOT NULL,
  humidity FLOAT NOT NULL,
  wind_speed FLOAT NOT NULL,
  wind_direction FLOAT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  timestamp DATETIME NOT NULL
);