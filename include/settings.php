<?php

$page_html .= '<div id="header"><img alt="PGC logo" src="images/pgc_ai.png">&nbsp;PGC - Settings</div>';
$page_html .= '<div id="header-spacer"></div>';
$page_html .= '<div class="block-item info">';
$page_html .=   '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none"><path fill="#2f88ff" stroke="#000" stroke-linejoin="round" stroke-width="4" d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"/><path fill="#fff" fill-rule="evenodd" d="M24 11C25.3807 11 26.5 12.1193 26.5 13.5C26.5 14.8807 25.3807 16 24 16C22.6193 16 21.5 14.8807 21.5 13.5C21.5 12.1193 22.6193 11 24 11Z" clip-rule="evenodd"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M24.5 34V20H23.5H22.5"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M21 34H28"/></g></svg>';
$page_html .= '&nbsp;We respect your privacy. This website does not intentionally gather any personal information or camera data without your permission.';
$page_html .= '</div>';
$page_html .= '<div class="block-item info">';
$page_html .=   '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none"><path fill="#2f88ff" stroke="#000" stroke-linejoin="round" stroke-width="4" d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z"/><path fill="#fff" fill-rule="evenodd" d="M24 11C25.3807 11 26.5 12.1193 26.5 13.5C26.5 14.8807 25.3807 16 24 16C22.6193 16 21.5 14.8807 21.5 13.5C21.5 12.1193 22.6193 11 24 11Z" clip-rule="evenodd"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M24.5 34V20H23.5H22.5"/><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M21 34H28"/></g></svg>';
$page_html .= '&nbsp;Some devices may report headings as magnetic north and not true north making it more difficult to determine the location of the launchpad. This app will attempt to provide the most accurate data but it may not work on all devices. See <a href="https://en.wikipedia.org/wiki/Magnetic_declination" target="_blank" class="white-link">magnetic declination.</a>';
$page_html .= '</div>';
$page_html .= '<div class="block-item">';
$page_html .=   '<a class="white-link" href="index.php?page=how-to-install">';
$page_html .=     '<h3>';
$page_html .=       '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">';
$page_html .=       '<path fill="currentColor" fill-rule="evenodd" d="M256 42.667C138.18 42.667 42.667 138.179 42.667 256c0 117.82 95.513 213.334 213.333 213.334c117.822 0 213.334-95.513 213.334-213.334S373.822 42.667 256 42.667m0 384c-94.105 0-170.666-76.561-170.666-170.667S161.894 85.334 256 85.334c94.107 0 170.667 76.56 170.667 170.666S350.107 426.667 256 426.667m26.714-256c0 15.468-11.262 26.667-26.497 26.667c-15.851 0-26.837-11.2-26.837-26.963c0-15.15 11.283-26.37 26.837-26.37c15.235 0 26.497 11.22 26.497 26.666m-48 64h42.666v128h-42.666z"></path></svg> ';
$page_html .=       'How to install PGC as an app';
$page_html .=     '</h3>';
$page_html .=   '</a>';
$page_html .= '</div>';
$page_html .= '<div class="block-item block-item-table">';
$page_html .=   '<div class="block-item-tr">';
$page_html .=     '<div class="block-item-td">Allow cookies</div>';
$page_html .=     '<div class="block-item-td right radio-slider-wrapper">';
$page_html .=       '<div class="radio-slider">';
$page_html .=         '<input type="radio" name="allow_cookies" value="0" id="allow_cookies_no" checked>';
$page_html .=         '<label for="allow_cookies_no">no</label>';
$page_html .=       '</div>';
$page_html .=       '<div class="radio-slider">';
$page_html .=         '<input type="radio" name="allow_cookies" value="1" id="allow_cookies_yes">';
$page_html .=         '<label for="allow_cookies_yes">yes</label>';
$page_html .=       '</div>';
$page_html .=     '</div>';
$page_html .=   '</div>';
$page_html .= '</div>';
if (isset($_COOKIE["allowCookies"]) && $_COOKIE["allowCookies"] === "true") {
	$page_html .= '<div class="block-item block-item-table">';
	$page_html .=   '<div class="block-item-tr">';
	$page_html .=     '<div class="block-item-td">Show Compass</div>';
	$page_html .=     '<div class="block-item-td right radio-slider-wrapper">';
	$page_html .=       '<div class="radio-slider">';
	$page_html .=         '<input type="radio" name="show_compass" value="0" id="show_compass_no" checked>';
	$page_html .=         '<label for="show_compass_no">no</label>';
	$page_html .=       '</div>';
	$page_html .=       '<div class="radio-slider">';
	$page_html .=         '<input type="radio" name="show_compass" value="1" id="show_compass_yes">';
	$page_html .=         '<label for="show_compass_yes">yes</label>';
	$page_html .=       '</div>';
	$page_html .=     '</div>';
	$page_html .=   '</div>';
	$page_html .= '</div>';
}
$page_html .= '<div id="footer-spacer"></div>';
$page_html .= '<script src="js/settings.js"></script>';

?>
