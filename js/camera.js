let countdownInterval; // Declare in global scope
let userStatsInterval; // Declare in global scope

$(document).ready(function () {
    $("#camera-icon").css("color", "white");
    let currentStream;
    let countdownInterval;
    let scale = 2;
    const $cameraView = $("#camera-view");
    let isPinching = false;
    let startPinchDistance;
    let initialScale = scale; // Initialize initialScale with the starting scale

    function fetchLaunches(selectElementId) {
        const $selectElement = $("#" + selectElementId);
        if (!$selectElement.length) {
            console.error(
                `Select element with ID "${selectElementId}" not found.`,
            );
            return;
        }

        $.ajax({
            url:
                window.location.pathname.substring(
                    0,
                    window.location.pathname.lastIndexOf("/"),
                ) + "/api/api.php",
            method: "GET",
            dataType: "json",
            success: function (data) {
                $selectElement
                    .empty()
                    .append('<option value="null">Select a launch</option>');
                if (Array.isArray(data) && data.length > 0) {
                    $.each(data, function (index, launch) {
                        $("<option>")
                            .val(launch.id)
                            .text(
                                `${launch.mission_name} | ${new Date(Date.parse(launch.date + " UTC")).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit" })}` ||
                                    `Launch ID: ${launch.id}`,
                            )
                            .data("launchTime", launch.date)
                            .data("launchStatus", launch.status)
                            .data("launchProbability", launch.probability)
			    .data("launchLatitude", launch.pad_latitude)
			    .data("launchLongitude", launch.pad_longitude)
                            .appendTo($selectElement);
                    });
                } else {
                    $("<option>")
                        .text("No launches available")
                        .appendTo($selectElement);
                }
            },
            error: function (error) {
                console.error("Error fetching launches:", error);
                $selectElement
                    .empty()
                    .append('<option value="">Error loading launches</option>');
            },
        });
    }

    function startCamera(cameraViewId) {
        const $cameraView = $("#" + cameraViewId);
        if (!$cameraView.length) {
            console.error("Error: camera view element not found in the DOM.");
            return;
        }

        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: "environment" } })
            .then(function (stream) {
                console.log("Back camera started successfully.");
                currentStream = stream;
                $cameraView[0].srcObject = stream;
                applyZoom(); // Apply initial zoom after the stream is loaded
            })
            .catch(function (error) {
                console.error("Error accessing back camera:", error);
                $cameraView.html("<p>Error accessing the back camera.</p>");
            });
    }

    function applyZoom() {
        $cameraView.css("transform", `scale(${scale})`);
    }

    $cameraView.on("touchstart", function (event) {
        if (event.touches.length === 2) {
            isPinching = true;
            startPinchDistance = Math.hypot(
                event.touches[0].pageX - event.touches[1].pageX,
                event.touches[0].pageY - event.touches[1].pageY,
            );
            initialScale = scale;
        }
    });

    $cameraView.on("touchmove", function (event) {
        if (isPinching && event.touches.length === 2) {
            event.preventDefault(); // Prevent the browser's default pinch-to-zoom
            const currentPinchDistance = Math.hypot(
                event.touches[0].pageX - event.touches[1].pageX,
                event.touches[0].pageY - event.touches[1].pageY,
            );
            if (startPinchDistance) {
                scale =
                    initialScale +
                    (currentPinchDistance - startPinchDistance) / 200; // Adjust sensitivity as needed
                scale = Math.max(1, scale); // Prevent zooming out beyond the initial size
                applyZoom();
            }
        }
    });

    $cameraView.on("touchend", function () {
        isPinching = false;
        startPinchDistance = null;
    });

    fetchLaunches("launch-select");
    startCamera("camera-view");

    $("#launch-select").on("change", function () {
        const selectedValue = $(this).val();
        const selectedOption = $(this).find(":selected");
        const launchTimeUTCString = selectedOption.data("launchTime");
	const launchProbability = selectedOption.data("launchProbability");
	const launchStatus = selectedOption.data("launchStatus");
	const lpLat = selectedOption.data("launchLatitude");
	const lpLong = selectedOption.data("launchLongitude");

	updateLaunchStatus(launchProbability, launchStatus);

        clearInterval(userStatsInterval);
        userStatsInterval = setInterval(function() {
		calcUserDistance(lpLat, lpLong);
	}, 1000);
        if (selectedValue === "null") {
            $("#countdown").hide();
            $("#user-stats").hide();
        } else {
            $("#countdown").show();
            $("#user-stats").show();
            $("#user-distance-measurement").text(' calculating distance');
            $("#user-distance-direction").css('animation', 'spin 2s linear infinite');
            if (launchTimeUTCString) {
                clearInterval(countdownInterval);
                $("#countdown").text("LOADING COUNTDOWN...");

                // Create a Date object from the UTC string
                const utcDate = new Date(launchTimeUTCString);

                // Get the user's local time zone offset in minutes
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
            } else {
                $("#countdown").text("");
            }
        }
    });
});
