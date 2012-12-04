function UserAdmin($scope,$http) {
	$scope.columnDefs = [ 
            { "mDataProp": "name", "aTargets":[0] },
            { "mDataProp": "email", "aTargets":[1] }
        ]; 

	$http.get("/admin/users.json").success(function(data) {$scope.users=data;});   
}
