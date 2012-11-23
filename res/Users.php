<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Users
 *
 * @author mail_000
 */
class Users {
   public static function names() {
       $data = & doQuery("SELECT name FROM mailliste ORDER BY name ASC");
       foreach($data->fetchAll() as $usr) {
           $res[] = $usr->name;
       }
       return $res;
   }
}

?>
