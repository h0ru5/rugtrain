<?php
require_once("res/phpicalwriter/iCalWriter.php");
require_once("functions.inc.php");

function addEvents($cal) {
    $all = allFutures()->fetchAll();
    
    foreach ($all as $it) {
        $item = new iCalEvent;
        
        $item->setLocation($it->where);
        $item->setShortDescription($it->what);
        $dat = new DateTime($it->when);
        $item->setStart($dat->format("Y"),$dat->format("m"),$dat->format("d"));
        $dat->modify("+1 day");
        $item->setEnd($dat->format("Y"),$dat->format("m"),$dat->format("d"));
        $item->setDuration(0, 1);
        $cal->add($item);
    }
}

$iCal = new iCalWriter;

$iCal->setDownloadOutput();
$iCal->setFileName("rugbears-training.ics");

if($_GET["display"]) {
    $iCal->setHTMLOutput();
}

$iCal->start();

addEvents($iCal);

$iCal->end();
?>
