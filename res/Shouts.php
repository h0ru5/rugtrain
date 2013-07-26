<?php
require_once '../functions.inc.php';
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Users
 *m
 * @author mail_000
 */
class Shouts {
   public static function last($n=10) {
       $ns=escapeSQL($n);
       $data = & doQuery("SELECT autor,msg,zeit FROM shouts ORDER BY zeit DESC LIMIT " . $ns);
       return $data->fetchAll();
   }
   
   public static function add() {
       $input = jsonPostData();
       $now = date( 'Y-m-d H:i:s');
	$res =&doQuery("INSERT INTO shouts (autor,msg,zeit) VALUES ('$input->autor','$input->msg','$now')");
	if(PEAR::isError($res)) {
            return array("OK"=>FALSE);
        } else {
            return array("OK"=>TRUE);
        }
   }
}

?>
