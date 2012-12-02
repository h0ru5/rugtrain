<?
require_once '../epiphany/Epi.php';
require_once '../functions.inc.php';
Epi::setPath('base','../epiphany');
Epi::init('api');

getApi()->get('/users.json',array('Users','index'), EpiApi::external);
getApi()->post('/users.json',array('Users','create'), EpiApi::external);
getApi()->get('/trainings.json',array('Trainings','index'), EpiApi::external);
getApi()->post('/trainings.json',array('Trainings','create'), EpiApi::external);
getApi()->post('/trainings/weekdays',array('Trainings','createForWeekDays'), EpiApi::external);
getRoute()->run();

class Trainings {
    public static function create() {
        return array("OK" => "true");
    }
    
    public static function index() {
        $ts =& soon(365);
         return  array("aaData" => $ts->fetchAll());
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
        return array("OK" => "true");
    }
    
    public static function index() {
        return array('Höäürst','Schorch','Koarl','Depp');
    }
}
?>
