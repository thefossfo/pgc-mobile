$(document).ready(function () {
        function updateCountdown(targetTime) {
                const now = new Date().getTime();
                const target = new Date(targetTime).getTime();
                let difference = target - now;
                if (difference <= 0) {
                        clearInterval(countdownInterval);
                        $("#launch-countdown").text("LAUNCHED!");
                        return;
                }
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                difference -= days * (1000 * 60 * 60 * 24);
                const hours = Math.floor(difference / (1000 * 60 * 60));
                difference -= hours * (1000 * 60 * 60);
                const minutes = Math.floor(difference / (1000 * 60));
                difference -= minutes * (1000 * 60);
                const seconds = Math.floor(difference / 1000);
                $("#launch-countdown").text(
                        `T - ${days}d ${hours}:${minutes}:${seconds}`,
                );
        }
        $("#launch-icon").css("color", "white");
        // Get the current URL
        const currentUrl = window.location.href;

        // Parse the URL to get the base URL (protocol, host, and path)
        const baseUrl =
                currentUrl.substring(0, currentUrl.lastIndexOf("/")) + "/";

        // Construct the API URL
        const apiUrl = baseUrl + "api/api.php";

        // Function to extract the value of a specific query parameter from the URL
        function getQueryParam(url, param) {
                const name = param.replace(/[\[\]]/g, "\\$&");
                const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
                const results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return "";
                return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        // Extract the launch ID from the URL
        const launchId = getQueryParam(currentUrl, "id");

        // Fetch the launch data from your API
        $.ajax({
                url: apiUrl,
                type: "GET",
                dataType: "json",
                success: function (data) {
                        // Check if there are any launches
                        if (data.length > 0) {
                                // Loop through the launch data and build the HTML only for the matching ID
                                let html = "";
                                $.each(data, function (index, launch) {
                                        if (launch.id === launchId) {
						$('#header').contents().filter(function() {
						    return this.nodeType === 3; // Node type 3 is a text node
						}).each(function() {
						    this.nodeValue = ' ' + launch.mission_name;
						});
						const launchTimeUTCString = launch.date;
						if (launchTimeUTCString) {
							$("#countdown").text("LOADING COUNTDOWN...");

							// Create a Date object from the UTC string
							const utcDate = new Date(launchTimeUTCString);

							//Get the user's local time zone offset in minutes
							const localOffsetMinutes = new Date().getTimezoneOffset();

							// Convert the offset to milliseconds
							const localOffsetMilliseconds = localOffsetMinutes * 60 * 1000;

							// Apply the offset to the UTC time to get the local time
							const localLaunchTime = new Date(
								utcDate.getTime() - localOffsetMilliseconds,
							);

							countdownInterval = setInterval(function () {
								updateCountdown(localLaunchTime.toISOString()); // Pass the adjusted local time
							}, 1000);
						}
						statusHTML = '<div></div>';
						//$('#launch-status').html(statusHTML);
						$('#launch-details').text(launch.mission_description);
                                        }
                                });

                                // Append the HTML to the launch list div
                                $("#launch-list").append(html);

                                // Handle the case where no matching launch is found
                        } else {
                                // Display a message if no launches are found
                                $("#launch-list").append(
                                        "<p>No upcoming launches found.</p>",
                                );
                        }
                },
                error: function (xhr, status, error) {
                        // Handle errors during the AJAX request
                        $("#launch-list").html("<p>Error: " + error + "</p>");
                        console.error("AJAX error:", status, error);
                },
        });
});
