<?php
require_once '../functions.inc.php';
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Trainings
 *
 * @author h0ru5
 */
class Trainings {
    public static function votes($tid) {
        $sql = "SELECT t.Name AS name, v.text AS vote, t.vote AS vid, t.time AS time FROM
	           t2 AS t JOIN votes AS v ON t.Vote = v.id 
                        WHERE t.tid=$tid
			   ORDER BY vid,time";
	$data = & doQuery($sql);        
        return $data->fetchAll();
        
    }
    public static function comments($tid) {
        $data = & doQuery("SELECT id,autor,time,msg FROM kommentare WHERE tid='$tid' ORDER BY time DESC");
        return $data->fetchAll();
    }
    
    public static function addComment($tid) {
        $autor = escapeSQL($_POST['autor']);
	$msg= escapeSQL($_POST['msg']);
        $tid= escapeSQL($_POST['tid']);
	$now = date( 'Y-m-d H:i:s');
	setcookie("user",$name,mktime(0, 0, 0, date("m"),   date("d"),   date("Y")+1));
	doQuery("INSERT INTO kommentare (tid,autor,msg,time) VALUES ('$tid','$autor','$msg','$now')");
        return array("OK"=>TRUE);
    }
    
    public static function addVote($tid) {
        $table = "t2";
	$name = escapeSQL($_GET['name']);
	$vote = escapeSQL($_GET['vote']);
	$now = date('Y-m-d H:i:s');
	
	setcookie("user",$name,mktime(0, 0, 0, date("m"),   date("d"),   date("Y")+1));
	doQuery("REPLACE INTO $table (tid,Name,Vote,time) VALUES ('$tid','$name',$vote,'$now')");   
        
        return array("OK"=>TRUE);
    }
    
     public static function stats($tid) {
	$data = & doQuery("SELECT v.id AS vote, COUNT(v.id) AS count FROM t2 AS t JOIN votes AS v ON t.vote = v.id WHERE t.tid=$tid GROUP BY v.id ORDER BY v.id");
        return $data->fetchAll();
     }
    
}

?>