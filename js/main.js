//If a function is used more than once, it goes in main.js
//If it's only used once on one page, put it in <page>.js
$(document).ready(function() {
	$('#launch-list').on('click', '.launch-item', function() {
		let launchId = $(this).data('id');
		let launchURL = `index.php?page=launch&id=${launchId}`;
		window.location.href = launchURL;
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
  } else if (diffInDays > 1 && diffInDays < 7) {
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
