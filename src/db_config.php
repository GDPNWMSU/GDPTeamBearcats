<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gdp";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
$GLOBALS['conn'] = $conn;
// Check connection
if ($conn->connect_error) {
   die("Connection failed: " . $conn->connect_error);
}

?>
