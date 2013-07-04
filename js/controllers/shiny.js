angular.module("shinyTrain",["ngCookies","pdate","ui.bootstrap"])
.config(function ($locationProvider) {
       $locationProvider.html5Mode(true).hashPrefix('!');
})
.factory('UserService',['$cookies',function($cookies) {
    var UserService = {usrname : ''};
    UserService.usrname = $cookies.user || "";
    UserService.signIn = function(newName) {
       $cookies.user= newName;
       UserService.usrname=newName;
   }
   UserService.signOut = function() {
       UserService.usrname="";
       $cookies.usrname="";
   }
   
    UserService.isLoggedIn = function() {
        return !(UserService.usrname == "" || !UserService.usrname);
    }    
    return UserService;
}]) ;
    


var ShinyCtrl=function($scope,$http,$cookies,$log,$location,UserService) {
   $scope.tid = "next";
   if("tid" in $location.search()) { $scope.tid = $location.search().tid};
  
   function hasVote() {
        if(!UserService.isLoggedIn()) return false;
        myVote = $.grep($scope.votes,function(v) { return v.name == UserService.usrname});
        
        if (myVote.length > 0) {
            $scope.myVote = myVote[0];
            return true;
        } else {
            return false;
        }
            
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
         if (!UserService.isLoggedIn()) {
             $window.alert("Bitte erst Namen eingeben!");
         } else {
         $scope.myVote.name=UserService.usrname;
         //angular.extend($scope.myVote,$scope.myVote.name,{"name" : $scope.usrname});
         $http.post("/res/trainings/" + $scope.tid + "/votes", $scope.myVote)
                    .error(function(data) {$log.log("Fehler: " + data)})
                    .success(function(data) {$log.log("OK!");
                            $scope.updateVotes();
                    });
         }
    }
    
   //load data 
   $log.log("loading " + $scope.tid);
   $http.get("/res/votetypes").success(function(data) {$scope.votetypes=data;}); 
   $http.get("/res/users").success(function(data) {$scope.unames=data;});
   $http.get("/res/trainings/" + $scope.tid + "/comments").success(function(data) {$scope.comments=data;});   
   //$http.get("/res/trainings/" + $scope.tid + "/stats").success(function(data) {$scope.stats=data;});   
   $http.get("/res/trainings/" + $scope.tid + "/details").success(function(data) {$scope.details=data;});
   $scope.updateVotes();
   
   
   
   //usage of service, there must be a more elegant way
   $scope.usrname = UserService.usrname;
   $scope.signOut = function() {
        UserService.signOut();
        $scope.usrname = UserService.usrname;
    }
    $scope.signIn = function(nname) {
        UserService.signIn(nname);
        $scope.usrname = UserService.usrname;
    }
    $scope.$watch('usrname', function(nV,oV) {
      $log.log("username changed to " + nV);
      $scope.nameKnown = UserService.isLoggedIn();
      $scope.updateVotes();
   });
   

};
var OverviewCtrl=function($scope,$http,$cookies,$log,UserService) {
   $http.get("/res/trainings/next/details").success(function(data) {$scope.details=data;});
   $http.get("/res/users").success(function(data) {$scope.unames=data;});
    $scope.usrname = UserService.usrname;
    $scope.nameKnown = function() {
        return UserService.isLoggedIn();
    }
    $scope.signOut = function() {
            UserService.signOut();
            $scope.usrname = UserService.usrname;
    }
    $scope.signIn = function(nname) {
            UserService.signIn(nname);
            $scope.usrname = UserService.usrname;
    }
};