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

#print "called with " . $_SERVER['QUERY_STRING'];

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
	ob_end_flush();
}
if(!$_REQUEST['action']) {
?>
<html>
    <head>
        <title>Munich Rugbears Training Site</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link href="/css/styling.css" rel="stylesheet" type="text/css" />
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
        <script src="http://timeago.yarp.com/jquery.timeago.js"></script>
        <script src="js/lib/jquery.timeago.de.js"></script>
        <script type="text/javascript">
            $(function() {
               $("abbr.timeago").timeago(); 
            });
        </script>
    </head>
    <body>
        <div class="logo">
            <img src="/img/logo_rb.jpg" alt="Rugbears Logo" width="369" height="295" />
            <h1>Training-site der Munich Rugbears</h1>
        </div>
<p>Die n&auml;chsten 20 Termine:</p>
<ul>
<? 
$data =& soon(20);
while($row = $data->fetchRow()) {
      print "<li><a href='". getViewUrl() . $row->tid ."'>$row->what ($row->where) am ". trainday3($row->tid);
      print " (<abbr class='timeago' title='$row->when'></abbr>)</li>";
    }
 ?>
</ul>
    </body>
</html>
<? } ?>    