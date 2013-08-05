/*! RugTrain - v0.0.1 - 2013-08-05
* http://training.munich-rugbears.de/shiny/
* Copyright (c) 2013 h0ru5; Licensed MIT */
(function($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator === undefined ?  " " : $l.wordSeparator;
      return $.trim([prefix, words, suffix].join(separator));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function(elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  $.fn.timeago = function() {
    var self = this;
    self.each(refresh);

    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
    }
    return self;
  };

  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.datetime)) {
      $(this).text(inWords(data.datetime));
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}(jQuery));

// German
jQuery.timeago.settings.strings = {
  prefixAgo: "vor",
  prefixFromNow: "in",
  suffixAgo: "",
  suffixFromNow: "",
  seconds: "wenigen Sekunden",
  minute: "etwa einer Minute",
  minutes: "%d Minuten",
  hour: "etwa einer Stunde",
  hours: "%d Stunden",
  day: "etwa einem Tag",
  days: "%d Tagen",
  month: "etwa einem Monat",
  months: "%d Monaten",
  year: "etwa einem Jahr",
  years: "%d Jahren"
};
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {"DATETIME_FORMATS":{"MONTH":["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],"SHORTMONTH":["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],"DAY":["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],"SHORTDAY":["So.","Mo.","Di.","Mi.","Do.","Fr.","Sa."],"AMPMS":["vorm.","nachm."],"medium":"dd.MM.yyyy HH:mm:ss","short":"dd.MM.yy HH:mm","fullDate":"EEEE, d. MMMM y","longDate":"d. MMMM y","mediumDate":"dd.MM.yyyy","shortDate":"dd.MM.yy","mediumTime":"HH:mm:ss","shortTime":"HH:mm"},"NUMBER_FORMATS":{"DECIMAL_SEP":",","GROUP_SEP":".","PATTERNS":[{"minInt":1,"minFrac":0,"macFrac":0,"posPre":"","posSuf":"","negPre":"-","negSuf":"","gSize":3,"lgSize":3,"maxFrac":3},{"minInt":1,"minFrac":2,"macFrac":0,"posPre":"","posSuf":" \u00A4","negPre":"-","negSuf":" \u00A4","gSize":3,"lgSize":3,"maxFrac":2}],"CURRENCY_SYM":"€"},"pluralCat":function (n) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;},"id":"de"});
}]);
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


angular.module("jqDialog",[])
    .directive("jqDialog", function() {
        return {
           /* scope: {
                dlgState : "=",
                ngModel: "@"
            },*/
            link:  function(scope, element, attrs) {
            
                if(attrs.jqDialog.length > 0) {
                    options = scope.$eval(attrs.jqDialog);
                } else {
                    //default options
                    options= {
                        modal:true
                    };
                }
                options.autoOpen= false;
                options.close = function() {
                    scope.dlgState = false
                    if(!scope.$$phase) scope.$digest();
                    };
                //scope.hideDlg;
            
                if(attrs.dlgButtons && attrs.dlgButtons.length > 0) {
                    options.buttons = scope.$eval(attrs.dlgButtons)
                } else {
                    options.buttons = 
                        {
                            "Cancel" : options.close,
                            "Save"  :  function() {
                                if(attrs.dlgAction)  {
                                    scope.$eval(attrs.dlgAction)();
                                } else {
                                    scope.submitDlg();
                                }
                            }
                        }
                }
            
                scope.openDlg=function() {
                    element.dialog("open");
                };
            
                scope.$watch('dlgState',function(newVal,oldVal) {
                    console.log("dialog status was " + oldVal + " is now " + newVal);
                    if(newVal) {
                        element.dialog("open");
                    } else {
                        element.dialog("close");
                    }
                    
                });
            
                
                $(element).dialog(options);
                scope.dlgState=false;
            }
        }
    }
    );


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
angular.module('timeago', [])
.filter('timeago',function() {
	return function(input,options) {
		return $.timeago(input);
	}
});
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
angular.module("trainSite",["pdate","timeago","jqDialog","ngCookies","jqAutoComplete","jqButton"]);
var TrainCtrl=function($scope,$http,$cookies,$window) {
    
    function addCmt() {
            console.log("Adding Comment " + $scope.curCmt.msg + " from " + $scope.curCmt.usr);
            $http.post("/res/trainings/" + tid + "/comments", $scope.curCmt)
                    .error(function(data) {console.log("Fehler: " + data)})
                    .success(function(data) {console.log("OK!");
                            $scope.comments.unshift(data);
                    });
    }

    function hasVote() {
        if(!$scope.nameKnown()) return false;
        myVote = $.grep($scope.votes,function(v) { return v.name == $cookies.user});
        
        
        if (myVote.length > 0) {
            console.dir(myVote[0]);
            $scope.curVote = myVote[0];
            return true;
        } else {
            return false;
        }
            
    }
    
    $scope.nameKnown = function() {
        return !($scope.usrname == "" || !$scope.usrname)
    }
    
     $scope.revote = function() {
         console.log("revoting to " + $scope.curVote.vid);
         console.log("Usr is |" + $scope.curVote.name + "| -> empty:" + ($scope.curVote.name == "" || !$scope.curVote.name) );
         if (!$scope.curVote.name || $scope.curVote.name == "") {
             $window.alert("Bitte erst Namen eingeben!");
         } else {
         $scope.usrname =  $scope.curVote.name;   
         $http.post("/res/trainings/" + tid + "/votes", $scope.curVote)
                    .error(function(data) {console.log("Fehler: " + data)})
                    .success(function(data) {console.log("OK!");
                            updateVotes();
                    });
         }
    }
    
    function updateVotes() {
        nocache= Math.random(); //HACK for IE ajax caching
        $http.get("/res/trainings/" + tid + "/votes?nocache=" + nocache).success(function(data) {
            $scope.votes=data; 
            $scope.voted = hasVote();
        });        
    }
    
   //init
   
   //prevent IE insane caching
   $.ajaxSetup({ cache: false });
   
   $scope.usrname = $cookies.user || "";

    $scope.curVote = {
        tid : tid,
        name : $cookies.user,
        vid:0,
        vote:""
    };
    
    $scope.curCmt = {
        msg: "",
        autor : $cookies.user,
        tid : tid
    };

   $http.get("/res/votetypes").success(function(data) {$scope.votetypes=data;}); 
   $http.get("/res/trainings/" + tid + "/comments").success(function(data) {$scope.comments=data;});   
   $http.get("/res/trainings/" + tid + "/stats").success(function(data) {$scope.stats=data;});   
   $http.get("/res/users").success(function(data) {$scope.unames=data;});
   $http.get("/res/trainings/" + tid + "/details")
    .success(function(data) {
         $scope.details=data;
         //$scope.details.when = Date.parse($scope.details.when);	            	
     }); 
    
    updateVotes();


    $scope.dlgState = false;
    $scope.submitDlg = function() {
        addCmt();
        $scope.dlgState=false;
    }
    
};
TrainCtrl.$inject = ['$scope','$http','$cookies','$window'];
            
        