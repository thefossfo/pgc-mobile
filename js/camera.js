$(document).ready(function() {
  let currentStream;
  let countdownInterval;

  function fetchLaunches(selectElementId) {
    const $selectElement = $('#' + selectElementId);
    if (!$selectElement.length) {
      console.error(`Select element with ID "${selectElementId}" not found.`);
      return;
    }

    $.ajax({
      url: window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/api/api.php',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        $selectElement.empty().append('<option value="null">Select a launch</option>');
        if (Array.isArray(data) && data.length > 0) {
          $.each(data, function(index, launch) {
            $('<option>')
              .val(launch.id)
              .text(launch.name || `Launch ID: ${launch.id}`)
              .data('launchTime', launch.date)
              .appendTo($selectElement);
          });
        } else {
          $('<option>').text('No launches available').appendTo($selectElement);
        }
      },
      error: function(error) {
        console.error('Error fetching launches:', error);
        $selectElement.empty().append('<option value="">Error loading launches</option>');
      }
    });
  }

  function startCamera(cameraViewId) {
    const $cameraView = $('#' + cameraViewId);
    if (!$cameraView.length) {
      console.error("Error: camera view element not found in the DOM.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(function(stream) {
        console.log("Back camera started successfully.");
        currentStream = stream;
        $cameraView[0].srcObject = stream;
      })
      .catch(function(error) {
        console.error('Error accessing back camera:', error);
        $cameraView.html('<p>Error accessing the back camera.</p>');
      });
  }

function updateCountdown(targetTime) {
  const now = new Date().getTime();
  const target = new Date(targetTime).getTime();
  let difference = target - now;
  if (difference <= 0) {
    clearInterval(countdownInterval);
    $('#countdown').text('LAUNCHED!');
    return;
  }
  // Calculate days
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  difference -= days * (1000 * 60 * 60 * 24);
  // Calculate hours
  const hours = Math.floor(difference / (1000 * 60 * 60));
  difference -= hours * (1000 * 60 * 60);
  // Calculate minutes
  const minutes = Math.floor(difference / (1000 * 60));
  difference -= minutes * (1000 * 60);
  // Calculate seconds
  const seconds = Math.floor(difference / 1000);
  difference -= seconds * 1000; // Subtract the elapsed seconds from the difference
  $('#countdown').text(`T - ${days}d ${hours}:${minutes}:${seconds}`);
}

  fetchLaunches('launch-select');
  startCamera('camera-view');

  $('#launch-select').on('change', function() {
  const selectedValue = $(this).val(); // Get the value of the selected option
  const selectedOption = $(this).find(':selected');
  const launchTime = selectedOption.data('launchTime');

  if (selectedValue === 'null') { // Check if the value is 'null' (as a string)
    $('#countdown').hide();
  } else {
    $('#countdown').show();
    if (launchTime) {
      clearInterval(countdownInterval);
      $('#countdown').text('LOADING COUNTDOWN...');
      countdownInterval = setInterval(function() {
        updateCountdown(launchTime);
      }, 1000);
    } else {
      $('#countdown').text('');
    }
  }
  });
});
