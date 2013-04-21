<?php
require_once("phpicalwriter/iCalWriter.php");
require_once("Trainings.php");

//to be upstreamed into phpicalwriter
$pstate[1]="ACCEPTED";
$pstate[2]="TENTATIVE";
$pstate[3]="DECLINED";

function addEvents($cal) {

    global $pstate;
    $all = allFutures()->fetchAll();
    foreach ($all as $tid) {
        $item = new iCalEvent;
        $it = Trainings::details($tid->tid);
        
        
        $item->setLocation($it->where);
        $item->setShortDescription($it->what);
        //$dat = new DateTime($it->when);
        $dat = new DateTime($it->start);
        $item->setStart($dat->format("Y"),$dat->format("m"),$dat->format("d"), 0, 1, "", 1,$dat->format("H"),$dat->format("i"));
        $dat = new DateTime($it->end);
        //$dat->modify("+1 day"); //refractor dates to start and end
        $item->setEnd($dat->format("Y"),$dat->format("m"),$dat->format("d"),0, 1, "", 1,$dat->format("H"),$dat->format("i"));
        //$item->setDuration(0, 1);
        
        $text = "$it->what ($it->where) \\n" ;
        foreach ($it->stats as $v) {
                $text .= $v->vote . ": " . $v->count . "\\n";
        }
        $text .= "Details unter http://training.munich-rugbears.de/" . $it->tid . "\\n";
        $text .=   "\n";
        
        foreach (Trainings::votes($it->tid) as $v) {
            $item->addAttendee($v->name ."@munich-rugbears.de","PARTSTAT=" . $pstate[$v->vid]. ";CN=\"$v->name\"");
    //        $item->addAttendee("rugbyball@munich-rugbears.de", "PARTSTAT=ACCEPTED;CN=\"Rugby Ball\"");
    //        $item->addAttendee("john@somewhere.de", "PARTSTAT=DECLINED;CN=\"John Doe\"");
        }
        
        
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
