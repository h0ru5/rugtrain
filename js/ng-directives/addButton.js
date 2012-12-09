/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('addButton', []).directive("addButton", function($compile) {
        return function(scope, element, attrs) {
        
        if(attrs.addButton.length > 0) {
            caption=attrs.addButton;
        } else {
            caption="Add";
        }
        
        if(attrs.addButtonAction && attrs.addButtonAction.length > 0) {
            action=attrs.addButtonAction;
        } else {
            action="showDlg()";
        }
        
        child = element.parent().find(".dataTables_filter");
        butAdd = $("<button ng-click='"+ action + "'>" + caption + "</button>").button({
            icons: {
                primary: "ui-icon-plusthick"
            }
        });
        butAdd.css('float','right');
        cbut=$compile(butAdd)(scope);
        $(child).append(cbut);
   }
});