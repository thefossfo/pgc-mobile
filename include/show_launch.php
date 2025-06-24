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

$page_html .= '<div id="header"><img alt="PGC logo" src="images/pgc_ai.png">&nbsp;Loading launch data...</div>';
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
$page_html .=     '<div class="block-item-td share-link" data-link="https://wa.me/?text='.$url.'">';
$page_html .=       '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#1faf38"/><stop offset="100%" stop-color="#60d669"/></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#f9f9f9"/><stop offset="100%" stop-color="#fff"/></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a123 123 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004"/><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z"/><path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561s11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716s-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64"/></svg>';
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
$page_html .= '<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>';

?>
