function userAdmin($scope,$http) {
	$scope.userColumnDefs = [ 
            { "mDataProp": "name", "aTargets":[0] },
            { "mDataProp": "email", "aTargets":[1] }
        ]; 

	$http.get("/admin/users.json").success(function(data) {$scope.users=data;});   
}
function eventAdmin($scope,$http) {
	$scope.eventColumnDefs = [ 
            { "mDataProp": "what", "aTargets":[0] },
            { "mDataProp": "where", "aTargets":[1] },
            { "mDataProp": "when", "aTargets":[2] }
            
        ]; 

	$http.get("/admin/trainings.json").success(function(data) {$scope.events=data;});   
}
function commentAdmin($scope,$http) {
	$scope.commentColumnDefs = [ 
            { "mDataProp": "tid", "aTargets":[0] },
            { "mDataProp": "autor", "aTargets":[1] },
            { "mDataProp": "time", "aTargets":[2] },
            { "mDataProp": "msg", "aTargets":[3] }
            
        ]; 

	$http.get("/admin/comments.json").success(function(data) {$scope.comments=data;});   
}
