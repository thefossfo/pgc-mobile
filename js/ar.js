//Function to update countdown timer
function updateCountdown(targetTime) {
	const now = new Date().getTime();
	const target = new Date(targetTime).getTime();
	let difference = target - now;
	if (difference <= 0) {
		clearInterval(countdownInterval);
		$("#countdown").text("LAUNCHED!");
		return;
	}
	const days = Math.floor(difference / (1000 * 60 * 60 * 24));
	difference -= days * (1000 * 60 * 60 * 24);
	const hours = Math.floor(difference / (1000 * 60 * 60));
	difference -= hours * (1000 * 60 * 60);
	const minutes = Math.floor(difference / (1000 * 60));
	difference -= minutes * (1000 * 60);
	const seconds = Math.floor(difference / 1000);
	$("#countdown").text(`T - ${days}d ${hours}:${minutes}:${seconds}`);
}

//Function to update launch status
function updateLaunchStatus(lP, lS) {
	if (Number.isInteger(lP)) {
		$("#launch-go").css('color', generateProbabilityColor(lP));
		$("#launch-go-probability").text(' ' + lP + '%');
	} else {
		$("#launch-go").css('color', 'inherit');
		$("#launch-go-probability").text('');
	}
	$("#launch-go-status").text(' ' + lS);
}
