<?php
// api_launches.php

// Set the content type to application/json
header('Content-Type: application/json');

// Enable CORS (for development purposes - adjust as needed for production)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Connect to the database
require_once '../include/db.php';
$dbhost = '127.0.0.1';
$dbuser = 'root';
$dbpass = 'password';
$dbname = 'pgc';
$db = new db($dbhost, $dbuser, $dbpass, $dbname);

// Pull the data
$db->query('SELECT * FROM launch_data WHERE date >= NOW() - INTERVAL 1 HOUR ORDER BY date,net_precision ASC;');
$launches = $db->fetchAll();

if ($launches) {
    // Process the fetched data to unescape all fields
    $unescaped_launches = [];
    foreach ($launches as $launch) {
        $unescaped_launch = []; // Create a new array for the unescaped data
        foreach ($launch as $key => $value) {
            if (is_string($value)) {
                $unescaped_launch[$key] = stripslashes($value);
            } else {
                $unescaped_launch[$key] = $value; // Keep non-string values as they are
            }
        }
        $unescaped_launches[] = $unescaped_launch;
    }
    // Encode the unescaped data as JSON
    echo json_encode($unescaped_launches);
} else {
    // If no launches are found, return an empty array or an appropriate message
    echo json_encode([]);
}

// Close the database connection (optional, as PHP will close it at the end of the script)
$db->close();

?>
