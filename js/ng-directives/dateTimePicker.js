angular.module('dateTimePicker', []).directive("dateTimePicker", ['$compile', function($compile) {
        return function(scope, element, attrs) {
             dtpOptions = {};
              if(attrs.timeFormat && attrs.timeFormat.length>0) {
                dtpOptions.timeFormat = attrs.timeFormat
                }
                if(attrs.dateFormat && attrs.dateFormat.length>0) {
                dtpOptions.dateFormat = attrs.dateFormat
                }
            element.datetimepicker(dtpOptions);
        }
}]); 