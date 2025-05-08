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
function formatLaunchDate(utcDateString) {
  const utcDate = new Date(utcDateString + ' UTC');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const launchDay = new Date(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate());

  const timeOptions = { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true };
  const timeString = utcDate.toLocaleTimeString(undefined, timeOptions);

  const diffInDays = Math.ceil((launchDay - today) / (1000 * 60 * 60 * 24));

  function getDayWithOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  if (diffInDays === 0) {
    return `Today at ${timeString}`;
  } else if (diffInDays === 1) {
    return `Tomorrow at ${timeString}`;
  } else if (diffInDays > 1 && diffInDays < 4) {
    const dayOfWeek = utcDate.toLocaleDateString(undefined, { weekday: 'long' });
    return `This ${dayOfWeek} at ${timeString}`;
  } else {
    const month = utcDate.toLocaleDateString(undefined, { month: 'long' });
    const day = utcDate.getDate();
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
    const maxDelay = 600;

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
function calcSoundTravelTime(distanceInMeters) {
        if (distanceInMeters < 0) {
                return null;
        }
        const speedOfSound = 343.0;
        const travelTimeInSeconds = (distanceInMeters / speedOfSound).toFixed(0);
	$("#user-sound-measurement").parent().css('color', generateDelayColor(travelTimeInSeconds));
        $("#user-sound-measurement").text(' ' + travelTimeInSeconds + ' seconds');
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

                //Update AR display of user distance
                $("#user-distance-measurement").text(' ' + distanceInMiles + ' miles');

                //Now that distance is known, calculate sound travel time
                calcSoundTravelTime(distanceInMeters);
        } else {
                console.log("Waiting on user location data...");
        }
}

//Function to point arrow towards launch pad
function pointToLaunchpad(lpLat, lpLong) {
  if (typeof userLatitude === 'undefined' || typeof userLongitude === 'undefined') {
    return;
  }

  const userLat = userLatitude;
  const userLng = userLongitude;

  const targetLat = lpLat;
  const targetLng = lpLong;

  // Calculate bearing (initial direction from user to target)
  const lat1 = toRadians(userLat);
  const lon1 = toRadians(userLng);
  const lat2 = toRadians(targetLat);
  const lon2 = toRadians(targetLng);

  const deltaLon = lon2 - lon1;

  let y = Math.sin(deltaLon) * Math.cos(lat2);
  let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

  let initialBearing = toDegrees(Math.atan2(y, x));
  initialBearing = (initialBearing + 360) % 360; // Normalize to 0-360 degrees

  // Function to handle device orientation changes
  function handleOrientation(event) {
    let heading;

    // Check for different orientation event properties
    if (event.alpha !== null) {
      // Most common case: compass heading relative to magnetic north
      heading = event.alpha;
    } else if (event.webkitCompassHeading) {
      // Safari-specific property
      heading = event.webkitCompassHeading;
    } else {
      console.error("Compass data not available on this device.");
      window.removeEventListener('deviceorientation', handleOrientation);
      return;
    }

    // Calculate the difference between the initial bearing and the device heading
    let rotation = initialBearing - heading;

    // Normalize the rotation to -180 to 180 degrees for smoother animation
    rotation = (rotation + 360) % 360;
    if (rotation > 180) {
      rotation -= 360;
    }
	  
    // Check if the rotation is within the target range
    if (rotation >= -5 && rotation <= 5) {
      $('#user-distance-direction').css('color', 'red');
    } else {
      $('#user-distance-direction').css('color', 'inherit');
    }

    // Apply the rotation to the arrow using CSS transform
	   console.log(rotation);
    $('#user-distance-direction').css('transform', `rotate(${rotation}deg)`);
  }

  // Add event listener for device orientation
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation);
  } else {
    console.error("Device Orientation API not supported on this device.");
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
