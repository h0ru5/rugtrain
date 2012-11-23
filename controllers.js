         function TrainCtrl($scope,$http) {
            $http.get("/res/trainings/" + tid + "/votes").success(function(data) {$scope.votes=data;});        
            $http.get("/res/trainings/" + tid + "/comments").success(function(data) {$scope.comments=data;});   
         }
            
        