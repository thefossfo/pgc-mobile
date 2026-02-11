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
		$("#countdown-table-days").text(days);
		$("#countdown-table-hours").text(String(hours).padStart(2,'0'))
		$("#countdown-table-minutes").text(String(minutes).padStart(2,'0'))
		$("#countdown-table-seconds").text(String(seconds).padStart(2,'0'));
        }
        $("#launch-icon").css("color", "white");
        // Get the current URL
        const currentUrl = window.location.href;

        // Parse the URL to get the base URL (protocol, host, and path)
        const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/")) + "/";

        // Extract the launch ID from the URL
        let launchId = getQueryParam(currentUrl, "id");
	if (launchId != null) {
		launchIdURL = "?id=" + launchId;
	}

        // Construct the API URL
        const apiUrl = baseUrl + "api/api.php" + launchIdURL;
	console.log(apiUrl);

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
						    if (launch.mission_name) {
						    	this.nodeValue = ' ' + launch.mission_name;
						    } else {
							this.nodeValue = ' ' + launch.name
						    }
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
							if (launch.status != 'On Hold') {
								console.log(launch.status);
								countdownInterval = setInterval(function () {
									updateCountdown(localLaunchTime.toISOString()); // Pass the adjusted local time
								}, 1000);
							} else {
								$("#launch-countdown").text("On Hold");
							}
						}

						//Generate status HTML
						//Probability needs to be in integer format
						const statusIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56"><path fill="currentColor" d="m50.923 21.002l.046.131l.171.566l.143.508l.061.232l.1.42a23.93 23.93 0 0 1-2.653 17.167a23.93 23.93 0 0 1-13.57 10.89l-.404.12l-.496.128l-.717.17a1.89 1.89 0 0 1-2.288-1.558a2.127 2.127 0 0 1 1.606-2.389l.577-.145q.54-.142.929-.273a19.93 19.93 0 0 0 10.899-8.943a19.93 19.93 0 0 0 2.292-13.923l-.069-.313l-.092-.365l-.115-.418l-.138-.47a2.135 2.135 0 0 1 1.26-2.602a1.894 1.894 0 0 1 2.458 1.067M7.385 19.92q.065.02.128.044A2.127 2.127 0 0 1 8.78 22.55q-.27.909-.39 1.513a19.93 19.93 0 0 0 2.295 13.91a19.93 19.93 0 0 0 10.911 8.947l.306.097l.174.05l.39.106l.694.171a2.135 2.135 0 0 1 1.623 2.393a1.894 1.894 0 0 1-2.152 1.594l-.138-.025l-.576-.135l-.51-.13l-.446-.125l-.2-.06A23.93 23.93 0 0 1 7.22 39.972a23.93 23.93 0 0 1-2.647-17.197l.077-.32l.1-.375l.194-.665l.076-.25a1.89 1.89 0 0 1 2.365-1.246M28.051 12c8.837 0 16 7.163 16 16s-7.163 16-16 16s-16-7.163-16-16s7.164-16 16-16m0 4c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.628 0 12-5.373 12-12s-5.372-12-12-12m0-12a23.93 23.93 0 0 1 16.217 6.306l.239.227l.275.274l.31.322l.346.369a1.89 1.89 0 0 1-.205 2.76a2.127 2.127 0 0 1-2.873-.196q-.326-.345-.605-.617l-.35-.334l-.16-.143A19.93 19.93 0 0 0 28.051 8a19.93 19.93 0 0 0-13.204 4.976l-.114.102l-.253.24l-.287.285l-.495.515c-.76.809-2.014.9-2.883.21a1.894 1.894 0 0 1-.305-2.662l.09-.106l.405-.431l.368-.378q.262-.263.484-.465A23.93 23.93 0 0 1 28.05 4"/></svg>';
						if (Number.isInteger(launch.probability) && launch.status !== 'Launch Successful' && launch.status !== 'Launch in Flight') {
							statusHTML = '<h3 style="color:' + generateProbabilityColor(launch.probability) + '">' + statusIcon + ' ' + launch.probability + '% ' + launch.status + '</h3>';
						} else {
							statusHTML = '<h3>' + statusIcon + ' ' + launch.status + '</h3>';
						}
						statusHTML += '<p>';
						statusHTML +=   '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none">';
						statusHTML +=   '<path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1">i';
						statusHTML +=   '</path></g></svg> ';
						statusHTML +=   formatLaunchDate(launch.date,launch.net_precision);
						statusHTML += '</p>';
						//Draw sliding scale launch window
						if (launch.window_start !== launch.window_end) {
							var windowOpen = new Date(launch.window_start + 'Z');
							var windowClose = new Date(launch.window_end + 'Z');
							var launchTime = new Date(launch.date + 'Z');
							var windowLength = windowClose.getTime() - windowOpen.getTime();
							var launchDelay = launchTime.getTime() - windowOpen.getTime();
							launchDelay = launchDelay / (1000 * 60);
							windowLength = windowLength / (1000 * 60);
							const launchDelayPercent = (launchDelay / windowLength) * 100;
							const options = { hour: '2-digit', minute: '2-digit', hour12: true };
							windowOpen = windowOpen.toLocaleTimeString('en-US', options);
							windowClose = windowClose.toLocaleTimeString('en-US', options);
							statusHTML += '<div id="launch-window">';
							statusHTML +=   '<table>';
							statusHTML +=     '<tr>';
							statusHTML +=       '<td colspan="2">';
							statusHTML +=         '<div class="launch-window-line-container">';
							statusHTML +=           '<div class="launch-window-line">';
							statusHTML +=             '<div class="launch-window-line-rocket" style="left:' + launchDelayPercent + '%">'
							statusHTML +=               '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 256 256"><g fill="currentColor"><path d="m94.81 192l-29.45 22.24a8 8 0 0 1-12.81-4.51L40.19 154.1a8 8 0 0 1 1.66-6.86l30.31-36.33C71 134.25 76.7 161.43 94.81 192m119.34-44.76l-30.31-36.33c1.21 23.34-4.54 50.52-22.65 81.09l29.45 22.24a8 8 0 0 0 12.81-4.51l12.36-55.63a8 8 0 0 0-1.66-6.86" opacity="0.2"></path><path d="M152 224a8 8 0 0 1-8 8h-32a8 8 0 0 1 0-16h32a8 8 0 0 1 8 8m-24-112a12 12 0 1 0-12-12a12 12 0 0 0 12 12m95.62 43.83l-12.36 55.63a16 16 0 0 1-25.51 9.11L158.51 200h-61l-27.26 20.57a16 16 0 0 1-25.51-9.11l-12.36-55.63a16.09 16.09 0 0 1 3.32-13.71l28.56-34.26a123 123 0 0 1 8.57-36.67c12.9-32.34 36-52.63 45.37-59.85a16 16 0 0 1 19.6 0c9.34 7.22 32.47 27.51 45.37 59.85a123 123 0 0 1 8.57 36.67l28.56 34.26a16.09 16.09 0 0 1 3.32 13.71M99.43 184h57.14c21.12-37.54 25.07-73.48 11.74-106.88C156.55 47.64 134.49 29 128 24c-6.51 5-28.57 23.64-40.33 53.12c-13.31 33.4-9.36 69.34 11.76 106.88m-15 5.85q-16.15-29.35-19.6-57.69L48 152.36L60.36 208l.18-.13ZM208 152.36l-16.83-20.2q-3.42 28.28-19.56 57.69l23.85 18l.18.13Z"></path></g></svg>';
							statusHTML +=             '</div>';
							statusHTML +=           '</div>';
							statusHTML +=       '</td>';
							statusHTML +=     '</tr>';
							statusHTML +=       '<td class="launch-window-open">Window Open<br/>' + windowOpen + '</td>';
							statusHTML +=       '<td class="launch-window-close">Window Close<br/>' + windowClose + '</td>';
							statusHTML +=     '<tr>';
							statusHTML +=     '</tr>';
							statusHTML +=   '</table>';
							statusHTML += '</div>';
						}
						$('#launch-status').html(statusHTML);

						//Generate location data
						locationHTML =  '<h3>';
						locationHTML +=   '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">';
						locationHTML +=   '<g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2">';
						locationHTML +=   '<path d="M13 9a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z"></path>';
						locationHTML +=   '<path d="M17.5 9.5c0 3.038-2 6.5-5.5 10.5c-3.5-4-5.5-7.462-5.5-10.5a5.5 5.5 0 1 1 11 0Z"></path>';
						locationHTML +=   '</g></svg> ' + launch.location;
						locationHTML += '</h3>';
						if (launch.on_location_name != null && launch.on_location_link != null) {
							locationHTML += '<p>';
							locationHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M5.75 6.5c0 1.195.035 2.834.025 4.172m-.212-7.266c-.01-.187-.034-.44-.062-.717c-.094-.92-.773-1.774-1.69-1.9a4 4 0 0 0-.53-.04a4 4 0 0 0-.53.04c-.916.126-1.569.981-1.621 1.905C.985 5.248.767 8.172.786 10.672"/><path d="M.781 10.719a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0m7.5-4.219c0 1.202-.035 2.852-.024 4.195m.212-7.289c.01-.187.033-.44.061-.717c.094-.92.773-1.774 1.69-1.9a4 4 0 0 1 .53-.039q.267.001.53.039c.916.126 1.569.981 1.621 1.905c.145 2.561.364 5.496.344 8"/><path d="M13.25 10.719a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0M9.512 4.23c-1.706-1.14-3.318-1.14-5.024 0"/></g></svg> ';
							locationHTML += 'Watch from <a class="white-link" href="' +launch.on_location_link + '">' + launch.on_location_name + '</a> ';
							locationHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.248 19C3.22 15.77 5.275 8.232 12.466 8.232V6.079a1.025 1.025 0 0 1 1.644-.862l5.479 4.307a1.108 1.108 0 0 1 0 1.723l-5.48 4.307a1.026 1.026 0 0 1-1.643-.861v-2.154C5.275 13.616 4.248 19 4.248 19"></path></svg>';
							locationHTML += '</p>';
						}
						locationHTML += '<p>';
						locationHTML +=   '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36">';
						locationHTML +=   '<path fill="currentColor" d="M28 34H8a1 1 0 0 0 0 2h20a1 1 0 0 0 0-2M18 9.53a2.75 2.75 0 1 0 2.75 2.75A2.75 2.75 0 0 0 18 9.53m0 3.89a1.15 1.15 0 0 1 0-2.29a1.15 1.15 0 1 1 0 2.29"/>';
						locationHTML +=   '<path fill="currentColor" d="M28.75 22.45a15.5 15.5 0 0 0-2.85-5.52l-.28-.35c0-.34 0-.68-.05-1C24.89 4.36 18.79.6 18.54.44a1 1 0 0 0-1 0c-.26.16-6.35 3.92-7 15.1c0 .32 0 .65-.05 1l-.33.41a15.6 15.6 0 0 0-3.44 11.14a1 1 0 0 0 1 .91h4.43a16.3 16.3 0 0 0 1 2.5a1 1 0 0 0 .87.51H22a1 1 0 0 0 .87-.51a16 16 0 0 0 1-2.5h4.39a1 1 0 0 0 1-.91a15.6 15.6 0 0 0-.51-5.64M21.37 30h-6.69a25.5 25.5 0 0 1-1.59-5.23l-2 .4c.14.65.28 1.25.43 1.82H8.66a13.2 13.2 0 0 1 1.8-7c0 .55.07 1.1.13 1.66l2-.21a34 34 0 0 1-.11-5.77C13 7.35 16.65 3.64 18 2.53c1.38 1.12 5.05 4.82 5.56 13.15A32.86 32.86 0 0 1 21.37 30m3.12-3a37 37 0 0 0 1.09-6.94A13.17 13.17 0 0 1 27.34 27Z"/></svg> ';
						locationHTML +=   launch.pad_name;
						locationHTML += '</p>';
						locationHTML += '<p>';
						locationHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22a5.5 5.5 0 0 0 3.439-9.793a1.11 1.11 0 0 1-.439-.86V5a3 3 0 1 0-6 0v6.348c0 .338-.175.648-.439.86A5.5 5.5 0 0 0 12 22Z"/><path d="M14.5 16.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z"/><path stroke-linecap="round" d="M12 14V5"/></g></svg> ';
						locationHTML +=   '<span id="weather-temperature">Loading temperature...</span>';
						locationHTML += '</p>';
						locationHTML += '<p>';
						locationHTML +=   '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M3 8h2m2-2.143V5.5A2.5 2.5 0 1 1 9.5 8H8m-4 6h1m10 3v.5a3.5 3.5 0 1 0 3.5-3.5H9m-7-3h6m7-3v-.5a3.5 3.5 0 1 1 3.5 3.5h-6.25"/></svg> ';
						locationHTML +=   '<span id="weather-windspeed">Loading windspeed...</span>';
						locationHTML += '</p>';
						$('#launch-location').html(locationHTML);
						fetchWeatherData(launch.pad_latitude, launch.pad_longitude);

						//Generate user data
						userHTML =  '<h3>';
						userHTML +=   '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M16 9c0 5.33-8 5.33-8 0h2c0 2.67 4 2.67 4 0m6 9v3H4v-3c0-2.67 5.33-4 8-4s8 1.33 8 4m-1.9 0c0-.64-3.13-2.1-6.1-2.1S5.9 17.36 5.9 18v1.1h12.2M12.5 2c.28 0 .5.22.5.5v3h1V3a3.89 3.89 0 0 1 2.25 3.75s.7.14.75 1.25H7c0-1.11.75-1.25.75-1.25A3.89 3.89 0 0 1 10 3v2.5h1v-3c0-.28.22-.5.5-.5"/></svg> ';
						userHTML +=   'Operator Data (You)';
						userHTML += '</h3>';
						userHTML += '<p>';
						userHTML +=   '<span id="user-distance-direction"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048"><path fill="currentColor" d="m1024 0l683 2048l-683-683l-683 683z"></path></svg></span>';
						userHTML +=   '<span id="user-distance-measurement"> calculating distance/direction</span>';
						userHTML +=   '<span id="user-distance-text"> to launchpad</span>';
						userHTML +=   '<span id="user-distance-bearing"></span>';
						userHTML += '</p>';
						userHTML += '<p>';
						userHTML +=   '<span id="user-sound-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 22q1.55 0 2.538-.775t1.512-2.275q.425-1.25.813-1.75t1.787-1.6q1.55-1.25 2.45-2.825T17 9q0-2.975-2.013-4.987T10 2T5.012 4.013T3 9h2q0-2.125 1.438-3.562T10 4t3.563 1.438T15 9q0 1.7-.675 2.9T12.4 14.05q-1.3.95-2.025 1.85T9.3 17.85q-.35 1.1-.838 1.625T7 20q-.825 0-1.412-.587T5 18H3q0 1.65 1.175 2.825T7 22m10.8-5.25q1.475-1.5 2.338-3.488T21 9q0-2.3-.862-4.3T17.8 1.2l-1.45 1.4q1.25 1.25 1.95 2.888T19 9q0 1.85-.7 3.475t-1.95 2.875zM10 11.5q1.05 0 1.775-.737T12.5 9q0-1.05-.725-1.775T10 6.5t-1.775.725T7.5 9q0 1.025.725 1.763T10 11.5"></path></svg></span>';
						userHTML +=   '<span id="user-sound-measurement"> calculating time</span>';
						userHTML +=   '<span id="user-sound-text"> to hear rocket</span>';
						userHTML += '</p>';
						userHTML += '<p>';
						userHTML +=   '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.5h-1.28l-.32-1a3 3 0 0 0-2.84-2H9.44A3 3 0 0 0 6.6 5.55l-.32 1H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3.05m1 11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2a1 1 0 0 0 1-.68l.54-1.64a1 1 0 0 1 .95-.68h5.12a1 1 0 0 1 .95.68l.54 1.64a1 1 0 0 0 .9.68h2a1 1 0 0 1 1 1Zm-8-9a4 4 0 1 0 4 4a4 4 0 0 0-4-4m0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2"></path></svg> ';
						userHTML +=   '<a class="white-link" href="index.php?page=camera&id=' + launch.id + '">';
						userHTML +=     'Open in camera view';
						userHTML +=   '</a>';
						userHTML += '</p>';
						userHTML += '<p id="user-map">Loading map...</p>';
						$('#launch-user').html(userHTML);
						userDistanceInterval = setInterval(function() {
							calcUserDistance(launch.pad_latitude, launch.pad_longitude);
						}, 1000);
						pointToLaunchpadInterval = setInterval(function() {
							pointToLaunchpad(launch.pad_latitude, launch.pad_longitude);
						}, 100);
						drawUserMapInterval = setInterval(function() {
							drawUserMap(launch.pad_latitude,launch.pad_longitude);
						}, 100);

						//Generate details data
						if (launch.mission_name) {
							detailsHTML =  '<h3>';
							detailsHTML +=   '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">';
							detailsHTML +=   '<path fill="currentColor" fill-rule="evenodd" d="M256 42.667C138.18 42.667 42.667 138.179 42.667 256c0 117.82 95.513 213.334 213.333 213.334c117.822 0 213.334-95.513 213.334-213.334S373.822 42.667 256 42.667m0 384c-94.105 0-170.666-76.561-170.666-170.667S161.894 85.334 256 85.334c94.107 0 170.667 76.56 170.667 170.666S350.107 426.667 256 426.667m26.714-256c0 15.468-11.262 26.667-26.497 26.667c-15.851 0-26.837-11.2-26.837-26.963c0-15.15 11.283-26.37 26.837-26.37c15.235 0 26.497 11.22 26.497 26.666m-48 64h42.666v128h-42.666z"/></svg> ';
							detailsHTML +=   launch.mission_name;
							detailsHTML += '</h3>';
							detailsHTML += '<p>' + (launch.mission_description?.replace(/[\r\n]+/g, ' ') ?? 'No description available.') + '</p>';
							$('#launch-details').html(detailsHTML);
						} else {
							$('#launch-details').hide();
						}

						//Generate rocket data
						rocketHTML =  '<h3>';
						rocketHTML +=   '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><g fill="currentColor"><path d="m94.81 192l-29.45 22.24a8 8 0 0 1-12.81-4.51L40.19 154.1a8 8 0 0 1 1.66-6.86l30.31-36.33C71 134.25 76.7 161.43 94.81 192m119.34-44.76l-30.31-36.33c1.21 23.34-4.54 50.52-22.65 81.09l29.45 22.24a8 8 0 0 0 12.81-4.51l12.36-55.63a8 8 0 0 0-1.66-6.86" opacity="0.2"></path><path d="M152 224a8 8 0 0 1-8 8h-32a8 8 0 0 1 0-16h32a8 8 0 0 1 8 8m-24-112a12 12 0 1 0-12-12a12 12 0 0 0 12 12m95.62 43.83l-12.36 55.63a16 16 0 0 1-25.51 9.11L158.51 200h-61l-27.26 20.57a16 16 0 0 1-25.51-9.11l-12.36-55.63a16.09 16.09 0 0 1 3.32-13.71l28.56-34.26a123 123 0 0 1 8.57-36.67c12.9-32.34 36-52.63 45.37-59.85a16 16 0 0 1 19.6 0c9.34 7.22 32.47 27.51 45.37 59.85a123 123 0 0 1 8.57 36.67l28.56 34.26a16.09 16.09 0 0 1 3.32 13.71M99.43 184h57.14c21.12-37.54 25.07-73.48 11.74-106.88C156.55 47.64 134.49 29 128 24c-6.51 5-28.57 23.64-40.33 53.12c-13.31 33.4-9.36 69.34 11.76 106.88m-15 5.85q-16.15-29.35-19.6-57.69L48 152.36L60.36 208l.18-.13ZM208 152.36l-16.83-20.2q-3.42 28.28-19.56 57.69l23.85 18l.18.13Z"></path></g></svg> ';
						rocketHTML +=   launch.rocket_name;
						rocketHTML += '</h3>';
						if (launch.rocket_name != launch.rocket_full_name) {
							rocketHTML += '<p>';
							rocketHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/><path d="M7 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0m8-2h2m-2 4h2M7 16h10"/></g></svg> ';
							rocketHTML += launch.rocket_full_name;
							rocketHTML += '</p>';
						}
						if (launch.launch_service_provider != null) {
							rocketHTML += '<p>';
							rocketHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 15h-2v2h2m0-6h-2v2h2m2 6h-8v-2h2v-2h-2v-2h2v-2h-2V9h8M10 7H8V5h2m0 6H8V9h2m0 6H8v-2h2m0 6H8v-2h2M6 7H4V5h2m0 6H4V9h2m0 6H4v-2h2m0 6H4v-2h2m6-10V3H2v18h20V7z"/></svg> ';
							rocketHTML += launch.launch_service_provider;
							rocketHTML += '</p>';
						}
						$('#launch-rocket').html(rocketHTML);
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

//Function to draw the user map relative to their location and the launchpad
function drawUserMap(lpLat, lpLon) {
	//Check to see if user's location has loaded yet
	if (userLatitude && userLongitude) {
		clearTimeout(drawUserMapInterval);
		const currentLatitude = Number(userLatitude);
		const currentLongitude = Number(userLongitude);
		const launchPadLatitude = Number(lpLat);
		const launchPadLongitude = Number(lpLon);

		//Define map
		var map = L.map('user-map').setView([(currentLatitude + currentLongitude) / 2, (launchPadLatitude + launchPadLongitude) / 2], 8);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		tileSize: 512,
		zoomOffset: -1
		}).addTo(map);

		//Define points
		var currentLocation = [currentLatitude, currentLongitude];
		var launchPadLocation = [launchPadLatitude, launchPadLongitude];

		//Draw line between 2 points
		var polyline = L.polyline([currentLocation, launchPadLocation], { color: '#121299', weight: 3 }).addTo(map);

		//Add markers
		L.marker(currentLocation).addTo(map).bindPopup("You");
		L.marker(launchPadLocation).addTo(map).bindPopup("Launch Pad");

		//Zoom map to fit everything
		var bounds = new L.LatLngBounds([currentLocation, launchPadLocation]);
		map.fitBounds(bounds, { padding: [20, 20] });
	}
}
