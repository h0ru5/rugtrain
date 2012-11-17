<? ob_start();
#cache disable
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");                  // Date in the past   
header('Last-Modified: '.gmdate('D, d M Y H:i:s') . ' GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');     // HTTP/1.1
header('Cache-Control: pre-check=0, post-check=0, max-age=0');    // HTTP/1.1
header ("Pragma: no-cache");

require_once("functions.inc.php");

if($_REQUEST['tid']) {
    $tid = escapeSQL($_REQUEST['tid']);
} else {
    $tid = nextTid();
}
?>
<html>
    <head>
        <title>Munich Rugbears Training Site</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link href="css/styling.css" rel="stylesheet" type="text/css" />
    </head>
    <body>
<?
ob_end_flush();
switch($_REQUEST['action']) {
	case "add":
		add($tid);
		redirect($tid);
                break;
	case "del":
		del($tid);
		redirect($tid);
                break;
	case "clear":
		clear($tid);
		redirect($tid);
                break;
	case "addcmt":
		addcmt($tid);
		redirect($tid);
                break;
	default:
                if($_REQUEST['tid']) redirect($tid);
}
?>
        <div class="logo">
            <img src="img/logo_rb.jpg" alt="Rugbears Logo" width="369" height="295" />
            <h1>Training-site der Munich Rugbears</h1>
        </div>
<p>Termine in den n&auml;chsten 2 Wochen:</p>
<ul>
<? 
$data =& soon(14);
while($row = $data->fetchRow()) {
      print "<li><a href='" . getViewUrl() . "?tid=$row->tid'>$row->what ($row->where) in $row->diff Tagen</li>";
    }
 ?>
</ul>
    </body>
</html>
    