/* 
 * directive for dialogs using jQuery UI binding 
 */
angular.module("jqDialog",[])
    .directive("jqDialog", function() {
        return {
           /* scope: {
                dlgState : "=",
                ngModel: "@"
            },*/
            link:  function(scope, element, attrs) {
            
                if(attrs.jqDialog.length > 0) {
                    options = scope.$eval(attrs.jqDialog);
                } else {
                    //default options
                    options= {
                        modal:true
                    };
                }
                options.autoOpen= false;
                options.close = function() {
                    scope.dlgState = false
                    if(!scope.$$phase) scope.$digest();
                    };
                //scope.hideDlg;
            
                if(attrs.dlgButtons && attrs.dlgButtons.length > 0) {
                    options.buttons = scope.$eval(attrs.dlgButtons)
                } else {
                    options.buttons = 
                        {
                            "Cancel" : options.close,
                            "Save"  :  function() {
                                if(attrs.dlgAction)  {
                                    scope.$eval(attrs.dlgAction)();
                                } else {
                                    scope.submitDlg();
                                }
                            }
                        }
                }
            
                scope.openDlg=function() {
                    element.dialog("open");
                };
            
                scope.$watch('dlgState',function(newVal,oldVal) {
                    console.log("dialog status was " + oldVal + " is now " + newVal);
                    if(newVal) {
                        element.dialog("open");
                    } else {
                        element.dialog("close");
                    }
                    
                });
            
                
                $(element).dialog(options);
                scope.dlgState=false;
            }
        }
    }
    );

