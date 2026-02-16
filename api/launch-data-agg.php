<?php

//Aggregrate date for upcoming launches from the space devs launch library "launch/upcoming" endpoint
//Connect to the database
require_once '/var/www/html/pgc-mobile/include/db.php';
$dbhost = '127.0.0.1';
$dbuser = 'root';
$dbpass = 'password';
$dbname = 'pgc';
$db = new db($dbhost, $dbuser, $dbpass, $dbname);

// SpaceDevs API endpoint for upcoming launches
$api_url = 'https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=100';

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

/**
 * Converts a SpaceDevs API date string to a UTC formatted string for storage.
 * The SpaceDevs API typically provides ISO 8601 strings, often with 'Z' for UTC,
 * or implicitly UTC if 'Z' is missing but the time is intended as UTC.
 *
 * @param string|null $apiDateString The date string from the API (e.g., "2025-06-15T14:30:00Z").
 * @return string|null A formatted UTC date string (e.g., "2025-06-15 14:30:00") or null on error.
 */
function convertApiDateToUtcFormatted(?string $apiDateString): ?string {
    if (empty($apiDateString)) {
        return null;
    }

    // SpaceDevs API often provides ISO 8601 format, which DateTime can parse directly.
    // If it has 'Z' (Zulu time/UTC), DateTime will recognize it.
    // If it doesn't have 'Z' but is implicitly UTC (which is common for LL2),
    // we need to explicitly set the timezone after creation.
    try {
        // Attempt to create DateTime object directly.
        // PHP's DateTime constructor is quite robust for ISO 8601 strings.
        $dateTime = new DateTime($apiDateString);

        // Crucial step: Set the timezone to UTC.
        // This ensures the DateTime object internally represents the time in UTC,
        // even if the original string was ambiguous or lacked explicit 'Z'.
        $dateTime->setTimezone(new DateTimeZone('UTC'));

        // Format to a standard YYYY-MM-DD HH:MM:SS string for your database.
        // This format is generally stored as DATETIME or TIMESTAMP in databases
        // and is implicitly UTC if the database column is set up for it, or
        // if your application consistently treats it as UTC.
        return $dateTime->format('Y-m-d H:i:s');

    } catch (Exception $e) {
        error_log("Error parsing or formatting date string '{$apiDateString}': " . $e->getMessage());
        return null;
    }
}


// Loop through each launch in the API response
foreach ($launches as $launch) {
    $id = $db->escapeString($launch['id']);
    $name = $db->escapeString($launch['name']);

    // Process 'net' date field
    $date = convertApiDateToUtcFormatted($launch['net'] ?? null); // Use null coalescing for cleaner code
    $date = $db->escapeString($date); // Escape the formatted date for DB insertion

    $status = isset($launch['status']['name']) ? $db->escapeString($launch['status']['name']) : null;

    // Process 'window_start' date field
    $window_start = convertApiDateToUtcFormatted($launch['window_start'] ?? null);
    $window_start = $db->escapeString($window_start);

    // Process 'window_end' date field
    $window_end = convertApiDateToUtcFormatted($launch['window_end'] ?? null);
    $window_end = $db->escapeString($window_end);

    $probability = isset($launch['probability']) ? intval($launch['probability']) : null;
    $location = isset($launch['pad']['location']['name']) ? $db->escapeString($launch['pad']['location']['name']) : null;
    $pad_name = isset($launch['pad']['name']) ? $db->escapeString($launch['pad']['name']) : null;
    $pad_latitude = isset($launch['pad']['latitude']) ? floatval($launch['pad']['latitude']) : null;
    $pad_longitude = isset($launch['pad']['longitude']) ? floatval($launch['pad']['longitude']) : null;
    $rocket_name = isset($launch['rocket']['configuration']['name']) ? $db->escapeString($launch['rocket']['configuration']['name']) : null;
    $rocket_full_name = isset($launch['rocket']['configuration']['full_name']) ? $db->escapeString($launch['rocket']['configuration']['full_name']) : null;
    $mission_name = isset($launch['mission']['name']) ? $db->escapeString($launch['mission']['name']) : null;
    $mission_description = isset($launch['mission']['description']) ? $db->escapeString($launch['mission']['description']) : null;
    $image = isset($launch['image']['image_url']) ? $db->escapeString($launch['image']['image_url']) : null;
    $launch_service_provider = isset($launch['launch_service_provider']['name']) ? $db->escapeString($launch['launch_service_provider']['name']) : null;

    // Corrected: Pull net_precision 'id' value, cast to int or null
    $net_precision = isset($launch['net_precision']['id']) ? intval($launch['net_precision']['id']) : null;


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
            rocket_full_name = ?,
            mission_name = ?,
            mission_description = ?,
            image = ?,
            launch_service_provider = ?,
            net_precision = ?
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
                $rocket_full_name,
                $mission_name,
                $mission_description,
                $image,
                $launch_service_provider,
                $net_precision, // Corrected: Using the integer ID here
                $id
            ]);

        if ($updated) {
            $updated_count++;
        } else {
            // Use error_log for server-side logging instead of echo for cron jobs
            error_log("Error updating record for ID '$id': " . $db->connection->error);
        }
    } else {
        // Launch ID doesn't exist, so insert a new record
        $inserted = $db->query("INSERT INTO launch_data (id, name, date, status, window_start, window_end, probability, location, pad_name, pad_latitude, pad_longitude, rocket_name, rocket_full_name, mission_name, mission_description, image, launch_service_provider, net_precision)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
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
            $rocket_full_name,
            $mission_name,
            $mission_description,
            $image,
            $launch_service_provider,
            $net_precision // Corrected: Using the integer ID here
        ]);

        if ($inserted) {
            $imported_count++;
        } else {
            error_log("Error inserting record for ID '$id': " . $db->connection->error);
        }
    }
}

echo "<br>Import process completed.<br>";
echo "$imported_count new launches imported.<br>";
echo "$updated_count existing launches updated.<br>";

// Close the database connection
$db->close();

?>
