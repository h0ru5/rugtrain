angular.module("adminPanel",["myTable","ngResource"]);

function delBut(url,data) {
      this.aTargets=[-1];
      this.mData="id";
      this.fnCreatedCell=function (nTd, sData, oData, iRow, iCol) {
			butDel = $("<button>x</button>").button({
        	    text:false,
	            icons: {
	                primary: "ui-icon-trash",
	            }
	        })
	        .on("click",function() {
        		alert("calling " + url +" with " + data +"=" + sData);
        	});

        	$(nTd).empty().prepend(butDel);
      }        
}


function userAdmin($scope,$http,$resource) {
	$scope.userColumnDefs = [ 
            { "mData": "name", "aTargets":[0] },
            { "mData": "email", "aTargets":[1] },
            new delBut("myurl","id")
        ]; 

	$http.get("/admin/users.json").success(function(data) {$scope.users=data;});   
        
        var User = $resource('/admin/users/:userId',{userId:'@id'});
        
        $scope.createUser = function() {
            $scope.msg = "Called!";
            me = new User({name:"Honk",email:"wupp@wapp.dapp"});
            me.$save();
        }
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
