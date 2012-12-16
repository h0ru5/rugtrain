/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('jqButton', []).directive("jqButton", function($compile) {
        return function(scope, element, attrs) {
             butOptions = {};
              if(attrs.jqButton.length>0) {
              butOptions.icons = {
                  primary : "ui-icon-" + attrs.jqButton
              }  
            }
            element.button(butOptions);
        }
});