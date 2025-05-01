<?php

//Connect to the database
require_once '../include/db.php';
$dbhost = '127.0.0.1';
$dbuser = 'root';
$dbpass = 'password';
$dbname = 'pgc';
$db = new db($dbhost, $dbuser, $dbpass, $dbname);

//Launch data
// SpaceDevs API endpoint for upcoming launches
$api_url = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/';

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

$launches = $data['results'];
$imported_count = 0;
$updated_count = 0;

// Loop through each launch in the API response
foreach ($launches as $launch) {
    $id = $db->escapeString($launch['id']);
    $name = $db->escapeString($launch['name']);
    $date = null;
    if (isset($launch['net'])) {
        try {
            $dateTime = new DateTime($launch['net']);
            $date = $dateTime->format('Y-m-d H:i:s');
            $date = $db->escapeString($date); // Escape the formatted date
        } catch (Exception $e) {
            echo "Error formatting date: " . $e->getMessage() . "<br>";
            $date = null; // Set to null if formatting fails
        }
    }
    $status = isset($launch['status']['name']) ? $db->escapeString($launch['status']['name']) : null;
    $window_start = null;
    if (isset($launch['window_start'])) {
        try {
            $dateTime = new DateTime($launch['window_start']);
            $window_start = $dateTime->format('Y-m-d H:i:s');
            $window_start = $db->escapeString($window_start);
        } catch (Exception $e) {
            echo "Error formatting window_start: " . $e->getMessage() . "<br>";
            $window_start = null;
        }
    }
    $window_end = null;
    if (isset($launch['window_end'])) {
        try {
            $dateTime = new DateTime($launch['window_end']);
            $window_end = $dateTime->format('Y-m-d H:i:s');
            $window_end = $db->escapeString($window_end);
        } catch (Exception $e) {
            echo "Error formatting window_end: " . $e->getMessage() . "<br>";
            $window_end = null;
        }
    }
    $probability = isset($launch['probability']) ? intval($launch['probability']) : null;
    $location = isset($launch['pad']['location']['name']) ? $db->escapeString($launch['pad']['location']['name']) : null;
    $pad_name = isset($launch['pad']['name']) ? $db->escapeString($launch['pad']['name']) : null;
    $pad_latitude = isset($launch['pad']['latitude']) ? floatval($launch['pad']['latitude']) : null;
    $pad_longitude = isset($launch['pad']['longitude']) ? floatval($launch['pad']['longitude']) : null;
    $rocket_name = isset($launch['rocket']['configuration']['name']) ? $db->escapeString($launch['rocket']['configuration']['name']) : null;
    $mission_name = isset($launch['mission']['name']) ? $db->escapeString($launch['mission']['name']) : null;
    $mission_description = isset($launch['mission']['description']) ? $db->escapeString($launch['mission']['description']) : null;
    $image = $db->escapeString($launch['image']);

    // Check if the launch ID already exists in the database
    $db->query("SELECT id FROM launch_data WHERE id = ?", [$id]);
    if ($db->numRows() > 0) {
        // Launch ID exists, so update the existing record
        $updated = $db->query("UPDATE launch_data SET
            name = ?,
            date = ?,
            status = ?,
            window_start = ?,
            window_end = ?,
            probability = ?,
            location = ?,
            pad_name = ?,
            pad_latitude = ?,
            pad_longitude = ?,
            rocket_name = ?,
            mission_name = ?,
	    mission_description = ?,
            image = ?
            WHERE id = ?", [
                $name,
                $date,
                $status,
                $window_start,
                $window_end,
                $probability,
                $location,
                $pad_name,
                $pad_latitude,
                $pad_longitude,
                $rocket_name,
                $mission_name,
                $mission_description,
		$image,
                $id
            ]);

        if ($updated) {
            $updated_count++;
        } else {
            echo "Error updating record for ID '$id': " . $db->connection->error . "<br>";
        }
    } else {
        // Launch ID doesn't exist, so insert a new record
        $inserted = $db->query("INSERT INTO launch_data (id, name, date, status, window_start, window_end, probability, location, pad_name, pad_latitude, pad_longitude, rocket_name, mission_name, mission_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            $id,
            $name,
            $date,
            $status,
            $window_start,
            $window_end,
            $probability,
            $location,
            $pad_name,
            $pad_latitude,
            $pad_longitude,
            $rocket_name,
            $mission_name,
            $mission_description
        ]);

        if ($inserted) {
            $imported_count++;
        } else {
            echo "Error inserting record for ID '$id': " . $db->connection->error . "<br>";
        }
    }
}

echo "<br>Import process completed.<br>";
echo "$imported_count new launches imported.<br>";
echo "$updated_count existing launches updated.<br>";

// Close the database connection
$db->close();

?>
