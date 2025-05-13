<?php

//Grab URL of current page for sharing
if (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1)) {
    $protocol = 'https://';
} else {
    $protocol = 'http://';
}
$host = $_SERVER['HTTP_HOST'];
$uri = $_SERVER['REQUEST_URI'];
$url = urlencode($protocol . $host . $uri);

$page_html .= '<div id="header"><img src="images/pgc_ai.png">&nbsp;Loading launch data...</div>';
$page_html .= '<div id="header-spacer"></div>';
$page_html .= '<div class="block-item blue-link"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4" d="M44 40.836q-7.34-8.96-13.036-10.168t-10.846-.365V41L4 23.545L20.118 7v10.167q9.523.075 16.192 6.833q6.668 6.758 7.69 16.836Z" clip-rule="evenodd"/></svg>&nbsp;<a class="blue-link" href="index.php?page=select">See all launches...</a></div>';
$page_html .= '<div class="block-item block-item-table center">';
$page_html .=   '<div class="block-item-tr">';
$page_html .=     '<div class="block-item-td copy-link" data-link="'.$url.'">';
$page_html .=       '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m13.12 17.023l-4.199-2.29a4 4 0 1 1 0-5.465l4.2-2.29a4 4 0 1 1 .958 1.755l-4.2 2.29a4 4 0 0 1 0 1.954l4.2 2.29a4 4 0 1 1-.959 1.755M6 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4m11-6a2 2 0 1 0 0-4a2 2 0 0 0 0 4m0 12a2 2 0 1 0 0-4a2 2 0 0 0 0 4"/></svg>';
$page_html .=     '</div>';
$page_html .=     '<div class="block-item-td share-link" data-link="https://www.facebook.com/sharer/sharer.php?u='.$url.'">';
$page_html .=       '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="#1877f2" d="M256 128C256 57.308 198.692 0 128 0S0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"/><path fill="#fff" d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A129 129 0 0 0 128 256a129 129 0 0 0 20-1.555V165z"/></svg>';
$page_html .=     '</div>';
$page_html .=     '<div class="block-item-td share-link" data-link="https://x.com/intent/tweet?url='.$url.'">';
$page_html .=       '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor"><path d="M1 2h2.5L3.5 2h-2.5zM5.5 2h2.5L7.2 2h-2.5z"><animate fill="freeze" attributeName="d" dur="0.4s" values="M1 2h2.5L3.5 2h-2.5zM5.5 2h2.5L7.2 2h-2.5z;M1 2h2.5L18.5 22h-2.5zM5.5 2h2.5L23 22h-2.5z"/></path><path d="M3 2h5v0h-5zM16 22h5v0h-5z"><animate fill="freeze" attributeName="d" begin="0.4s" dur="0.4s" values="M3 2h5v0h-5zM16 22h5v0h-5z;M3 2h5v2h-5zM16 22h5v-2h-5z"/></path><path d="M18.5 2h3.5L22 2h-3.5z"><animate fill="freeze" attributeName="d" begin="0.5s" dur="0.4s" values="M18.5 2h3.5L22 2h-3.5z;M18.5 2h3.5L5 22h-3.5z"/></path></g></svg>';
$page_html .=     '</div>';
/* Reddit link sharing seems to cut off part of the link
$page_html .=     '<div class="block-item-td share-link" data-link="https://www.reddit.com/submit?url='.$url.'">';
$page_html .=       '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><circle cx="128" cy="128" r="128" fill="#ff4500"/><path fill="#fff" d="M213.15 129.22c0-10.376-8.391-18.617-18.617-18.617a18.74 18.74 0 0 0-12.97 5.189c-12.818-9.157-30.368-15.107-49.9-15.87l8.544-39.981l27.773 5.95c.307 7.02 6.104 12.667 13.278 12.667c7.324 0 13.275-5.95 13.275-13.278c0-7.324-5.95-13.275-13.275-13.275c-5.188 0-9.768 3.052-11.904 7.478l-30.976-6.562c-.916-.154-1.832 0-2.443.458c-.763.458-1.22 1.22-1.371 2.136l-9.464 44.558c-19.837.612-37.692 6.562-50.662 15.872a18.74 18.74 0 0 0-12.971-5.188c-10.377 0-18.617 8.391-18.617 18.617c0 7.629 4.577 14.037 10.988 16.939a33.6 33.6 0 0 0-.458 5.646c0 28.686 33.42 52.036 74.621 52.036c41.202 0 74.622-23.196 74.622-52.036a35 35 0 0 0-.458-5.646c6.408-2.902 10.985-9.464 10.985-17.093M85.272 142.495c0-7.324 5.95-13.275 13.278-13.275c7.324 0 13.275 5.95 13.275 13.275s-5.95 13.278-13.275 13.278c-7.327.15-13.278-5.953-13.278-13.278m74.317 35.251c-9.156 9.157-26.553 9.768-31.588 9.768c-5.188 0-22.584-.765-31.59-9.768c-1.371-1.373-1.371-3.51 0-4.883c1.374-1.371 3.51-1.371 4.884 0c5.8 5.8 18.008 7.782 26.706 7.782s21.058-1.983 26.704-7.782c1.374-1.371 3.51-1.371 4.884 0c1.22 1.373 1.22 3.51 0 4.883m-2.443-21.822c-7.325 0-13.275-5.95-13.275-13.275s5.95-13.275 13.275-13.275c7.327 0 13.277 5.95 13.277 13.275c0 7.17-5.95 13.275-13.277 13.275"/></svg>';
$page_html .=     '</div>';
 */
$page_html .=     '<div class="block-item-td share-link" data-link="https://www.linkedin.com/sharing/share-offsite/?url='.$url.'">';
$page_html .=       '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><g fill="none"><rect width="256" height="256" fill="#fff" rx="60"/><rect width="256" height="256" fill="#0a66c2" rx="60"/><path fill="#fff" d="M184.715 217.685h29.27a4 4 0 0 0 4-3.999l.015-61.842c0-32.323-6.965-57.168-44.738-57.168c-14.359-.534-27.9 6.868-35.207 19.228a.32.32 0 0 1-.595-.161V101.66a4 4 0 0 0-4-4h-27.777a4 4 0 0 0-4 4v112.02a4 4 0 0 0 4 4h29.268a4 4 0 0 0 4-4v-55.373c0-15.657 2.97-30.82 22.381-30.82c19.135 0 19.383 17.916 19.383 31.834v54.364a4 4 0 0 0 4 4M38 59.628c0 11.864 9.767 21.626 21.632 21.626c11.862-.001 21.623-9.769 21.623-21.631C81.253 47.761 71.491 38 59.628 38C47.762 38 38 47.763 38 59.627m6.959 158.058h29.307a4 4 0 0 0 4-4V101.66a4 4 0 0 0-4-4H44.959a4 4 0 0 0-4 4v112.025a4 4 0 0 0 4 4"/></g></svg>';
$page_html .=     '</div>';
$page_html .=   '</div>';
$page_html .= '</div>';
$page_html .= '<div id="launch-list">';
$page_html .=	'<div id="launch-countdown" class="block-item">';
$page_html .=		'<table class="countdown-table">';
$page_html .=			'<tr>';
$page_html .=				'<td>T</td>';
$page_html .=				'<td>-</td>';
$page_html .=				'<td id="countdown-table-days">0</td>';
$page_html .=				'<td id="countdown-table-hours">00</td>';
$page_html .=				'<td>:</td>';
$page_html .=				'<td id="countdown-table-minutes">00<td>';
$page_html .=				'<td>:</td>';
$page_html .=				'<td id="countdown-table-seconds">00<td>';
$page_html .=			'</tr>';
$page_html .=			'<tr class="countdown-table-footers">';
$page_html .=				'<td></td>';
$page_html .=				'<td></td>';
$page_html .=				'<td>D</td>';
$page_html .=				'<td>H</td>';
$page_html .=				'<td></td>';
$page_html .=				'<td>M<td>';
$page_html .=				'<td></td>';
$page_html .=				'<td>S<td>';
$page_html .=			'</tr>';
$page_html .=		'</table>';
$page_html .=	'</div>';
$page_html .=	'<div id="launch-status" class="block-item">Loading launch status...</div>';
$page_html .=	'<div id="launch-location" class="block-item">Loading launch location data...</div>';
$page_html .=	'<div id="launch-user" class="block-item">Loading user data...</div>';
$page_html .=	'<div id="launch-details" class="block-item">Loading mission details...</div>';
$page_html .=	'<div id="launch-rocket" class="block-item">Loading rocket details...</div>';
$page_html .= '</div>';
$page_html .= '<div id="footer-spacer"></div>';
$page_html .= '<script src="js/show_launch.js"></script>';
$page_html .= '<script src="js/compass.js"></script>';

?>
