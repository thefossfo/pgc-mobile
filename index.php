<?php

//Include header file
include("/var/www/html/include/header.php");

//Define what page to show
if (isset($_GET['page'])) {
	$PAGE = strtoupper($_GET['page']);
} else {
	header('Location: /pgc-mobile/index.php?page=select');
	die();
}
$PAGE_TITLE = "PGC Mobile";
$PAGE_LIST = array(
	"SELECT",
	"LAUNCH",
	"CAMERA"
);
$PAGE_SRC = array(
	"include/select_launch.php",
	"include/show_launch.php",
	"include/camera.php"
);
$PAGE_TITLES = array(
	"Select a launch",
	"Launch details",
	"Camera view"
);
for ($p=0;$p<count($PAGE_LIST);$p++) {
        if ($PAGE_LIST[$p]==$PAGE) {
                $PAGE_TITLE = $PAGE_TITLES[$p] . " | " . $PAGE_TITLE;
                $PAGE_INCLUDE=$PAGE_SRC[$p];
                break;
        }
}
if (!isset($PAGE_INCLUDE)) {
        //If the page doesn't exist throw error
        page_error(404);
}


?>
