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

getApi()->get('/trainings.json',array('Trainings','index'), EpiApi::external);
getApi()->post('/trainings.json',array('Trainings','create'), EpiApi::external);
getApi()->post('/trainings/weekdays',array('Trainings','createForWeekDays'), EpiApi::external);
getApi()->get('/comments.json',array('Comments','index'), EpiApi::external);
getApi()->post('/comments.json',array('Comments','create'), EpiApi::external);
getRoute()->run();

class Trainings {
    public static function create() {
        return $_POST;
    }
    
    public static function index() {
        $ts =& doQuery("SELECT `tid`,`when`,`where`,`what` FROM trainings WHERE `when` > CURDATE() ORDER BY `when`");
        return   $ts->fetchAll();
    }
      
    public static function createForWeekDays() {
        $weekday=  escapeSQL($_POST['weekday']);
        $where=  escapeSQL($_POST['where']);
        $what=  escapeSQL($_POST['what']);
        
        setlocale(LC_ALL,'de_DE','de');
        $day =& new DateTime();
        $day->setTime(18, 30, 00);

        $i=0;
        $j=0;
	while($i<=365) {
                if($day->format('w')==$weekday) {
                    self::createTrain($day,$where,$what);
                    $j++;
                }
		$day->modify("+1 day");
                $i++;
	}
        return array("count" => $j);
    }
    
    private static function createTrain($day,$where,$what) {
        $mysqldate=$day->format("Y-m-d H:i:s");
        $sql="INSERT INTO trainings (`when`,`where`,`what`) VALUES ('$mysqldate','$where','$what')";
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
    public static function create() {
        return array("OK" => "true");
    }
    
    public static function index()  {
     $data = & doQuery("SELECT tid,autor,time,msg FROM kommentare ORDER BY time DESC");
     return $data->fetchAll();
   }
}
?>
