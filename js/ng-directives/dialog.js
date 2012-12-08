/* 
 * directive for dialogs using jQuery UI binding 
 */
angular.module("jqDialog",[])
.directive("jqDialog", function() {
        return function(scope, element, attrs) {
            if(attrs.jqDialog.length > 0) {
                options = scope.$eval(attrs.jqDialog);
            } else {
                //default options
                options= {modal:true};
            }
            options.autoOpen= false;
            options.close = function() {
                scope.dlgState=false;
            }
            
            if(attrs.dlgButtons && attrs.dlgButtons.length > 0) {
                options.buttons = scope.$eval(attrs.dlgButtons)
            }
            
            scope.openDlg=function() {element.dialog("open");};
            
            scope.$watch('dlgState',function(newVal,oldVal) {
               console.log("dialog status was " + oldVal + " is now " + newVal);
                  if(newVal) {
                       element.dialog("open");
                   } else {
                       element.dialog("close");
                   }
               
            });
            
            
            element.dialog(options);
        }
});

