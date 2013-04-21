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
        $item->setStart($dat->format("Y"),$dat->format("m"),$dat->format("d"), 0, 1, "", 1);
        $dat->modify("+1 day"); //refractor dates to start and end
        $item->setEnd($dat->format("Y"),$dat->format("m"),$dat->format("d"),0, 1, "", 1);
        $item->setDuration(0, 1);
        
        $text = "$it->what ($it->where) \\n " ;
        $text .= "Details unter http://training.munich-rugbears.de/" . $it->tid;
        $text .=   "\n";
        
        $item->setLongDescription($text);
        $item->setURL("http://training.munich-rugbears.de/" . $it->tid);
        
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
