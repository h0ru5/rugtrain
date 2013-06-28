angular.module("shinyTrain",["ngCookies","pdate","ui.bootstrap"])
.config(function ($locationProvider) {
       $locationProvider.html5Mode(true).hashPrefix('!');
});

var ShinyCtrl=function($scope,$http,$cookies,$log,$location) {
   $scope.usrname = $cookies.user || "";
   
   $scope.tid = "next";
   if("tid" in $location.search()) { $scope.tid = $location.search().tid};
  
   function hasVote() {
        if(!$scope.nameKnown()) return false;
        myVote = $.grep($scope.votes,function(v) { return v.name == $scope.usrname});
        
        if (myVote.length > 0) {
            $scope.myVote = myVote[0];
            return true;
        } else {
            return false;
        }
            
    }
   
   $scope.nameKnown = function() {
        return !($scope.usrname == "" || !$scope.usrname)
    }

   $scope.updateVotes = function() {
        nocache= Math.random(); //HACK for IE ajax caching
        $http.get("/res/trainings/" + $scope.tid + "/votes?nocache=" + nocache).success(function(data) {
            $scope.votes=data; 
            $scope.voted = hasVote();
        });
        $http.get("/res/trainings/" + $scope.tid + "/details").success(function(data) {$scope.details=data;});
    }
    $scope.revote = function() {
         $log.log("revoting to " + $scope.myVote.vid);
         $log.log("Usr is |" + $scope.usrname + "| -> empty:" + ($scope.usrname == "" || !$scope.usrname) );
         if (!$scope.usrname || $scope.usrname == "") {
             $window.alert("Bitte erst Namen eingeben!");
         } else {
         $scope.myVote.name=$scope.usrname;
         //angular.extend($scope.myVote,$scope.myVote.name,{"name" : $scope.usrname});
         $http.post("/res/trainings/" + $scope.tid + "/votes", $scope.myVote)
                    .error(function(data) {$log.log("Fehler: " + data)})
                    .success(function(data) {$log.log("OK!");
                            $scope.updateVotes();
                    });
         }
    }
    
    
   $log.log("loading " + $scope.tid);
   $http.get("/res/votetypes").success(function(data) {$scope.votetypes=data;}); 
   $http.get("/res/users").success(function(data) {$scope.unames=data;});
   $http.get("/res/trainings/" + $scope.tid + "/comments").success(function(data) {$scope.comments=data;});   
   //$http.get("/res/trainings/" + $scope.tid + "/stats").success(function(data) {$scope.stats=data;});   
   $http.get("/res/trainings/" + $scope.tid + "/details").success(function(data) {$scope.details=data;});
   $scope.updateVotes();
};
