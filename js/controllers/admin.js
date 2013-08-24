angular.module("adminPanel",["myTable","ngResource","jqDialog","addButton","dateTimePicker"]);

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
            $scope.refresh();
        }
        
        
        $scope.refresh =function() {
            User.query(function(data) {$scope.users=data; });
          if(!$scope.$$phase) { 
                $scope.$digest();
            } 
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
        
        $scope.submitDlg = function() {
            $scope.curUsr.$save();
            $scope.dlgState=false;
            $scope.refresh(); 
        }
        
        //initialization code
        $scope.dlgState = false;
        $scope.refresh();
        $scope.curUsr=new User();
        
}
userAdmin.$inject = ['$scope','$window','$resource'];

function eventAdmin($scope,$window,$resource) {
	$scope.eventColumnDefs = [ 
            { "mDataProp": "what", "aTargets":[0] },
            { "mDataProp": "where", "aTargets":[1] },
            { "mDataProp": "when", "aTargets":[2] },
            { "mDataProp": "end", "aTargets":[3] },
            { "mDataProp": "type", "aTargets":[4] },
            new actButtons("tid")
        ]; 
	
	var Event = $resource('/admin/trainings/:evtId',{evtId:'@tid'});

	function refresh() {
            Event.query(function(data) {$scope.events=data;});
       }

        $scope.doDel = function(evt) {
            if($window.confirm(evt.what + " (" + evt.where +") wirklich löschen?")) {            
               Event.remove({evtId:evt.tid});
            }
            //refresh();
        };
  
        $scope.doEdit = function(evt) {
            $scope.curEvt = Event.get({evtId:evt.tid});
            $scope.curEvt.when = Date.parse($scope.curEvt.when);
            $scope.dlgState=true;
        };

       $scope.showDlg = function() {
           $scope.curEvt=new Event();
           $scope.curEvt.when = new Date();
           $scope.dlgState = true;
       }

       $scope.submitDlg = function() {
           $scope.curEvt.$save();
           $scope.dlgState=false;
           refresh();
       }

        //init
        $scope.dlgState = false;
        refresh();
        $scope.curEvt = new Event();
        $scope.curEvt.when = new Date();
        $scope.curEvt.end = new Date();
}
eventAdmin.$inject = ['$scope','$window','$resource'];

function commentAdmin($scope,$window,$resource) {
	$scope.commentColumnDefs = [ 
            { "mDataProp": "tid", "aTargets":[0] },
            { "mDataProp": "autor", "aTargets":[1] },
            { "mDataProp": "time", "aTargets":[2] },
            { "mDataProp": "msg", "aTargets":[3] },
             new actButtons("id")
        ]; 
        
        var Comment = $resource('/admin/comments/:cmtId',{cmtId:'@id'});

        function refresh() {
            Comment.query(function(data) {$scope.comments=data;});
        }

        $scope.doDel = function(cmt) {
            if($window.confirm("Kommentar wirklich löschen?")) {            
               Comment.remove({cmtId:cmt.id});
            }
            refresh();
        };
  
        $scope.doEdit = function(cmt) {
            $scope.curCmt = Comment.get({cmtId:cmt.id});
            $scope.dlgState=true;
        };

        $scope.submitDlg = function() {
           $scope.curCmt.$save();
           $scope.dlgState=false;
           refresh();
       }

        //init
        $scope.dlgState = false;
        refresh();
        $scope.curCmt = new Comment();
}
commentAdmin.$inject = ['$scope','$window','$resource'];