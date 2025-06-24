<?php

$page_html .= '<div id="header"><img alt="PGC logo" src="images/pgc_ai.png">&nbsp;PGC - Camera View</div>';
$page_html .= '<div id="camera-wrapper">';
$page_html .=	'<select id="launch-select"><option value="">Loading launches...</option></select>';
$page_html .=	'<video id="camera-view" autoplay playsinline></video>';
$page_html .= '</div>';
$page_html .= '<div id="countdown"></div>';
$page_html .= '<div id="launchpad-compass" class="block-item-table">';
$page_html .=   '<div class="block-item-tr center vertical">';
$page_html .=     '<div id="launchpad-compass-1" class="block-item-td vertical"></div>';
$page_html .=     '<div id="launchpad-compass-2" class="block-item-td vertical"></div>';
$page_html .=     '<div id="launchpad-compass-3" class="block-item-td vertical"></div>';
$page_html .=     '<div id="launchpad-compass-4" class="block-item-td vertical"></div>';
$page_html .=     '<div id="launchpad-compass-5" class="block-item-td vertical"></div>';
$page_html .=     '<div id="launchpad-compass-6" class="block-item-td vertical"></div>';
$page_html .=     '<div id="launchpad-compass-7" class="block-item-td vertical"></div>';
$page_html .=     '<div id="launchpad-compass-8" class="block-item-td vertical"></div>';
$page_html .=     '<div id="launchpad-compass-9" class="block-item-td vertical"></div>';
$page_html .=   '</div>';
$page_html .= '</div>';
$page_html .= '<div id="sound-cue">';
$page_html .=   '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 22q1.55 0 2.538-.775t1.512-2.275q.425-1.25.813-1.75t1.787-1.6q1.55-1.25 2.45-2.825T17 9q0-2.975-2.013-4.987T10 2T5.012 4.013T3 9h2q0-2.125 1.438-3.562T10 4t3.563 1.438T15 9q0 1.7-.675 2.9T12.4 14.05q-1.3.95-2.025 1.85T9.3 17.85q-.35 1.1-.838 1.625T7 20q-.825 0-1.412-.587T5 18H3q0 1.65 1.175 2.825T7 22m10.8-5.25q1.475-1.5 2.338-3.488T21 9q0-2.3-.862-4.3T17.8 1.2l-1.45 1.4q1.25 1.25 1.95 2.888T19 9q0 1.85-.7 3.475t-1.95 2.875zM10 11.5q1.05 0 1.775-.737T12.5 9q0-1.05-.725-1.775T10 6.5t-1.775.725T7.5 9q0 1.025.725 1.763T10 11.5"></path></svg>';
$page_html .= '</div>';
$page_html .= '<div id="user-stats">';
$page_html .=	'<div id="launch-go">';
$page_html .=	  '<span id="launch-go-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 56 56"><path fill="currentColor" d="m50.923 21.002l.046.131l.171.566l.143.508l.061.232l.1.42a23.93 23.93 0 0 1-2.653 17.167a23.93 23.93 0 0 1-13.57 10.89l-.404.12l-.496.128l-.717.17a1.89 1.89 0 0 1-2.288-1.558a2.127 2.127 0 0 1 1.606-2.389l.577-.145q.54-.142.929-.273a19.93 19.93 0 0 0 10.899-8.943a19.93 19.93 0 0 0 2.292-13.923l-.069-.313l-.092-.365l-.115-.418l-.138-.47a2.135 2.135 0 0 1 1.26-2.602a1.894 1.894 0 0 1 2.458 1.067M7.385 19.92q.065.02.128.044A2.127 2.127 0 0 1 8.78 22.55q-.27.909-.39 1.513a19.93 19.93 0 0 0 2.295 13.91a19.93 19.93 0 0 0 10.911 8.947l.306.097l.174.05l.39.106l.694.171a2.135 2.135 0 0 1 1.623 2.393a1.894 1.894 0 0 1-2.152 1.594l-.138-.025l-.576-.135l-.51-.13l-.446-.125l-.2-.06A23.93 23.93 0 0 1 7.22 39.972a23.93 23.93 0 0 1-2.647-17.197l.077-.32l.1-.375l.194-.665l.076-.25a1.89 1.89 0 0 1 2.365-1.246M28.051 12c8.837 0 16 7.163 16 16s-7.163 16-16 16s-16-7.163-16-16s7.164-16 16-16m0 4c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.628 0 12-5.373 12-12s-5.372-12-12-12m0-12a23.93 23.93 0 0 1 16.217 6.306l.239.227l.275.274l.31.322l.346.369a1.89 1.89 0 0 1-.205 2.76a2.127 2.127 0 0 1-2.873-.196q-.326-.345-.605-.617l-.35-.334l-.16-.143A19.93 19.93 0 0 0 28.051 8a19.93 19.93 0 0 0-13.204 4.976l-.114.102l-.253.24l-.287.285l-.495.515c-.76.809-2.014.9-2.883.21a1.894 1.894 0 0 1-.305-2.662l.09-.106l.405-.431l.368-.378q.262-.263.484-.465A23.93 23.93 0 0 1 28.05 4"></path></svg></span>';
$page_html .=     '<span id="launch-go-probability"> Calculating</span>';
$page_html .=	  '<span id="launch-go-status"> status.</span>';
$page_html .=	'</div>';
$page_html .=	'<div id="user-distance">';
$page_html .=		'<span id="user-distance-direction"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048"><path fill="currentColor" d="m1024 0l683 2048l-683-683l-683 683z"/></svg></span>';
$page_html .=		'<span id="user-distance-measurement"> calculating distance/direction</span>';
$page_html .=		'<span id="user-distance-text"> to launchpad</span>';
$page_html .=		'<span id="user-distance-bearing"></span>';
$page_html .=	'</div>';
$page_html .=	'<div id="user-sound">';
$page_html .=		'<span id="user-sound-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 22q1.55 0 2.538-.775t1.512-2.275q.425-1.25.813-1.75t1.787-1.6q1.55-1.25 2.45-2.825T17 9q0-2.975-2.013-4.987T10 2T5.012 4.013T3 9h2q0-2.125 1.438-3.562T10 4t3.563 1.438T15 9q0 1.7-.675 2.9T12.4 14.05q-1.3.95-2.025 1.85T9.3 17.85q-.35 1.1-.838 1.625T7 20q-.825 0-1.412-.587T5 18H3q0 1.65 1.175 2.825T7 22m10.8-5.25q1.475-1.5 2.338-3.488T21 9q0-2.3-.862-4.3T17.8 1.2l-1.45 1.4q1.25 1.25 1.95 2.888T19 9q0 1.85-.7 3.475t-1.95 2.875zM10 11.5q1.05 0 1.775-.737T12.5 9q0-1.05-.725-1.775T10 6.5t-1.775.725T7.5 9q0 1.025.725 1.763T10 11.5"/></svg></span>';
$page_html .=		'<span id="user-sound-measurement"> calculating time</span>';
$page_html .=		'<span id="user-sound-text"> to hear rocket</span></div>';
$page_html .=	'</div>';
$page_html .= '</div>';
$page_html .= '<script src="js/ar.js"></script>';
$page_html .= '<script src="js/camera.js"></script>';
$page_html .= '<script src="js/compass.js"></script>';

?>
