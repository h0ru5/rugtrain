angular.module('dateTimePicker', []).directive("dateTimePicker", ['$compile','$log', function($compile,$log) {
        return {
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel) {
             dtpOptions = {
                 onSelect: function(selectedDateTime) {
                     $log.log("set to " + element.val());
                     scope.$apply(updated());
                 }
             };
             function updated() {
                 ngModel.$setViewValue(element.val());
             }
             
              if(attrs.timeFormat && attrs.timeFormat.length>0) {
                dtpOptions.timeFormat = attrs.timeFormat
                }
                if(attrs.dateFormat && attrs.dateFormat.length>0) {
                dtpOptions.dateFormat = attrs.dateFormat
                }

            element.datetimepicker(dtpOptions);
            updated();
        }
        }
}]); 