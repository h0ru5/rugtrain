<?
require_once "PEAR/MDB2.php";
require_once "const.inc.php";

function doQuery($sql) {
        global $dsn;
		$hdb =& MDB2::factory($dsn);
		if(PEAR::isError($hdb)) {
            die("Datenbankfehler: " . $hdb->getMessage() . '-' . $hdb->getUserinfo());
			ob_end_flush();
         }
		 
		 $hdb->setFetchMode(MDB2_FETCHMODE_OBJECT);
                 $hdb->setCharset('UTF8'); 
                 #$hdb->query("SET NAMES UTF8");
                 
		#$sql=str_replace("\n","",$sql);
		 $res = $hdb->query($sql);
		
		 if(PEAR::isError($res)) {
		 	die("Datenbankzugriffsfehler: " . $res->getMessage() . "<br>" . $sql);
		 }
		 
		 return $res;
}

function escapeSQL($sql) {
        global $dsn;
		
		$hdb = & MDB2::connect($dsn);
		 if(PEAR::isError($hdb)) {
            die("Datenbankfehler: " . $hdb->getMessage() . '-' . $hdb->getUserinfo());
         }

		return $hdb->escape($sql);
}

function jsonPostData() {
    return json_decode(file_get_contents('php://input'));
}

function tableview($tid) {
    global $table;
	#$sql = "SELECT t.Name AS name, v.text AS vote, t.id AS id, t.vote AS vid, t.time AS time FROM
	#           $table AS t JOIN votes AS v ON t.Vote = v.id 
	#		   ORDER BY vid";
	$sql = "SELECT t.Name AS name, v.text AS vote, t.vote AS vid, t.time AS time FROM
	           $table AS t JOIN votes AS v ON t.Vote = v.id 
                        WHERE t.tid=$tid
			   ORDER BY vid,time";
	setlocale(LC_ALL,'de_DE','de');
	$data = & doQuery($sql);
    print "<table class='erg'>";
	print "<tr><th>Name</th><th>Vote</th><th>Zeit</th></tr>";
	while($row = & $data->fetchRow()) {
		print "<tr><td>$row->name</td>";
		print "<td class='v$row->vid'>$row->vote</td>";
		print "<td class='vdate' align='right'>";
		print(strftime("%a %H:%M",strtotime($row->time)));
		#print(date("d.n.y H:i",strtotime($row->time)));
		#<!-- a href='$PHP_SELF?action=del&id=$row->id'>l&ouml;schen</a -->
		print "</td></tr>";
	}
	print "</table>";
}

function nextTid() {
    return soon(1)->fetchRow()->tid;
}

function soon($limit=1) {
    $sql = "SELECT `tid`,`what`,`where`, DATEDIFF(`when`,CURDATE()) AS diff  FROM trainings WHERE `when` > CURDATE() ORDER BY diff ASC LIMIT $limit";
    $data = & doQuery($sql);
    return $data;
}

function add($tid) {
	global $table;
	$name = escapeSQL($_GET['name']);
	$vote = escapeSQL($_GET['vote']);
	$now = date('Y-m-d H:i:s');
	
	setcookie("user",$name,mktime(0, 0, 0, date("m"),   date("d"),   date("Y")+1));
	
	doQuery("REPLACE INTO $table (tid,Name,Vote,time) VALUES ('$tid','$name',$vote,'$now')");
	
	print "<p class='feedback'>Eintrag eingef&uuml;gt</p>";
}

function del() {
	global $table;
	$id = escapeSQL($_GET['id']);
	
	#doQuery("DELETE FROM $table WHERE id='$id'");
	
	print "<p class='feedback'>Eintrag l&ouml;schen derzeit nicht implementiert</p>";
}

function getViewUrl() {
    $pth=dirname($_SERVER['SCRIPT_NAME']);
    if($pth!='/') {
        $pth = $pth . "/";
    }
    return $pth;
}

function getControllerUrl() {
    #dirname($_SERVER['SCRIPT_NAME']). "/" .
    return dirname($_SERVER['SCRIPT_NAME']) . "index.php";
}

function redirect($tid=NULL) {
	
        $urlx=getViewUrl();
        if($tid)
             $url = $urlx . "$tid";
        ?>
	<p>Weiterleitung erfolgt...</p>
	<script type="text/javascript">
		window.setTimeout("gohome();",500);
	       
		function gohome() {
		  window.location.href="<?= $url  ?>";
		}
	</script>
	<?
		ob_end_flush();
}

function getCookieName() {
	$name = $_COOKIE['user'];
	if($name == NULL) $name='';
	return $name;
}


function form($tid) {
	$name = getCookieName();
	?>
	 <p></p>
         <form action="<?= getViewUrl() . $tid . "/add" ?>" method="get">
	  <input type="hidden" value="add" name="action" />
          <input type="hidden" value="<?= $tid ?>" name="tid" />
	  <table>
	  <tr>
	  <td>Name:<br><input type="text" name="name" value="<?= $name ?>"/><br/><br />
	  <input type="submit" value="eintragen" />
	  </td>
	  <td>
	<?
    $votes = & doQuery("SELECT id,text FROM votes");
	while($data = & $votes->fetchRow()) {
		print "<p><input type='radio' name='vote' value='$data->id'>$data->text";
	}
	?>
	</td>
	</tr>
	</table>
	
	</form>
	<?
}

function stats($tid) {
	global $table;
	$data = & doQuery("SELECT v.id AS vote, COUNT(v.id) AS count FROM $table AS t JOIN votes AS v ON t.vote = v.id WHERE t.tid=$tid GROUP BY v.id ORDER BY v.id");
	while($row = & $data->fetchRow()) {
		switch($row->vote) {
			case 1:
				$ret .= "$row->count Spieler";
				break;
			case 2:
				$ret .= "$row->count Helfer";
				break;
			case 3:
				$ret .= "$row->count Absage(n)";
				break;
		}
		$ret .= "\n";
	}
	return $ret;
}

function clear_old() {
	global $table;
	doQuery("DROP TABLE IF EXISTS `trainingsumfrage`;");
	doQuery("DROP TABLE IF EXISTS `kommentare`;");
	
	$umfrage = "
	CREATE TABLE `trainingsumfrage` (
		  `id` int(10) unsigned NOT NULL auto_increment,
		  `Name` varchar(255) character set latin1 collate latin1_german1_ci NOT NULL default '',
		  `Vote` tinyint(4) NOT NULL default '0',
		  `time` timestamp NOT NULL default '0000-00-00 00:00:00',
		  PRIMARY KEY  (`id`),
		  KEY `Vote` (`Vote`),
		  KEY `time` (`time`)
	) ENGINE=MyISAM DEFAULT CHARSET=latin1;";
	$comments = "
	CREATE TABLE `kommentare` (
	  `id` int(11) NOT NULL auto_increment,
	  `autor` varchar(255) collate latin1_german1_ci NOT NULL default '',
	  `msg` text collate latin1_german1_ci NOT NULL,
	  `time` timestamp NOT NULL default '0000-00-00 00:00:00',
	  PRIMARY KEY  (`id`),
	  KEY `time` (`time`),
	  FULLTEXT KEY `msg` (`msg`)
	) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci;";
	#doQuery($umfrage);
	#doQuery($comments);
	#print "<p class='feedback'>Umfrage gel&ouml;scht</p>";
}

function clear($tid) {
        doQuery("DELETE FROM `t2` WHERE tid=$tid;");
        doQuery("DELETE FROM `kommentare` WHERE tid=$tid;");
        #global $table;
	#doQuery("TRUNCATE TABLE `t2`;");
        #doQuery("TRUNCATE TABLE `kommentare`;");
	/*doQuery("DROP TABLE IF EXISTS `kommentare`;");
	
	$umfrage = "
	CREATE TABLE t2 (
	  Name varchar(255) character set latin1 collate latin1_german1_ci NOT NULL default 'unbekannt',
  Vote tinyint(4) NOT NULL default '0',
	  `time` timestamp NULL default CURRENT_TIMESTAMP,
	  PRIMARY KEY  (Name),
	  KEY Vote (Vote),
	  KEY `time` (`time`)
	) ENGINE=MyISAM DEFAULT CHARSET=latin1;";
	$comments = "
	CREATE TABLE `kommentare` (
	  `id` int(11) NOT NULL auto_increment,
	  `autor` varchar(255) collate latin1_german1_ci NOT NULL default '',
	  `msg` text collate latin1_german1_ci NOT NULL,
	  `time` timestamp NOT NULL default '0000-00-00 00:00:00',
	  PRIMARY KEY  (`id`),
	  KEY `time` (`time`),
	  FULLTEXT KEY `msg` (`msg`)
	) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci;";
	#doQuery($umfrage);
	doQuery($comments); */
	print "<p class='feedback'>Umfrage gel&ouml;scht</p>";
}


function comments($tid) {
	$data = & doQuery("SELECT * FROM kommentare WHERE tid=$tid ORDER BY id DESC");
	setlocale(LC_ALL,'de_DE','de');
	print "<div class='comments'>";
	while($row = & $data->fetchRow()) {
		print "<p><b>$row->autor</b>&nbsp;(";
		print(strftime("%a %H:%M",strtotime($row->time)));
		print "):<br>" . nl2br($row->msg) . "</p>";
	}
	print "</div>";
}

function addcmt() {
	$autor = escapeSQL($_POST['autor']);
	$msg= escapeSQL($_POST['msg']);
        $tid= escapeSQL($_POST['tid']);
	$now = date( 'Y-m-d H:i:s');
	setcookie("user",$name,mktime(0, 0, 0, date("m"),   date("d"),   date("Y")+1));
	doQuery("INSERT INTO kommentare (tid,autor,msg,time) VALUES ('$tid','$autor','$msg','$now')");
	print "<p class='feedback'>Eintrag eingef&uuml;gt</p>";
}

function trainday() {
	$day = time();
	setlocale(LC_ALL,'de_DE','de');
	$dtarr = getdate($day);
	$weekday = $dtarr['wday'];
	if($weekday < 1) $trainday = strtotime("+ " .(1-$weekday) . " day",$day);
	if($weekday > 1 && $weekday <= 4) $trainday = strtotime("+" .(4-$weekday) . " days",$day);
	if($weekday > 4) $trainday = strtotime("+ " . (8-$weekday) . "days",$day);
	return strftime("%a %d.%m",$trainday);
}

function trainday2() {
	setlocale(LC_ALL,'de_DE','de');
	$days = array(1,4);
	$trainday = time();
	while(!in_array(date('w',$trainday),$days)) {
		$trainday = strtotime("+ 1 day",$trainday);
	}
	return strftime("%a %d.%m",$trainday);
}

function trainday3($tid) {
	setlocale(LC_ALL,'de_DE','de');
        $sql ="SELECT `when` FROM trainings WHERE tid=$tid LIMIT 1";
        $data=&doQuery($sql);
        $row = & $data->fetchRow();
        return strftime("%a %d.%m",  strtotime($row->when));
}
?>
