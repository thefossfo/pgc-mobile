<?php

//Aggregrate date for upcoming launches from the space devs launch library "launcher" endpoint
//Connect to the database
require_once '/var/www/html/pgc-mobile/include/db.php';
$dbhost = '127.0.0.1';
$dbuser = 'root';
$dbpass = 'password';
$dbname = 'pgc';
$db = new db($dbhost, $dbuser, $dbpass, $dbname);

//Launch data
// SpaceDevs API endpoint for upcoming launches
$api_url = 'https://ll.thespacedevs.com/2.2.0/launcher';

// Fetch data from the SpaceDevs API
$response = file_get_contents($api_url);

if ($response === false) {
    die("Failed to fetch data from the SpaceDevs API.");
}

// Decode the JSON response
$data = json_decode($response, true);

if ($data === null || !isset($data['results'])) {
    die("Failed to decode API response or 'results' not found.");
}

// Close the database connection
$db->close();

?>
