angular.module("trainSite",["pdate","timeago","jqDialog","ngCookies"]);
function TrainCtrl($scope,$http,$cookies) {
    function addCmt() {
            console.log("Adding Comment " + $scope.curCmt.msg + " from " + $scope.curCmt.usr);
            $http.post("/res/trainings/" + tid + "/comments", $scope.curCmt)
                    .error(function(data) {console.log("Fehler: " + data)})
                    .success(function(data) {console.log("OK!");
                            $scope.comments.unshift(data);
                    });
    }

    $scope.usrname = $cookies.user;
    
    $scope.curCmt = {
            msg: "",
            autor : $scope.usrname,
            tid : tid
    };

   $http.get("/res/trainings/" + tid + "/votes").success(function(data) { $scope.votes=data; });        
   $http.get("/res/trainings/" + tid + "/comments").success(function(data) {$scope.comments=data;});   
   $http.get("/res/trainings/" + tid + "/stats").success(function(data) {$scope.stats=data;});   
   $http.get("/res/trainings/" + tid + "/details")
    .success(function(data) {
         $scope.details=data;
         $scope.details.when = Date.parse($scope.details.when);	            	
     }); 
			
    $scope.dlgState = false;
    $scope.submitDlg = function() {
        addCmt();
        $scope.dlgState=false;
    }
    
}
            
        