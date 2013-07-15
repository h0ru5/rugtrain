<?php
require_once '../functions.inc.php';
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Trainings
 * @author h0ru5
 */
class Trainings {
        
    private static function nextOrNum($p) {
        if($p=="next")
            return nextTid ();
        else 
            return escapeSQL($p);
    }

    public static function soon($n=10) {
        $data =& soon($n);
        return $data->fetchAll();
    }
    
    public static function votetypes() {
            $votes = & doQuery("SELECT id,text FROM votes");
            return $votes->fetchAll();
        }

	public static function details($ptid) {
          $tid=  self::nextOrNum($ptid);
            $data = & doQuery("SELECT `tid`,`what`,`where`,`when`,`start`,`end` FROM trainings WHERE tid=$tid");
            $res = $data->fetchRow();
            $res->stats = self::stats($tid);
            return $res;
	}

    public static function votes($ptid) {
        $tid=  self::nextOrNum($ptid);
        $sql = "SELECT t.Name AS name, v.text AS vote, t.vote AS vid, t.time AS time FROM
	           t2 AS t JOIN votes AS v ON t.Vote = v.id 
                        WHERE t.tid=$tid
			   ORDER BY vid,time";
	$data = & doQuery($sql);        
        return $data->fetchAll();
        
    }
    public static function comments($ptid) {
        $tid=  self::nextOrNum($ptid);
        $data = & doQuery("SELECT id,autor,time,msg FROM kommentare WHERE tid='$tid' ORDER BY time DESC");
        return $data->fetchAll();
    }
    
    public static function addComment($tid) {
    $input = jsonPostData();
    
        $stid=  self::nextOrNum($tid);
#        $autor = escapeSQL($_POST['autor']);
#	$msg= escapeSQL($_POST['msg']);
#        $tid= escapeSQL($_POST['tid']);
        setUsrCookie($input->autor);
        $now = date( 'Y-m-d H:i:s');
	$res =&doQuery("INSERT INTO kommentare (tid,autor,msg,time) VALUES ('$stid','$input->autor','$input->msg','$now')");
		$res = $input;
		$res->time = $now;
        return $res;
    }
    
    public static function addVote($tid) {
        $table = "t2";
        $stid=  self::nextOrNum($tid);
#	$name = escapeSQL($_GET['name']);
#	$vote = escapeSQL($_GET['vote']);
	$now = date('Y-m-d H:i:s');

        $input = jsonPostData();
        setUsrCookie($input->name);
	$res =&doQuery("REPLACE INTO $table (tid,Name,Vote,time) VALUES ('$stid','$input->name',$input->vid,'$now')");   
        if(PEAR::isError($res)) {
            return array("OK"=>FALSE);
        } else {
            return array("OK"=>TRUE);
        }
    }
    
     public static function stats($tid) {
		$data = & doQuery("SELECT v.id,v.text AS vote, COUNT(v.id) AS count 
			FROM t2 AS t JOIN votes AS v ON t.vote = v.id
			WHERE t.tid=$tid
			GROUP BY v.id ORDER BY v.id");
        return $data->fetchAll();
     }
    
}

?>
