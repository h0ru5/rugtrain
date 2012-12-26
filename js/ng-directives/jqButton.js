angular.module('jqButton', []).directive("jqButton", ['$compile', function($compile) {
        return function(scope, element, attrs) {
             butOptions = {};
              if(attrs.jqButton.length>0) {
              butOptions.icons = {
                  primary : "ui-icon-" + attrs.jqButton
              }  
            }
            element.button(butOptions);
        }
}]);