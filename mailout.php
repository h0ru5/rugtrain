<?
require_once("functions.inc.php");

#clear();
    $data = & soon(14);
    print "In the next two weeks:<br/>";
    print "<ul>";
    while($row = $data->fetchRow()) {
      print "<li><a href='" . getViewUrl() . "?tid=$row->tid'>$row->what in $row->where in $row->diff days</li>";
      if($row->diff == 7) {
          print "<p>Mailing";
          mailOutFor($row->tid);
          print "</p>";
      }
      
    }
    print "</ul>";



function mailOutFor($tid) {
    $data = & doQuery("SELECT name,email FROM mailliste ORDER BY name");
    print "<br>\nmaile..<br>\n";
    while($row = $data->fetchRow()) {
        print $row->name . ": " . $row->email . "<br>\n";
    #	mailout($row->name,$row->email,$tid);
    }
    mailout("Johannes","rugby@johanneshund.de",$tid);
    print "Done";
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
print "mail verschickt an $name ($mailadd)<br>\n";
}
?>