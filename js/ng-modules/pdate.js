angular.module('pdate', [])
.filter('pdate',function() {
	return function(arg,options) {
		 if(arg) {
                 a=arg.split(" ");
                 d=a[0].split("-");
                 t=a[1].split(":");
                return new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
                 }
                //return Date.parse(input);
	}
});