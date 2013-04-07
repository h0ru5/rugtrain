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
          mailOutFor($row,$fp);
      }
    }
    fputs($fp,"done!\n");

    fclose($fp);

function mailOutFor($evt,$log) {
    $data = & doQuery("SELECT name,email FROM mailliste ORDER BY name");
    fputs($log,"start mailing\n");
    while($row = $data->fetchRow()) {
        fputs($log,$row->name . ": " . $row->email . "\n");
        mailout($row->name,$row->email,$evt);
    }
    fputs($log,"mailing done\n");
}

function mailout($name_i,$mailadd,$evt) {
$name = urlencode($name_i);
$td = trainday3($evt->tid);

$html_body = "
<html>
<head>
<meta charset='utf-8'>
<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
<style type='text/css'>
.logo, .logo * {
    text-align: center;
    display: block;
    margin-left: auto;
    margin-right: auto
}
</style>
</head>

<body>
<div class='logo'>
<img src='http://training.munich-rugbears.de/img/logo_rb.jpg' alt='Rugbears logo' />
<h1>RugBears $evt->what am $td</h1>
<p>Ort: $evt->where</p>
</div>

<p>Kommst du? einfach den Link anklicken<br/>
Ergebnisse f&uuml;r diesen Termin sind auf <a href='http://training.munichrugbears.de/$evt->tid'>training.munichrugbears.de/$evt->tid</a><br/>
Den n&auml;chsten Termin findest du auf <a href='http://training.munichrugbears.de/next'>training.munichrugbears.de/next</a><br/>
Die Liste aller Termine findest du auf <a href='http://training.munichrugbears.de'>training.munichrugbears.de</a>
</p>
<table width='80%' style='table-layout:fixed'>
<tr>
<td width='33%'><a href='http://training.munich-rugbears.de/$evt->tid/add?vote=1&name=$name'>Spiele</a></td>
<td width='33%'><a href='http://training.munich-rugbears.de/$evt->tid/add?vote=2&name=$name'>Komme</a></td>
<td width='33%'><a href='http://training.munich-rugbears.de/$evt->tid/add?vote=3&name=$name'>Komme nicht</a></td>
</tr>
</table>
</body>
</html>";

$text_body = "
Rugbears $evt->what am $td\nin $evt->where\n\nKommst du? einfach link anklicken\n
Spiele: http://training.munich-rugbears.de/$evt->tid/add?vote=3&name=$name\n\n
Komme: http://training.munich-rugbears.de/$evt->tid/add?vote=3&name=$name\n\n
Komme nicht: http://training.munich-rugbears.de/$evt->tid/add?vote=3&name=$name\n\n";
$grenze="NextpartInMyMultiModalmessage";

$headers ="MIME-Version: 1.0\n";
#$headers.="From:\"$name_i\"<$mailadd>\n";
$headers.="From:\"Rugbot\"<training@munich-rugbears.de>\n";
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
$msg.="\n\n--$grenze--";

mail($mailadd,"RugBears Training $td",$msg,$headers);
}
?>