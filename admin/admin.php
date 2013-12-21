<?
require_once '../epiphany/Epi.php';
require_once '../functions.inc.php';
Epi::setPath('base','../epiphany');
Epi::init('api');

getApi()->get('/users',array('Users','index'), EpiApi::external);
getApi()->get('/users/([^/]+)',array('Users','get'), EpiApi::external);
getApi()->post('/users/([^/]+)',array('Users','update'), EpiApi::external);
getApi()->delete('/users/([^/]+)',array('Users','delete'), EpiApi::external);
getApi()->post('/users',array('Users','create'), EpiApi::external);

getApi()->get('/trainings',array('Trainings','index'), EpiApi::external);
getApi()->post('/trainings',array('Trainings','create'), EpiApi::external);
getApi()->post('/trainings/weekdays',array('Trainings','createForWeekDays'), EpiApi::external);
getApi()->get('/trainings/([^/]+)',array('Trainings','get'), EpiApi::external);
getApi()->post('/trainings/([^/]+)',array('trainings','update'), EpiApi::external);
getApi()->delete('/trainings/([^/]+)',array('Trainings','delete'), EpiApi::external);


getApi()->get('/comments',array('Comments','index'), EpiApi::external);
getApi()->post('/comments',array('Comments','create'), EpiApi::external);
getApi()->get('/comments/([^/]+)',array('Comments','get'), EpiApi::external);
getApi()->post('/comments/([^/]+)',array('Comments','update'), EpiApi::external);
getApi()->delete('/comments/([^/]+)',array('Comments','delete'), EpiApi::external);

getRoute()->run();

class Trainings {
    public static function create() {
        $data = & jsonPostData();
        return self::createTrain($data->when,$data->end,$data->where,$data->what,$data->type);
    }
    
    public static function index() {
        $ts =& doQuery("SELECT `tid`,`when`,`where`,`what`,`start`,`end`,`type` FROM trainings WHERE `start` > CURDATE() ORDER BY `start`");
        return $ts->fetchAll();
    }
    
    public static function get($tid) {
        $tid = escapeSQL($tid);
        $ts =& doQuery("SELECT `tid`,`when`,`where`,`what`,`start`,`end`,`type` FROM trainings WHERE `tid` = $tid");
        return $ts->fetchRow();
    }

    public static function update($tid) {
        $data =& jsonPostData();
        #$mysqldate=$data->when->format("Y-m-d H:i:s");
        $ts =& doQuery("REPLACE  INTO trainings (`tid`,`when`,`where`,`what`,`start`,`end`,`type`) VALUES ($tid,'$data->when','$data->where','$data->what','$data->when','$data->end','$data->type') ");
        return $ts->fetchAll();
    }
    
    public static function delete($tid) {
        $tid = escapeSQL($tid);
        $ts =& doQuery("DELETE FROM trainings WHERE `tid` = $tid");
        return $ts->fetchRow();
    }
    
    public static function createForWeekDays() {
        $data =& jsonPostData();
        #$weekday=  escapeSQL($_POST['weekday']);
        $weekday=  escapeSQL($data->weekday);
        $where=  escapeSQL($data->where);
        #$where=  escapeSQL($_POST['where']);
        $what=  escapeSQL($data->what);
        #$what=  escapeSQL($_POST['what']);
        
        setlocale(LC_ALL,'de_DE','de');
        $start =& new DateTime();
        $start->setTime(18, 30, 00);
        
        $end =& new DateTime();
        $end->setTime(21, 00, 00);
        

        $i=0;
        $j=0;
	while($i<=365) {
                if($start->format('w')==$weekday) {
                    self::createTrain($start->format('Y-m-d H:i:s'),$end->format('Y-m-d H:i:s'),$where,$what);
                    $j++;
                }
		$start->modify("+1 day");
                $end->modify("+1 day");
                $i++;
	}
        return array("count" => $j);
    }
    
    private static function createTrain($start,$end,$where,$what,$type='TRAINING') {
        #$mysqldate=$day->format("Y-m-d H:i:s");
        $sql="INSERT INTO trainings (`when`,`start`,`end`,`where`,`what`,`type`) VALUES ('$start','$start','$end','$where','$what','$type')";
        $res = doQuery($sql)->fetchAll();
    }
    
}

class Users {
    
    public static function create() {
         $data =& jsonPostData();
         $sql="INSERT INTO mailliste (`name`,`email`) VALUES ('$data->name','$data->email')";
         return doQuery($sql)->fetchAll();
    }
        
    public static function update() {
         $data =& jsonPostData();
         $sql="REPLACE INTO mailliste (`id`,`name`,`email`) VALUES ($data->id,'$data->name','$data->email')";
         return doQuery($sql)->fetchAll();
    }
    
    public static function delete($id) {
        $uid = escapeSQL($id);
       $data = & doQuery("DELETE FROM mailliste WHERE id=$uid");
       if(PEAR::isError($data)) 
        return array("OK" => "false");
       else
           return array("OK" => "true");
    }

    public static function get($id) {
        $uid = escapeSQL($id);
        $data = & doQuery("SELECT id,name,email FROM mailliste WHERE id=$uid ORDER BY name");
        return $data->fetchRow();
    }
    
    public static function index()  {
    	$data = & doQuery("SELECT id,name,email FROM mailliste ORDER BY name");
		return $data->fetchAll();
    }
}

class Comments {
    
     public static function get($id) {
        $uid = escapeSQL($id);
        $data = & doQuery("SELECT id,tid,autor,time,msg FROM kommentare WHERE id=$uid");
        return $data->fetchRow();
     }
    
     public static function update($id) {
        $uid = escapeSQL($id); 
        $data =& jsonPostData();
        $data = & doQuery("REPLACE INTO kommentare (id,tid,autor,time,msg) VALUES ($uid,$data->tid,'$data->autor','$data->time','$data->msg')");
        return $data->fetchRow();
     }
     
     public static function delete($id) {
        $uid = escapeSQL($id);
        $data = & doQuery("DELETE FROM kommentare WHERE id=$uid");
        return array("OK" => !PEAR::isError($data));
     }
    public static function create() {
        return array("OK" => "true");
    }
    
    public static function index()  {
     $data = & doQuery("SELECT id,tid,autor,time,msg FROM kommentare ORDER BY time DESC");
     return $data->fetchAll();
   }
}
?>
