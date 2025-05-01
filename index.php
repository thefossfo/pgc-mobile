<?php

//Include header file
include("include/header.php");

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

//Begin building page HTML
$page_html = '<body>';

//Include the current page
include($PAGE_INCLUDE);

//Done editing page HTML
$page_html .= '</body>';

//Output the HTML
include("include/html_headers.php");
include("include/html_footer.php");
echo $page_html;

?>
