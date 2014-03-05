<? ob_start();
#cache disable
header( 'content-type: text/html; charset=utf-8' );
/* header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");                  // Date in the past   
header('Last-Modified: '.gmdate('D, d M Y H:i:s') . ' GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');     // HTTP/1.1
header('Cache-Control: pre-check=0, post-check=0, max-age=0');    // HTTP/1.1
header ("Pragma: no-cache"); */

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
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link href="/css/styling.min.css" rel="stylesheet" type="text/css" />
         <link href="http://code.jquery.com/ui/1.9.2/themes/smoothness/jquery-ui.css"  rel="stylesheet" type="text/css" />
         
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
        <script src="http://code.jquery.com/ui/1.9.2/jquery-ui.min.js" type="text/javascript"></script>
        <script src="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/jquery.dataTables.min.js" type="text/javascript"></script>
        <script src="js/lib/jquery.timeago.js"></script>
        <script src="js/lib/jquery.timeago.de.js"></script>
        <script type="text/javascript">
            jQuery.timeago.settings.allowFuture=true;
                $(function() {
                    $('#butnext').button();
                    $("abbr.timeago").timeago(); 
                    $("#ttab tr").click(function() {
                        $(this).find("a")[0].click();
                    }).hover(
                    function () {
                        $(this).toggleClass('ui-state-hover');
                    },
                    function () {
                        $(this).toggleClass('ui-state-hover');
                    }
                    );
                    $('#betabadge').hide().delay(200).show("bounce",{ direction:'left' },"slow").click(function() {
                        window.location = "shiny/"
                    }); 
                });
                
            </script>
    </head>
    <body>

   <div style="float:right;margin-top: 100px; padding: 1em;cursor: pointer"
        id="betabadge"
        class="ui-state-highlight ui-corner-all">
        <span class="ui-icon ui-icon-info"
              style="float: left; margin-right: .3em;"></span>
        zur Beta-Version der neuen Ansicht >>
    </div>
        
        <div class="logo">   
            <img src="/img/logo_rb.jpg" alt="Rugbears Logo" width="369" height="295" style="padding-left: 286px;" />
            <h1>Training-site der Munich Rugbears</h1>
            <p><a href="/next" title="n&auml;chster Termin" id="butnext">n&auml;chster Termin</a></p>
        </div>
        
      
        
<table id="ttab" width='100%' class="ui-widget ui-corner-all">
    <thead class="ui-widget-header"><tr>
            <th width='33%'>Was</th>
            <th width='33%'>Wo</th>
            <th width='33%'>Wann</th>
        </tr></thead>
    <tbody class="ui-widget-content">
<? 
$data =& soon(20);
while($row = $data->fetchRow()) {
   
    print "<tr>";
    $mydate=trainday3($row->tid) . " (<abbr class='timeago' title='$row->when'></abbr>)";
    foreach (array($row->what, $row->where, $mydate) as $str) {
        #,$row->diff
            print "<td><a href='" . getViewUrl() . $row->tid . "'>";

            print $str;
            
            #print "<td>" . trainday3($row->tid) . " (<abbr class='timeago' title='$row->when'></abbr>)</td>";
            print "</td></a>";
        }
    print "</tr>";
    }
 ?>
        </tbody>
</table>
        
    </body>
</html>
<? } ?>
