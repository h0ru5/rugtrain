angular.module('timeago', [])
.filter('timeago',function() {
	return function(input,options) {
		return $.timeago(input);
	}
});