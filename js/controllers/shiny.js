angular.module("shinyTrain",["ngCookies","pdate"])
.config(function ($locationProvider) {
       $locationProvider.html5Mode(true).hashPrefix('!');
});

var ShinyCtrl=function($scope,$http,$cookies,$log,$location) {
     $scope.usrname = $cookies.user || "";
     
  
     
      $scope.tid = "next";
      if("tid" in $location.search()) { $scope.tid = $location.search().tid};
      
   $log.log("loading " + $scope.tid);
   $http.get("/res/votetypes").success(function(data) {$scope.votetypes=data;}); 
   $http.get("/res/users").success(function(data) {$scope.unames=data;});
   $http.get("/res/trainings/" + $scope.tid + "/comments").success(function(data) {$scope.comments=data;});   
   //$http.get("/res/trainings/" + $scope.tid + "/stats").success(function(data) {$scope.stats=data;});   
   $http.get("/res/trainings/" + $scope.tid + "/details")
    .success(function(data) {
         $scope.details=data;
         //$scope.details.when = Date.parse($scope.details.when);	            	
     });
};
