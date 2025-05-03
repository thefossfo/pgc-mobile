$(document).ready(function() {
	//Highlight page icon
	$('#launch-icon').css('color', 'white');
	// Get the current URL
	const currentUrl = window.location.href;
	// Parse the URL to get the base URL (protocol, host, and path)
	const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/')) + '/';
	// Construct the API URL
	const apiUrl = baseUrl + 'api/api.php';
});
