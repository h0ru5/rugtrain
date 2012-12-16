<? 
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
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
<script src="http://code.jquery.com/ui/1.9.2/jquery-ui.min.js" type="text/javascript"></script>
<title>Rugbears Training</title>
<script type="text/javascript">
function addcmt() {
	if(document.getElementById("cmtaddform").style.visibility == "visible")
		document.getElementById("cmtaddform").style.visibility = "hidden";
	else
		document.getElementById("cmtaddform").style.visibility = "visible";
}
</script>

<link href="/css/styling.css" rel="stylesheet" type="text/css" />
</head>
<body>

<h1>RugBears Training <?= trainday3($tid) ?><!-- trainday(<?= $tid ?>); --></h1>	
<div id="linkback">
    <a href="<?=getViewUrl() ?>">zur&uuml;ck zur &Uuml;bersicht</a><br/>
    <a href="<?=getViewUrl() . $tid ?>">zur neuen Ansicht</a>
</div>
<div class="kommentare">
	<h3>Kommentare: <a href="javascript:addcmt()" class="lil">hinzuf&uuml;gen...</a></h3>

	<div id="cmtaddform" class="cmtform" >
		<form method="post" action="<?= getViewUrl() . $tid . "/addcmt"  ?>">
			Name:<br />
			Kommentar: 
			<div style="position:absolute;left:100px;top:0px">
				<input type="hidden" name="tid" value="<?= $tid ?>" />
                                <input type="hidden" name="action" value="addcmt" />
				<input type="text" name="autor"  value="<?= getCookieName() ?>" /><br />
				<textarea cols="40" name="msg" wrap="virtual"></textarea>
				<input type="submit" value="Eintragen" />
			</div>
		</form>
	</div>
	<? comments($tid) ?>
</div>

	
<h3>Bisher gemeldet:</h3>
<p><?= nl2br(stats($tid)) ?></p>

<? tableview($tid); ?>

<p>&nbsp;<br />
</p>

<? form($tid); ?>

</body>
</html>
