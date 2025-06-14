//If a function is used more than once, it goes in main.js
//If it's only used once on one page, put it in <page>.js
$(document).ready(function() {
	//Initiate service worker for mobile app
	if ('serviceWorker' in navigator) {
	  window.addEventListener('load', () => {
	    navigator.serviceWorker.register('/pgc-mobile/js/service-worker.js') // Adjust the path if your service-worker.js is in a different location
	      .then((registration) => {
		console.log('Service worker registered: ', registration);
	      })
	      .catch((error) => {
		console.log('Service worker registration failed: ', error);
	      });
	  });
	}

	//Event listener for selecting a launch item
	$('#launch-list').on('click', '.launch-item', function() {
		let launchId = $(this).data('id');
		let launchURL = `index.php?page=launch&id=${launchId}`;
		window.location.href = launchURL;
	});

	//Event listener for copying links
	$('.copy-link').on('click', function() {
		var linkToCopy = $(this).data('link');
		if (linkToCopy) {
			copyLink(linkToCopy);
		}
	});

	//Event listener to share links
	$('.share-link').on('click', function() {
		var linkToShare = $(this).data('link');
		if (linkToShare) {
			shareLink(linkToShare);
		}
	});
});

//Function to convert date string to user friendly
//Function to convert date string to user friendly
function formatLaunchDate(utcDateString, netPrecision) {
  const utcDate = new Date(utcDateString + 'Z'); // Always parse as UTC
  //net precision is used when not exact date
  if (netPrecision !== undefined) {
    const year = utcDate.getUTCFullYear();
    const month = utcDate.toLocaleDateString('en-US', { month: 'long' });
    switch(netPrecision) {
      case 7:
        return `NET ${month} ${year}`;
      case 8:
        return `NET 1st quarter ${year}`;
      case 9:
        return `NET 2nd quarter ${year}`;
      case 10:
        return `NET 3rd quarter ${year}`;
      case 11:
        return `NET 4th quarter ${year}`;
      case 12:
        return `NET 1st Half ${year}`;
      case 13:
        return `NET 2nd Half ${year}`;
      case 14:
        return `NET ${year}`;
    }
  }

  // Get current date, in the user's local timezone, set to midnight for comparison.
  const now = new Date();
  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Get the launch date, converted to the user's local timezone, set to midnight for comparison.
  // We need to construct a new Date object from the UTC date's local components
  // after it has been implicitly converted to local time.
  const launchDateLocal = new Date(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate());

  // Format the time in the user's local timezone.
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  const timeString = timeFormatter.format(utcDate);

  // Calculate the difference in days using local date comparisons.
  // Both dates are at midnight in the local timezone, so the difference will be whole days.
  const diffTime = launchDateLocal.getTime() - todayLocal.getTime();
  const diffInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Use Math.ceil to correctly count partial days forward

  // Helper function for ordinal day suffixes (st, nd, rd, th)
  function getDayWithOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  // Determine the display string based on the day difference.
  if (diffInDays === 0) {
    return `Today at ${timeString}`;
  } else if (diffInDays === 1) {
    return `Tomorrow at ${timeString}`;
  } else if (diffInDays > 1 && diffInDays < 7) {
    // Format the day of the week in the user's local timezone.
    const dayOfWeekFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
    const dayOfWeek = dayOfWeekFormatter.format(utcDate); // Still format based on the original UTC date for accuracy
    return `This ${dayOfWeek} at ${timeString}`;
  } else {
    // For dates further out, format month and day with ordinal suffix.
    const monthFormatter = new Intl.DateTimeFormat(undefined, { month: 'long' });
    const month = monthFormatter.format(utcDate);
    // Get the local day of the month for proper display.
    const day = utcDate.getDate(); // This correctly gives the local day of the month
    const dayWithOrdinal = getDayWithOrdinal(day);
    return `${month} ${dayWithOrdinal} at ${timeString}`;
  }
}

//Function to generate appropriate color based on launch probability
function generateProbabilityColor(pC) {
	const red = pC < 50 ? 255 : Math.round(255 - (pC - 50) * 5.1);
	const green = pC > 50 ? 255 : Math.round(pC * 5.1);
	const blue = 0;
	return `rgb(${red},${green},${blue})`;
}

//Function to generate appropriate color based on sound delay
function generateDelayColor(sD) {
    const maxDelay = 300;

    if (sD < 0) {
        return `rgb(0, 255, 0)`; // Should not happen in a real scenario, but handle for safety
    }

    if (sD > maxDelay) {
        return `rgb(255, 0, 0)`; // Maximum red beyond the threshold
    }

    const normalizedDelay = sD / maxDelay; // Value between 0 and 1

    const red = Math.round(normalizedDelay * 255);   // Closer to maxDelay, more red
    const green = Math.round((1 - normalizedDelay) * 255); // Closer to 0s, more green
    const blue = 0;

    return `rgb(${red}, ${green}, ${blue})`;
}

//Get user's GPS data and store it in global scope
let userLatitude; //Define in global scope
let userLongitude; //Define in global scope
function getUserLocation() {
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                        function(position) {
                                userLatitude = position.coords.latitude;
                                userLongitude = position.coords.longitude;
                        },
                        function(error) {
                                console.error('Error getting location:', error);
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
        } else {
                console.error('Geolocation is not supported by this browser.');
        }
}

//Function to calculate sound travel time given a distance
let timeToHearSound;
function calcSoundTravelTime(distanceInMeters) {
        if (distanceInMeters < 0) {
                return null;
        }
        const speedOfSound = 343.0;
        timeToHearSound = (distanceInMeters / speedOfSound).toFixed(0);
	$("#user-sound-measurement").parent().css('color', generateDelayColor(timeToHearSound));
        $("#user-sound-measurement").text(' ' + timeToHearSound + ' seconds');
}

//Calculate user distance to launchpad using haversine formula
function calcUserDistance(lpLat, lpLong) {
        //Update user location data
        getUserLocation();

        if (userLatitude && userLongitude) {
                $("#user-distance-direction").css('animation', 'none');
                //Calculate distance using haversine formula
                const R = 6371e3; // metres
                const φ1 = userLatitude * Math.PI/180; // φ, λ in radians
                const φ2 = lpLat * Math.PI/180;
                const Δφ = (lpLat-userLatitude) * Math.PI/180;
                const Δλ = (lpLong-userLongitude) * Math.PI/180;
                const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                        Math.cos(φ1) * Math.cos(φ2) *
                        Math.sin(Δλ/2) * Math.sin(Δλ/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const distanceInMeters = R * c; // in metres
                const milesPerMeter = 0.000621371;
                const distanceInMiles = (distanceInMeters * milesPerMeter).toFixed(2);

                //Update display of user distance
                $("#user-distance-measurement").text(' ' + distanceInMiles + ' miles');

                //Now that distance is known, calculate sound travel time
                calcSoundTravelTime(distanceInMeters);
        } else {
                console.log("Waiting on user location data...");
        }
}

// Helper function to convert degrees to radians
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Helper function to convert radians to degrees
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}

//Function to copy url to clipboard
function copyLink(link) {
  var link = decodeURIComponent(link);
  navigator.clipboard.writeText(link)
    .then(() => {
      console.log('Link copied to clipboard!');
      showMessage('Copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy link: ', err);
      showMessage('Failed to copy to clipboard!');
    });
}

//Function to share a link
function shareLink(link) {
	window.open(link, '_blank');
}

//Function to display a message that fades away
function showMessage(message) {
  // Create a div for the message
  var messageDiv = $('<div class="copy-message"></div>');
  messageDiv.text(message);

  // Style the message
  messageDiv.css({
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 128, 0, 0.8)', // Green with opacity
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    zIndex: 1000, // Ensure it's on top of everything
    opacity: 1,      // Start with full opacity
    transition: 'opacity 0.5s ease-in-out, top 0.5s ease-in-out' // Smooth transition
  });

  // Append the message to the body
  $('body').append(messageDiv);

  // Animate the message
  setTimeout(function() {
    messageDiv.css('opacity', 0); // Fade out
    messageDiv.css('top', '0px');    // Move up
    setTimeout(function() {
      messageDiv.remove(); // Remove the element after the animation
    }, 500); // 500ms matches the opacity transition
  }, 1500); // Display for 1.5 seconds
}

// Function to extract the value of a specific query parameter from the URL
// Get the current URL
let currentUrl = window.location.href;
function getQueryParam(url, param) {
	const name = param.replace(/[\[\]]/g, "\\$&");
	const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	const results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Function to change pointer to finger for live demos
function isDemo() {
    if (getQueryParam(currentUrl, 'demo') === 'true') {
        isDemoMode = true;
        // Set the initial 'up' finger cursor
        $('body').css('cursor', 'url("images/finger_up.png"), pointer');

        // Function to change the cursor to the 'down' finger
        function setFingerDownCursor() {
            $('body').css('cursor', 'url("images/finger_down.png"), pointer');
        }

        // Function to change the cursor back to the 'up' finger
        function setFingerUpCursor() {
            $('body').css('cursor', 'url("images/finger_up.png"), pointer');
        }

        // Event listeners to simulate the click
        $('body').on('mousedown', setFingerDownCursor);
        $('body').on('mouseup mouseleave', setFingerUpCursor);
    } else {
        // Revert to the default cursor if demo mode is not active
        $('body').css('cursor', 'default');
    }
}

// Helper Functions
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function toDegrees(radians) {
  return radians * 180 / Math.PI;
}

//Function to grab weather data
function fetchWeatherData(lat, lon) {
	const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
	const kmhToMph = 0.621371;

	//Fetch the data
	$.ajax({
		url: apiUrl,
		method: 'GET',
		dataType: 'json'
	})
	.then(function(data) {
		console.log(data);
		if (data.current_weather) {
			//Temperature
			if (data.current_weather.temperature !== undefined) {
				const temperature = ((data.current_weather.temperature * 9/5) + 32).toFixed(2);
				$('#weather-temperature').html(temperature + "&deg; F");
			}
			//Windspeed
			if (data.current_weather.windspeed !== undefined) {
				const windSpeedMph = (data.current_weather.windspeed * kmhToMph).toFixed(2);
				const windDirection = data.current_weather.winddirection;
				let windDirectionImg = '<svg style="transform:rotate('+windDirection+'deg)" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20.5a.5.5 0 0 1-1 0V4.7l-6.15 6.15a.5.5 0 0 1-.707-.707l7-7a.5.5 0 0 1 .707 0l7 7a.5.5 0 0 1-.707.707l-6.15-6.15v15.8z"/></svg>';
				$('#weather-windspeed').html(windSpeedMph + " mph "+windDirectionImg);
			}
		}
	})
}
