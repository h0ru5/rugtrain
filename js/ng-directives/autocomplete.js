/* 
 * Most simple case of jQuery UI autocomplete
 */
angular.module("jqAutoComplete",[])
    .directive("jqAutoComplete", function() {
        return {
            
            link: function(scope, element, attrs) {
                $(element).autocomplete();
                
                scope.$watch(attrs.jqAutoComplete, function(value) {
                    var val = value || null;
                    if (val) {
                        $(element).autocomplete("option","source",scope.$eval(attrs.jqAutoComplete));
                    }
                });
            }
        }
    });

