angular.module("shinyTrain",["ngCookies","pdate","ui.bootstrap"])
.config(function ($locationProvider) {
       $locationProvider.html5Mode(true).hashPrefix('!');
})
.factory('UserService',['$cookies',function($cookies) {
    var UserService = {
            user:  {name : ''}
    };
    
    UserService.user.name = $cookies.user || "";
    UserService.signIn = function(newName) {
       $cookies.user= newName;
       UserService.user.name=newName;
   }
   UserService.signOut = function() {
       UserService.user.name="";
       $cookies.user="";
   }
   
    UserService.isLoggedIn = function() {
        return !(UserService.user.name == "" || !UserService.user.name);
    }    
    UserService.usrname = function() {return UserService.user.name}
    
    return UserService;
}]) ;
    


var ShinyCtrl=function($scope,$http,$cookies,$log,$location,UserService) {
   $scope.tid = "next";
   if("tid" in $location.search()) { $scope.tid = $location.search().tid};
  
   function hasVote() {
        if(!UserService.isLoggedIn()) return false;
        myVote = $.grep($scope.votes,function(v) { return v.name == UserService.user.name});
        
        if (myVote.length > 0) {
            $scope.myVote = myVote[0];
            return true;
        } else {
            return false;
        }
            
    }
    
     $scope.addCmt = function() {
         var newComment = {"autor" : UserService.user.name, "msg" : $scope.curCmt };
         if (!UserService.isLoggedIn()) {
             $scope.addAlert("Bitte erst Namen eingeben","warn");
         } else {
            $log.log("Adding Comment " + $scope.curCmt + " from " + UserService.user.name);
            $http.post("/res/trainings/" + $scope.tid + "/comments", newComment)
                    .error(function(data) {
                        $log.log("Fehler: " + data);
                        $scope.addAlert("Fehler beim Kommentar eintragen!");
                    })
                    .success(function(data) {
                         $log.log("OK!");
                         $scope.addAlert("Kommentar eingetragen!","success");
                         $scope.comments.unshift(data);
                    });
         }
    }
   
   $scope.updateVotes = function() {
        var nocache= Math.random(); //HACK for IE ajax caching
        $http.get("/res/trainings/" + $scope.tid + "/votes?nocache=" + nocache).success(function(data) {
            $scope.votes=data; 
            $scope.voted = hasVote();
        });
        $http.get("/res/trainings/" + $scope.tid + "/details").success(function(data) {$scope.details=data;});
    }
    
    $scope.revote = function() {
         $log.log("revoting to " + $scope.myVote.vid);
         $log.log("Usr is |" + UserService.user.name + "| -> empty:" + (UserService.user.name == "" || !UserService.user.name) );
         if (!UserService.isLoggedIn()) {
             $scope.addAlert("Bitte erst Namen eingeben","warn");
         } else {
         $scope.myVote.name=UserService.user.name;
         //angular.extend($scope.myVote,$scope.myVote.name,{"name" : $scope.usrname});
         $http.post("/res/trainings/" + $scope.tid + "/votes", $scope.myVote)
                    .error(function(data) {
                        $log.log("Fehler: " + data);
                        $scope.addAlert("Fehler beim Abstimmung eintragen!");
                    })
                    .success(function(data) {
                        $log.log("OK!");
                        $scope.addAlert("Abstimmung eingetragen!","success");
                        $scope.updateVotes();
                    });
         }
    }
    
    //Alert handling
   $scope.alerts = [];

    $scope.addAlert = function(msg,type) {
        if(!type || type=="") 
            type='error';
        $scope.alerts.push({
            "msg" : msg,
            "type" : type
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    
   //load data 
   $log.log("loading " + $scope.tid);
   $http.get("/res/votetypes").success(function(data) {$scope.votetypes=data;}); 
   $http.get("/res/users").success(function(data) {$scope.unames=data;});
   $http.get("/res/trainings/" + $scope.tid + "/comments").success(function(data) {$scope.comments=data;});   
   //$http.get("/res/trainings/" + $scope.tid + "/stats").success(function(data) {$scope.stats=data;});   
   $http.get("/res/trainings/" + $scope.tid + "/details").success(function(data) {$scope.details=data;});
   $scope.updateVotes();
   
   
   
   //expose user service
   $scope.user = UserService.user;
   $scope.signOut = UserService.signOut;
   $scope.signIn =      UserService.signIn;
   $scope.$watch('user.name', function(nV,oV) {
      if(nV)$log.log("username changed to " + nV.name);
      $scope.nameKnown = UserService.isLoggedIn();
      $scope.updateVotes();
   });
   

};
var OverviewCtrl=function($scope,$http,$cookies,$log,UserService) {
   $http.get("/res/trainings/next/details").success(function(data) {$scope.details=data;});
   $http.get("/res/users").success(function(data) {$scope.unames=data;});
   
   //expose user service
   $scope.user = UserService.user;
   $scope.signOut = UserService.signOut;
   $scope.signIn =      UserService.signIn;
   $scope.$watch('user.name', function(nV,oV) {
      if(nV)$log.log("username changed to " + nV.name);
      $scope.nameKnown = UserService.isLoggedIn();
   });
   
};