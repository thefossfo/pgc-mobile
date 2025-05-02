<?php

$page_html .= '<div id="header"><img src="images/pgc_ai.png">&nbsp;PGC - Camera View</div>';
$page_html .= '<div id="camera-wrapper">';
$page_html .=	'<div id="countdown"></div>';
$page_html .=	'<select id="launch-select"><option value="">Loading launches...</option></select>';
$page_html .=	'<video id="camera-view" autoplay playsinline></video>';
$page_html .= '</div>';
$page_html .= '<script src="js/camera.js"></script>';

?>
