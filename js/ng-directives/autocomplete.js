/* 
 * Most simple case of jQuery UI autocomplete
 */
angular.module("jqAutoComplete",[])
    .directive("jqAutoComplete", function() {
        return {      
            require: '?ngModel',
            link: function(scope, element, attrs,model) {
                $(element).autocomplete();

                if(attrs.ngModel) {
                    element.blur(function() {
                        return scope.$apply(function() {
                            model.$setViewValue( element.val());
                        });
                    });
                }
                
                scope.$watch(attrs.jqAutoComplete, function(value) {
                    var val = value || null;
                    if (val) {
                        $(element).autocomplete("option","source",scope.$eval(attrs.jqAutoComplete));
                    }
                });
            }
        }
    });

