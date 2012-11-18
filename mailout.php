<?
require_once("functions.inc.php");
require_once("const.inc.php");


    $now =& new DateTime();
    $fp = fopen("mailout.log", "w");
    $data = & soon(8);
    
    fputs($fp, "Mailout running on " . $now->format("Y-m-d") ."\n");
    while($row = $data->fetchRow()) {
      fputs($fp,"> $row->tid: $row->what in $row->where in $row->diff days\n");
      if($row->diff == $daysahead) {
          fputs($fp,"mailing out...\n");
          mailOutFor($row->tid);
      }
    }
    fputs($fp,"done!\n");

    fclose($fp);

function mailOutFor($tid,$log) {
    $data = & doQuery("SELECT name,email FROM mailliste ORDER BY name");
    fputs($log,"start mailing\n");
    while($row = $data->fetchRow()) {
        fputs($log,$row->name . ": " . $row->email . "\n");
    #	mailout($row->name,$row->email,$tid);
    }
    mailout("Johannes","rugby@johanneshund.de",$tid);
    fputs($log,"mailing done\n");
}

function mailout($name_i,$mailadd,$tid) {
$name = urlencode($name_i);
$td = trainday3($tid);

$html_body = "
<html>
<head>
</head>

<body>
<h1>RugBears Training am $td</h1>
<p>Kommst du? einfach den Link anklicken<br>Ergebnisse sind auf <a href='http://rugby.johanneshund.de'>rugby.johanneshund.de</a></p>
<table width='80%' style='table-layout:fixed'>
<tr>
<td width='33%'><a href='http://rugby.johanneshund.de/index.php?action=add&vote=1&name=$name'>Spiele</a></td>
<td width='33%'><a href='http://rugby.johanneshund.de/index.php?action=add&vote=2&name=$name'>Komme</a></td>
<td width='33%'><a href='http://rugby.johanneshund.de/index.php?action=add&vote=3&name=$name'>Komme nicht</a></td>
</tr>
</table>
</body>
</html>";

$text_body = "
Rugbears Training am $td\n\nKommst du? einfach link anklicken\n
Spiele: http://rugby.johanneshund.de/index.php?action=add&vote=1&name=$name\n\n
Komme: http://rugby.johanneshund.de/index.php?action=add&vote=2&name=$name\n\n
Komme nicht: http://rugby.johanneshund.de/index.php?action=add&vote=3&name=$name\n\n";
$grenze="Nextpart";

$headers ="MIME-Version: 1.0\n";
#$headers.="From:\"$name_i\"<$mailadd>\n";
$headers.="From:\"Rugbot\"<rugby@johanneshund.de>\n";
$headers.="Content-Type: multipart/alternative;\n\tboundary=$grenze\n";

$msg = "\n--$grenze\n";
$msg.="Content-transfer-encoding: 7BIT\n";
$msg.="Content-type: text/plain\n";
$msg.="Content-Disposition: inline\n\n";
$msg.=text_body;
$msg = "\n\n\n--$grenze\n";
$msg.="Content-transfer-encoding: 7BIT\n";
$msg.="Content-type: text/html\n";
$msg.="Content-Disposition: inline\n\n";
$msg.=$html_body;
$msg.="\n\n--$grenze";

mail($mailadd,"RugBears Training $td",$msg,$headers);
}
?>