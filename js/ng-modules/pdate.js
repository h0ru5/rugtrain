angular.module('pdate', [])
.filter('pdate',function() {
	return function(input,options) {
		return Date.parse(input);
	}
});