angular.module("trainSite",["pdate","timeago","jqDialog","ngCookies","jqAutoComplete","jqButton"]);
var TrainCtrl=function($scope,$http,$cookies,$window) {
    
    function addCmt() {
            console.log("Adding Comment " + $scope.curCmt.msg + " from " + $scope.curCmt.usr);
            $http.post("/res/trainings/" + tid + "/comments", $scope.curCmt)
                    .error(function(data) {console.log("Fehler: " + data)})
                    .success(function(data) {console.log("OK!");
                            $scope.comments.unshift(data);
                    });
    }

    function hasVote() {
        if(!$scope.nameKnown()) return false;
        myVote = $.grep($scope.votes,function(v) { return v.name == $cookies.user});
        
        
        if (myVote.length > 0) {
            console.dir(myVote[0]);
            $scope.curVote = myVote[0];
            return true;
        } else {
            return false;
        }
            
    }
    
    $scope.nameKnown = function() {
        return !($scope.usrname == "" || !$scope.usrname)
    }
    
     $scope.revote = function() {
         console.log("revoting to " + $scope.curVote.vid);
         console.log("Usr is |" + $scope.curVote.name + "| -> empty:" + ($scope.curVote.name == "" || !$scope.curVote.name) );
         if (!$scope.curVote.name || $scope.curVote.name == "") {
             $window.alert("Bitte erst Namen eingeben!");
         } else {
         $scope.usrname =  $scope.curVote.name;   
         $http.post("/res/trainings/" + tid + "/votes", $scope.curVote)
                    .error(function(data) {console.log("Fehler: " + data)})
                    .success(function(data) {console.log("OK!");
                            updateVotes();
                    });
         }
    }
    
    function updateVotes() {
        nocache= Math.random(); //HACK for IE ajax caching
        $http.get("/res/trainings/" + tid + "/votes?nocache=" + nocache).success(function(data) {
            $scope.votes=data; 
            $scope.voted = hasVote();
        });        
    }
    
   //init
   
   //prevent IE insane caching
   $.ajaxSetup({ cache: false });
   
   $scope.usrname = $cookies.user || "";

    $scope.curVote = {
        tid : tid,
        name : $cookies.user,
        vid:0,
        vote:""
    };
    
    $scope.curCmt = {
        msg: "",
        autor : $cookies.user,
        tid : tid
    };

   $http.get("/res/votetypes").success(function(data) {$scope.votetypes=data;}); 
   $http.get("/res/trainings/" + tid + "/comments").success(function(data) {$scope.comments=data;});   
   $http.get("/res/trainings/" + tid + "/stats").success(function(data) {$scope.stats=data;});   
   $http.get("/res/users").success(function(data) {$scope.unames=data;});
   $http.get("/res/trainings/" + tid + "/details")
    .success(function(data) {
         $scope.details=data;
         //$scope.details.when = Date.parse($scope.details.when);	            	
     }); 
    
    updateVotes();


    $scope.dlgState = false;
    $scope.submitDlg = function() {
        addCmt();
        $scope.dlgState=false;
    }
    
};
TrainCtrl.$inject = ['$scope','$http','$cookies','$window'];
            
        