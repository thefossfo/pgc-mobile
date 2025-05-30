//Define heading in global scope
let compassHeading = null;
let compassHeadingIndex = [];
let compassHeadingAverage = null;
getHeading();

//Function to point arrow towards launch pad
//Also, updates the miles to launcpad arrow to true north bearing
function pointToLaunchpad(lpLat, lpLong) {
	const launchPadBearing = getBearing(lpLat, lpLong);
	let launchPadBearingNormalized = launchPadBearing % 360;
	launchPadBearingNormalized = launchPadBearingNormalized > 180 ? launchPadBearingNormalized - 360 : (launchPadBearingNormalized <= -180 ? launchPadBearingNormalized + 360 : launchPadBearingNormalized);
	launchPadBearingNormalized = (launchPadBearingNormalized % 360 + 360) % 360;

	if (launchPadBearing) {
	//Rotate miles to launchpad arrow to launch pad bearing
	rotateArrow(launchPadBearing);

	//Update user section with true north bearing
	$("#user-distance-bearing").html(' (' + launchPadBearingNormalized.toFixed(2) + '&deg;T)');
	}

	//Draw interactive compass
	//Convert heading and bearing to integer
	const curHeading = Math.round(compassHeading);
	const curBearing = Math.round(launchPadBearing);
	const showCompass = document.cookie.split('; ').find(row => row.startsWith('showCompass='))?.split('=')[1];
	if ($("#launchpad-compass").length && showCompass === 'true') {
		const compassArr = [];
		for (let i = curHeading - 4;i <= curHeading + 4; i++) {
			compassArr.push(i);
		}
		for (let i=0;i<compassArr.length;i++) {
			let selector = "#launchpad-compass-"+i;
			if (compassArr[i] == curBearing) {
				$(selector).html('<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 36 36"><path fill="currentColor" d="M28 34H8a1 1 0 0 0 0 2h20a1 1 0 0 0 0-2M18 9.53a2.75 2.75 0 1 0 2.75 2.75A2.75 2.75 0 0 0 18 9.53m0 3.89a1.15 1.15 0 0 1 0-2.29a1.15 1.15 0 1 1 0 2.29"></path><path fill="currentColor" d="M28.75 22.45a15.5 15.5 0 0 0-2.85-5.52l-.28-.35c0-.34 0-.68-.05-1C24.89 4.36 18.79.6 18.54.44a1 1 0 0 0-1 0c-.26.16-6.35 3.92-7 15.1c0 .32 0 .65-.05 1l-.33.41a15.6 15.6 0 0 0-3.44 11.14a1 1 0 0 0 1 .91h4.43a16.3 16.3 0 0 0 1 2.5a1 1 0 0 0 .87.51H22a1 1 0 0 0 .87-.51a16 16 0 0 0 1-2.5h4.39a1 1 0 0 0 1-.91a15.6 15.6 0 0 0-.51-5.64M21.37 30h-6.69a25.5 25.5 0 0 1-1.59-5.23l-2 .4c.14.65.28 1.25.43 1.82H8.66a13.2 13.2 0 0 1 1.8-7c0 .55.07 1.1.13 1.66l2-.21a34 34 0 0 1-.11-5.77C13 7.35 16.65 3.64 18 2.53c1.38 1.12 5.05 4.82 5.56 13.15A32.86 32.86 0 0 1 21.37 30m3.12-3a37 37 0 0 0 1.09-6.94A13.17 13.17 0 0 1 27.34 27Z"></path></svg>');
				$(selector).css('color', 'green');
			} else {
				$(selector).css('color', 'inherit');
				$(selector).html('|<br/>'+compassArr[i]+'&deg;');
			}
		}
		if (compassArr.includes(curBearing)) {
			$("#user-distance-bearing").color('green');
		} else {
			$("#user-distance-bearing").color('inherit');
		}
	} else {
		$("#launchpad-compass").hide();
	}
}
function rotateArrow(angle) {
    $("#user-distance-direction").css({
        'transform': 'rotate(' + angle + 'deg)'
    });
}


//Function to grab the user's heading
// Function to grab the user's heading and correct for inversion
function getHeading() {
  if ('ondeviceorientationabsolute' in window) {
    window.addEventListener('deviceorientationabsolute', function(event) {
      if (event.absolute) {
        let rawHeading = event.alpha;
        // Correct for inversion: subtract from 360
        compassHeading = (360 - rawHeading) % 360;
        // Optional: Do something with the heading, e.g., display it
        // console.log('Corrected Compass Heading (absolute):', compassHeading);
      }
    });
  } else if ('ondeviceorientation' in window) {
    window.addEventListener('deviceorientation', function(event) {
      if (event.webkitCompassHeading) {
        let rawHeading = event.webkitCompassHeading;
        // Correct for inversion: subtract from 360
        compassHeading = (360 - rawHeading) % 360;
        // Optional: Do something with the heading.
        // console.log('Corrected Compass Heading (webkit):', compassHeading);
      } else if (event.alpha) {
        let rawHeading = event.alpha;
        // Correct for inversion: subtract from 360
        compassHeading = (360 - rawHeading) % 360;
        // console.log("Corrected Compass Heading (alpha): ", compassHeading);
      }
    });
    //Smooth compass heading by getting average of last 5 readings
    compassHeadingIndex.push(compassHeading);
    if (compassHeadingIndex.length > 5) {
	compassHeadingIndex.shift();
    }
    for (let i = 0; i < compassHeadingIndex.length; i++) {
	readingsSum += compassHeadingIndex[i];
    }
    compassHeadingAverage = compassHeadingIndex.length > 0 ? readingsSum / compassHeadingIndex.length : 0;
    compassHeading = compassHeadingAverage;
  } else {
    alert('Compass not supported');
  }
}

//Function to get heading between user location and target location
function getBearing(tLa, tLo) {
	//Pull in global scope user location and convert to constant
	const uLa = userLatitude;
	const uLo = userLongitude;

	//Convert long and lat to radians
	const uLatRad = toRadians(uLa);
	const uLonRad = toRadians(uLo);
	const tLatRad = toRadians(tLa);
	const tLonRad = toRadians(tLo);

	//Calculate delta (difference) in radians between target and user
	const dLon = tLonRad - uLonRad;

	//Determine 2d vector of line between user and target
	const y = Math.sin(dLon) * Math.cos(tLatRad);
	const x = Math.cos(uLatRad) * Math.sin(tLatRad) - Math.sin(uLatRad) * Math.cos(tLatRad) * Math.cos(dLon);

	//Use arctangent function to determine bearing
	const bRad = Math.atan2(y, x);

	//Convert bearing from rad to deg
	let bDeg = toDegrees(bRad);
	//Use modulus to normalize between 0 and 360
	bDeg = (bDeg+360) % 360;

	//Return bearing in degrees
	return bDeg;
}
