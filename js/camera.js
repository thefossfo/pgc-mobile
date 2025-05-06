let countdownInterval; // Declare in global scope
let userStatsInterval; // Declare in global scope
let pointToLaunchpadInterval; //Declare in global scope

$(document).ready(function () {
  $("#camera-icon").css("color", "white");
  let currentStream;
  let videoTrack; // To hold the video track
  let zoomCapabilities; // To hold the camera's zoom capabilities
  let countdownInterval;
  const $cameraView = $("#camera-view");
  let isPinching = false;
  let startPinchDistance;
  let initialZoomLevel; // To store the zoom level at the start of a pinch
  let currentZoom = 1.5; // Initialize current zoom level

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
      .getUserMedia({ video: { facingMode: "environment", zoom: true } })
      .then(function (stream) {
        console.log("Back camera started successfully.");
        currentStream = stream;
        videoTrack = stream.getVideoTracks()[0];
        zoomCapabilities = videoTrack ? videoTrack.getCapabilities().zoom : null;

        if (!zoomCapabilities) {
          console.log("Zoom control is not supported by this camera.");
          // Optionally, provide feedback to the user
        } else {
          console.log("Min Zoom:", zoomCapabilities.min);
          console.log("Max Zoom:", zoomCapabilities.max);
          //currentZoom = zoomCapabilities.min || 1; // Initialize with min zoom or 1
          applyNativeZoom(currentZoom); // Apply initial zoom level
        }

        $cameraView[0].srcObject = stream;
      })
      .catch(function (error) {
        console.error("Error accessing back camera:", error);
        $cameraView.html("<p>Error accessing the back camera.</p>");
      });
  }

  async function applyNativeZoom(zoomValue) {
    if (videoTrack && zoomCapabilities) {
      const clampedZoom = Math.max(
        zoomCapabilities.min,
        Math.min(zoomCapabilities.max, zoomValue),
      );
      try {
        await videoTrack.applyConstraints({ advanced: [{ zoom: clampedZoom }] });
        currentZoom = clampedZoom;
        console.log("Native zoom level applied:", currentZoom);
      } catch (error) {
        console.error("Error applying native zoom:", error);
        // Optionally, fall back to CSS zoom or inform the user
      }
    } else {
      console.warn("Video track or zoom capabilities not available.");
      // Fallback to CSS zoom (your original method)
      $cameraView.css("transform", `scale(${zoomValue})`);
    }
  }

  function getPinchDistance(event) {
    if (event.touches.length < 2) return null;
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    return Math.hypot(
      touch1.pageX - touch2.pageX,
      touch1.pageY - touch2.pageY,
    );
  }

  $cameraView.on("touchstart", function (event) {
    if (event.touches.length === 2 && zoomCapabilities) {
      isPinching = true;
      startPinchDistance = getPinchDistance(event);
      initialZoomLevel = currentZoom;
    }
  });

  $cameraView.on("touchmove", function (event) {
    if (isPinching && event.touches.length === 2 && zoomCapabilities) {
      event.preventDefault(); // Prevent default pinch-to-zoom
      const currentPinchDistance = getPinchDistance(event);
      if (startPinchDistance && currentPinchDistance) {
        const scaleFactor = currentPinchDistance / startPinchDistance;
        let newZoom = initialZoomLevel * scaleFactor;

        // Clamp the zoom level
        newZoom = Math.max(zoomCapabilities.min, Math.min(zoomCapabilities.max, newZoom));

        applyNativeZoom(newZoom);
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
    userStatsInterval = setInterval(function () {
      calcUserDistance(lpLat, lpLong);
    }, 1000);
    clearInterval(pointToLaunchpadInterval);
    pointToLaunchpadInterval = setInterval(function() {
      pointToLaunchpad(lpLat, lpLong);
    }, 1000);
    if (selectedValue === "null") {
      $("#countdown").hide();
      $("#user-stats").hide();
    } else {
      $("#countdown").show();
      $("#user-stats").show();
      $("#user-distance-measurement").text(" calculating distance");
      $("#user-distance-direction").css("animation", "spin 2s linear infinite");
      if (launchTimeUTCString) {
        clearInterval(countdownInterval);
        $("#countdown").text("LOADING COUNTDOWN...");

        const utcDate = new Date(launchTimeUTCString);
        const localOffsetMinutes = new Date().getTimezoneOffset();
        const localOffsetMilliseconds = localOffsetMinutes * 60 * 1000;
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
