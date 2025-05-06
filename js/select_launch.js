$(document).ready(function () {
    $("#launch-icon").css("color", "white");
    // Get the current URL
    const currentUrl = window.location.href;

    // Parse the URL to get the base URL (protocol, host, and path)
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/")) + "/";

    // Construct the API URL
    const apiUrl = baseUrl + "api/api.php";

    // Fetch the launch data from your API
    $.ajax({
        url: apiUrl,
        type: "GET",
        dataType: "json",
        success: function (data) {
            // Clear the loading message or any previous content
            $("#launch-list").empty();

            // Check if there are any launches
            if (data.length > 0) {
                // Loop through the launch data and build the HTML
                let html = "";
                $.each(data, function (index, launch) {
                    html +=
                        '<div class="block-item block-item-table launch-item" data-id="' +
                        launch.id +
                        '">';
                    html += '<div class="block-item-tr">';
                    html += '<div class="block-item-td launch-image" style="background-image: url(\'' + launch.image + '\')">';
                    html += "</div>";
                    html += '<div class="block-item-td">';
                    html += "<h3>" + launch.mission_name + "</h3>";
                    html += "<p><strong>";
                    html +=
                        '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"/></g></svg>';
                    html += "</strong> " + formatLaunchDate(launch.date) + "</p>";
                    html += "<p><strong>";
                    html +=
                        '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"><path d="M13 9a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z"/><path d="M17.5 9.5c0 3.038-2 6.5-5.5 10.5c-3.5-4-5.5-7.462-5.5-10.5a5.5 5.5 0 1 1 11 0Z"/></g></svg>';
                    html += "</strong> " + launch.location + "</p>";
                    html += "</div>";
                    html += "</div>";
                    html += "</div>";
                });

                // Append the HTML to the launch list div
                $("#launch-list").append(html);
            } else {
                // Display a message if no launches are found
                $("#launch-list").append("<p>No upcoming launches found.</p>");
            }
        },
        error: function (xhr, status, error) {
            // Handle errors during the AJAX request
            $("#launch-list").html("<p>Error: " + error + "</p>");
            console.error("AJAX error:", status, error);
        },
    });
});
