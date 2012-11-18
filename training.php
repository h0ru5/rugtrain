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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<!-- link rel="alternate" type="application/rss+xml" title="RSS-Feed" href="rss.php" / -->
<title>Rugbears Training</title>
<script type="text/javascript">
function addcmt() {
	if(document.getElementById("cmtaddform").style.visibility == "visible")
		document.getElementById("cmtaddform").style.visibility = "hidden";
	else
		document.getElementById("cmtaddform").style.visibility = "visible";
}
</script>

<link href="css/styling.css" rel="stylesheet" type="text/css" />
</head>
<body>

<h1>RugBears Training <?= trainday3($tid) ?><!-- trainday(<?= $tid ?>); --></h1>	
<div id="linkback"><a href="<?=getViewUrl() ?>">zur&uuml;ck zur &Uuml;bersicht</a></div>
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
				<textarea cols="40" name="msg" wrap="physical"></textarea>
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
