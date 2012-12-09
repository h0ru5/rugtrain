﻿angular.module("adminPanel",["myTable","ngResource","jqDialog","addButton"]);

function actButtons(_mData) {
      this.aTargets=[-1];
      this.mData=_mData;
      this.fnCreatedCell=function (nTd, sData, oData, iRow, iCol) {
		butDel = $("<button>delete</button>").button({
        	    text:false,
	            icons: {
	                primary: "ui-icon-trash"
	            }
	        })
	        .on("click",function() {
                            myscope = angular.element(nTd).scope().doDel(oData);
        	});


                butEdit = $("<button>edit</button>").button({
        	    text:false,
	            icons: {
	                primary: "ui-icon-wrench"
	            }
	        })
	        .on("click",function() {
                            myscope = angular.element(nTd).scope().doEdit(oData);
        	}); 

        	$(nTd).empty().prepend(butDel).prepend(butEdit);
      }        
}


function userAdmin($scope,$window,$resource) {
	var User = $resource('/admin/users/:userId',{userId:'@id'});
    
        $scope.userColumnDefs = [ 
            { "mData": "name", "aTargets":[0] },
            { "mData": "email", "aTargets":[1] },
            new actButtons("id")
        ]; 
        
        

        $scope.showDlg = function() {
            $scope.curUsr = new User();
            $scope.dlgState=true;
        }
        
        $scope.hideDlg = function() {
            $scope.dlgState=false;
            $scope.$digest();
        }
        
        
        $scope.refresh =function() {
            User.query(function(data) {$scope.users=data; });
            $scope.$apply();
        }
        
        $scope.doDel = function(usr) {
            if($window.confirm(usr.name + " wirklich löschen?")) {            
                User.remove({userId:usr.id});
            }
            $scope.refresh();
        }
        
        $scope.doEdit = function(usr) {
            $scope.curUsr = User.get({userId:usr.id});
            $scope.dlgState=true;
        }
        
        $scope.submitDialog = function() {
            $scope.curUsr.$save();
            $scope.dlgState=false;
            $scope.refresh();
        }
        
        //initialization code
        $scope.refresh();
        $scope.dlgState = false;
        $scope.curUsr=new User();
        
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
