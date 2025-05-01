$(document).ready(function() {
    // Get the current URL
    const currentUrl = window.location.href;

    // Parse the URL to get the base URL (protocol, host, and path)
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/')) + '/';

    // Construct the API URL
    const apiUrl = baseUrl + 'api/api.php';

    // Fetch the launch data from your API
    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Clear the loading message or any previous content
            $('#launch-list').empty();

            // Check if there are any launches
            if (data.length > 0) {
                // Loop through the launch data and build the HTML
                let html = '';
                $.each(data, function(index, launch) {
                    html += '<div class="launch-item">';
                    html += '<h3>' + launch.name + '</h3>';
                    html += '<p><strong>Date:</strong> ' + launch.date + '</p>';
                    html += '<p><strong>Status:</strong> ' + launch.status + '</p>';
                    html += '<p><strong>Window Start:</strong> ' + launch.window_start + '</p>';
                    html += '<p><strong>Window End:</strong> ' + launch.window_end + '</p>';
                    html += '<p><strong>Probability:</strong> ' + launch.probability + '</p>';
                    html += '<p><strong>Location:</strong> ' + launch.location + '</p>';
                    html += '<p><strong>Pad Name:</strong> ' + launch.pad_name + '</p>';
                    html += '<p><strong>Rocket Name:</strong> ' + launch.rocket_name + '</p>';
                    html += '<p><strong>Mission Name:</strong> ' + launch.mission_name + '</p>';
                    html += '<p><strong>Mission Description:</strong> ' + launch.mission_description + '</p>';
                    html += '</div>';
                });

                // Append the HTML to the launch list div
                $('#launch-list').append(html);
            } else {
                // Display a message if no launches are found
                $('#launch-list').append('<p>No upcoming launches found.</p>');
            }
        },
        error: function(xhr, status, error) {
            // Handle errors during the AJAX request
            $('#launch-list').html('<p>Error: ' + error + '</p>');
            console.error("AJAX error:", status, error);
        }
    });
});
