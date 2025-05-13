$(document).ready(function() {
	//If cookies are enabled, toggle sliders
	const allowCookies = document.cookie.split('; ').find(row => row.startsWith('allowCookies='))?.split('=')[1];
	if (allowCookies) {
		const showCompass = document.cookie.split('; ').find(row => row.startsWith('showCompass='))?.split('=')[1];
		$("#allow_cookies_yes").prop("checked", true);
		console.log(allowCookies);
		if (showCompass === 'true') { $("#show_compass_yes").prop("checked", true); }
	}
	//Highlight the current page
	$('#settings-icon').css('color', 'white');
});

//Enable/disable cookies
$('input[name="allow_cookies"]').on('change', function() {
	const allowCookies = parseInt($(this).val());
	if (allowCookies) {
		document.cookie = "allowCookies=true; path=/;";
	} else {
		destroyAllCookies();
	}
	window.location.reload();
});
//Destroy cookies if allow cookies is changed to no
function destroyAllCookies() {
	const cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		const equalsIndex = cookie.indexOf('=');
		const name = equalsIndex > -1 ? cookie.substring(0, equalsIndex) : cookie;
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + window.location.hostname + ';';
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;'; // For cookies without a domain
	}
}


//Show compass
$('input[name="show_compass"]').on('change', function() {
	const showCompass = parseInt($(this).val());
	if (showCompass) {
		document.cookie = "showCompass=true; path=/;";
	} else {
		document.cookie = "showCompass=false; path=/;";
	}
});
