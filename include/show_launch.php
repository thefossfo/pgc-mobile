<?php

$page_html .= '<div id="header"><img src="images/pgc_ai.png">&nbsp;Loading launch data...</div>';
$page_html .= '<div id="header-spacer"></div>';
$page_html .= '<div class="block-item"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4" d="M44 40.836q-7.34-8.96-13.036-10.168t-10.846-.365V41L4 23.545L20.118 7v10.167q9.523.075 16.192 6.833q6.668 6.758 7.69 16.836Z" clip-rule="evenodd"/></svg>&nbsp;<a class="white-link" href="index.php?page=select">See all launches...</a></div>';
$page_html .= '<div id="launch-list">';
$page_html .=	'<div id="launch-countdown" class="block-item">LOADING COUNTDOWN...</div>';
$page_html .=	'<div id="launch-status" class="block-item">Loading launch status...</div>';
$page_html .=	'<div id="launch-location" class="block-item">Loading launch location data...</div>';
$page_html .=	'<div id="launch-user" class="block-item">Loading user data...</div>';
$page_html .=	'<div id="launch-details" class="block-item">Loading mission details...</div>';
$page_html .= '</div>';
$page_html .= '<div id="footer-spacer"></div>';
$page_html .= '<script src="js/show_launch.js"></script>';

?>
