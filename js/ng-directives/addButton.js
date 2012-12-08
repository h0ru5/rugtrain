/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('addButton', []).directive("addButton", function($compile) {
        return function(scope, element, attrs) {
        if(attrs.addButton.length > 0) {
                console.log("Add-Button " + attrs.addButton);
                child = element.parent().find(".dataTables_filter");
                console.dir(child);
                
                butAdd = $("<button ng-click='showDlg()'>" + attrs.addButton + "</button>").button({
                    icons: {
                        primary: "ui-icon-plusthick"
                    }
                });
                butAdd.css('float','right');
                cbut=$compile(butAdd)(scope);
                $(child).append(cbut);
            }
   }
});