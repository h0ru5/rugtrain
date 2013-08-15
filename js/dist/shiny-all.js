/*! RugTrain - v0.0.1 - 2013-08-15
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
angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.datepicker","ui.bootstrap.dialog","ui.bootstrap.dropdownToggle","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.position","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]),angular.module("ui.bootstrap.tpls",["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/datepicker/datepicker.html","template/dialog/message.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/popover/popover.html","template/progressbar/bar.html","template/progressbar/progress.html","template/rating/rating.html","template/tabs/tab.html","template/tabs/tabset.html","template/timepicker/timepicker.html","template/typeahead/typeahead.html"]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(e,t,n){function a(e){for(var t in e)if(void 0!==i.style[t])return e[t]}var o=function(a,i,r){r=r||{};var l=e.defer(),s=o[r.animation?"animationEndEventName":"transitionEndEventName"],c=function(){n.$apply(function(){a.unbind(s,c),l.resolve(a)})};return s&&a.bind(s,c),t(function(){angular.isString(i)?a.addClass(i):angular.isFunction(i)?i(a):angular.isObject(i)&&a.css(i),s||l.resolve(a)}),l.promise.cancel=function(){s&&a.unbind(s,c),l.reject("Transition cancelled")},l.promise},i=document.createElement("trans"),r={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},l={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"};return o.transitionEndEventName=a(r),o.animationEndEventName=a(l),o}]),angular.module("ui.bootstrap.collapse",["ui.bootstrap.transition"]).directive("collapse",["$transition",function(e){var t=function(e,t,n){t.removeClass("collapse"),t.css({height:n}),t[0].offsetWidth,t.addClass("collapse")};return{link:function(n,a,o){var i,r=!0;n.$watch(function(){return a[0].scrollHeight},function(){0!==a[0].scrollHeight&&(i||(r?t(n,a,a[0].scrollHeight+"px"):t(n,a,"auto")))}),n.$watch(o.collapse,function(e){e?u():c()});var l,s=function(t){return l&&l.cancel(),l=e(a,t),l.then(function(){l=void 0},function(){l=void 0}),l},c=function(){r?(r=!1,i||t(n,a,"auto")):s({height:a[0].scrollHeight+"px"}).then(function(){i||t(n,a,"auto")}),i=!1},u=function(){i=!0,r?(r=!1,t(n,a,0)):(t(n,a,a[0].scrollHeight+"px"),s({height:"0"}))}}}}]),angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(e,t,n){this.groups=[],this.closeOthers=function(a){var o=angular.isDefined(t.closeOthers)?e.$eval(t.closeOthers):n.closeOthers;o&&angular.forEach(this.groups,function(e){e!==a&&(e.isOpen=!1)})},this.addGroup=function(e){var t=this;this.groups.push(e),e.$on("$destroy",function(){t.removeGroup(e)})},this.removeGroup=function(e){var t=this.groups.indexOf(e);-1!==t&&this.groups.splice(this.groups.indexOf(e),1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",["$parse","$transition","$timeout",function(e){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@"},controller:["$scope",function(){this.setHeading=function(e){this.heading=e}}],link:function(t,n,a,o){var i,r;o.addGroup(t),t.isOpen=!1,a.isOpen&&(i=e(a.isOpen),r=i.assign,t.$watch(function(){return i(t.$parent)},function(e){t.isOpen=e}),t.isOpen=i?i(t.$parent):!1),t.$watch("isOpen",function(e){e&&o.closeOthers(t),r&&r(t.$parent,e)})}}}]).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",compile:function(e,t,n){return function(e,t,a,o){o.setHeading(n(e,function(){}))}}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(e,t,n,a){e.$watch(function(){return a[n.accordionTransclude]},function(e){e&&(t.html(""),t.append(e))})}}}),angular.module("ui.bootstrap.alert",[]).directive("alert",function(){return{restrict:"EA",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"=",close:"&"},link:function(e,t,n){e.closeable="close"in n}}}),angular.module("ui.bootstrap.buttons",[]).constant("buttonConfig",{activeClass:"active",toggleEvent:"click"}).directive("btnRadio",["buttonConfig",function(e){var t=e.activeClass||"active",n=e.toggleEvent||"click";return{require:"ngModel",link:function(e,a,o,i){i.$render=function(){a.toggleClass(t,angular.equals(i.$modelValue,e.$eval(o.btnRadio)))},a.bind(n,function(){a.hasClass(t)||e.$apply(function(){i.$setViewValue(e.$eval(o.btnRadio)),i.$render()})})}}}]).directive("btnCheckbox",["buttonConfig",function(e){var t=e.activeClass||"active",n=e.toggleEvent||"click";return{require:"ngModel",link:function(e,a,o,i){var r=e.$eval(o.btnCheckboxTrue),l=e.$eval(o.btnCheckboxFalse);r=angular.isDefined(r)?r:!0,l=angular.isDefined(l)?l:!1,i.$render=function(){a.toggleClass(t,angular.equals(i.$modelValue,r))},a.bind(n,function(){e.$apply(function(){i.$setViewValue(a.hasClass(t)?l:r),i.$render()})})}}}]),angular.module("ui.bootstrap.carousel",["ui.bootstrap.transition"]).controller("CarouselController",["$scope","$timeout","$transition","$q",function(e,t,n){function a(){function n(){i?(e.next(),a()):e.pause()}o&&t.cancel(o);var r=+e.interval;!isNaN(r)&&r>=0&&(o=t(n,r))}var o,i,r=this,l=r.slides=[],s=-1;r.currentSlide=null,r.select=function(o,i){function c(){r.currentSlide&&angular.isString(i)&&!e.noTransition&&o.$element?(o.$element.addClass(i),o.$element[0].offsetWidth=o.$element[0].offsetWidth,angular.forEach(l,function(e){angular.extend(e,{direction:"",entering:!1,leaving:!1,active:!1})}),angular.extend(o,{direction:i,active:!0,entering:!0}),angular.extend(r.currentSlide||{},{direction:i,leaving:!0}),e.$currentTransition=n(o.$element,{}),function(t,n){e.$currentTransition.then(function(){u(t,n)},function(){u(t,n)})}(o,r.currentSlide)):u(o,r.currentSlide),r.currentSlide=o,s=p,a()}function u(t,n){angular.extend(t,{direction:"",active:!0,leaving:!1,entering:!1}),angular.extend(n||{},{direction:"",active:!1,leaving:!1,entering:!1}),e.$currentTransition=null}var p=l.indexOf(o);void 0===i&&(i=p>s?"next":"prev"),o&&o!==r.currentSlide&&(e.$currentTransition?(e.$currentTransition.cancel(),t(c)):c())},r.indexOfSlide=function(e){return l.indexOf(e)},e.next=function(){var t=(s+1)%l.length;return e.$currentTransition?void 0:r.select(l[t],"next")},e.prev=function(){var t=0>s-1?l.length-1:s-1;return e.$currentTransition?void 0:r.select(l[t],"prev")},e.select=function(e){r.select(e)},e.isActive=function(e){return r.currentSlide===e},e.slides=function(){return l},e.$watch("interval",a),e.play=function(){i||(i=!0,a())},e.pause=function(){e.noPause||(i=!1,o&&t.cancel(o))},r.addSlide=function(t,n){t.$element=n,l.push(t),1===l.length||t.active?(r.select(l[l.length-1]),1==l.length&&e.play()):t.active=!1},r.removeSlide=function(e){var t=l.indexOf(e);l.splice(t,1),l.length>0&&e.active?t>=l.length?r.select(l[t-1]):r.select(l[t]):s>t&&s--}}]).directive("carousel",[function(){return{restrict:"EA",transclude:!0,replace:!0,controller:"CarouselController",require:"carousel",templateUrl:"template/carousel/carousel.html",scope:{interval:"=",noTransition:"=",noPause:"="}}}]).directive("slide",["$parse",function(e){return{require:"^carousel",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/carousel/slide.html",scope:{},link:function(t,n,a,o){if(a.active){var i=e(a.active),r=i.assign,l=t.active=i(t.$parent);t.$watch(function(){var e=i(t.$parent);return e!==t.active&&(e!==l?l=t.active=e:r(t.$parent,e=l=t.active)),e})}o.addSlide(t,n),t.$on("$destroy",function(){o.removeSlide(t)}),t.$watch("active",function(e){e&&o.select(t)})}}}]),angular.module("ui.bootstrap.datepicker",[]).constant("datepickerConfig",{dayFormat:"dd",monthFormat:"MMMM",yearFormat:"yyyy",dayHeaderFormat:"EEE",dayTitleFormat:"MMMM yyyy",monthTitleFormat:"yyyy",showWeeks:!0,startingDay:0,yearRange:20}).directive("datepicker",["dateFilter","$parse","datepickerConfig",function(e,t,n){return{restrict:"EA",replace:!0,scope:{model:"=ngModel",dateDisabled:"&"},templateUrl:"template/datepicker/datepicker.html",link:function(a,o,r){function l(e,t,n){a.rows=e,a.labels=t,a.title=n}function s(){a.showWeekNumbers="day"===a.mode&&p}function c(e,t){return"year"===a.mode?t.getFullYear()-e.getFullYear():"month"===a.mode?new Date(t.getFullYear(),t.getMonth())-new Date(e.getFullYear(),e.getMonth()):"day"===a.mode?new Date(t.getFullYear(),t.getMonth(),t.getDate())-new Date(e.getFullYear(),e.getMonth(),e.getDate()):void 0}function u(e){return d&&c(e,d)>0||m&&0>c(e,m)||a.dateDisabled&&a.dateDisabled({date:e,mode:a.mode})}a.mode="day";var p,d,m,g=new Date,f={};f.day=angular.isDefined(r.dayFormat)?a.$eval(r.dayFormat):n.dayFormat,f.month=angular.isDefined(r.monthFormat)?a.$eval(r.monthFormat):n.monthFormat,f.year=angular.isDefined(r.yearFormat)?a.$eval(r.yearFormat):n.yearFormat,f.dayHeader=angular.isDefined(r.dayHeaderFormat)?a.$eval(r.dayHeaderFormat):n.dayHeaderFormat,f.dayTitle=angular.isDefined(r.dayTitleFormat)?a.$eval(r.dayTitleFormat):n.dayTitleFormat,f.monthTitle=angular.isDefined(r.monthTitleFormat)?a.$eval(r.monthTitleFormat):n.monthTitleFormat;var h=angular.isDefined(r.startingDay)?a.$eval(r.startingDay):n.startingDay,v=angular.isDefined(r.yearRange)?a.$eval(r.yearRange):n.yearRange;r.showWeeks?a.$parent.$watch(t(r.showWeeks),function(e){p=!!e,s()}):(p=n.showWeeks,s()),r.min&&a.$parent.$watch(t(r.min),function(e){d=new Date(e),w()}),r.max&&a.$parent.$watch(t(r.max),function(e){m=new Date(e),w()});var b=function(e,t){for(var n=[];e.length>0;)n.push(e.splice(0,t));return n},$=function(e,t){return new Date(e,t+1,0).getDate()},y={day:function(){function t(t,a,i){for(var r=0;a>r;r++)n.push({date:new Date(t),isCurrent:i,isSelected:k(t),label:e(t,f.day),disabled:u(t)}),t.setDate(t.getDate()+1);o=t}var n=[],a=[],o=null,r=new Date(g);r.setDate(1);var s=h-r.getDay(),c=s>0?7-s:-s;for(c>0&&(r.setDate(-c+1),t(r,c,!1)),t(o||r,$(g.getFullYear(),g.getMonth()),!0),t(o,(7-n.length%7)%7,!1),i=0;7>i;i++)a.push(e(n[i].date,f.dayHeader));l(b(n,7),a,e(g,f.dayTitle))},month:function(){for(var t=[],n=0,a=g.getFullYear();12>n;){var o=new Date(a,n++,1);t.push({date:o,isCurrent:!0,isSelected:k(o),label:e(o,f.month),disabled:u(o)})}l(b(t,3),[],e(g,f.monthTitle))},year:function(){for(var t=[],n=parseInt((g.getFullYear()-1)/v,10)*v+1,a=0;v>a;a++){var o=new Date(n+a,0,1);t.push({date:o,isCurrent:!0,isSelected:k(o),label:e(o,f.year),disabled:u(o)})}var i=t[0].label+" - "+t[t.length-1].label;l(b(t,5),[],i)}},w=function(){y[a.mode]()},k=function(e){if(a.model&&a.model.getFullYear()===e.getFullYear()){if("year"===a.mode)return!0;if(a.model.getMonth()===e.getMonth())return"month"===a.mode||"day"===a.mode&&a.model.getDate()===e.getDate()}return!1};a.$watch("model",function(e,t){angular.isDate(e)&&(g=angular.copy(e)),angular.equals(e,t)||w()}),a.$watch("mode",function(){s(),w()}),a.select=function(e){g=new Date(e),"year"===a.mode?(a.mode="month",g.setFullYear(e.getFullYear())):"month"===a.mode?(a.mode="day",g.setMonth(e.getMonth())):"day"===a.mode&&(a.model=new Date(g))},a.move=function(e){"day"===a.mode?g.setMonth(g.getMonth()+e):"month"===a.mode?g.setFullYear(g.getFullYear()+e):"year"===a.mode&&g.setFullYear(g.getFullYear()+e*v),w()},a.toggleMode=function(){a.mode="day"===a.mode?"month":"month"===a.mode?"year":"day"},a.getWeekNumber=function(e){if("day"===a.mode&&a.showWeekNumbers&&7===e.length){var t=h>4?11-h:4-h,n=new Date(e[t].date);return n.setHours(0,0,0),Math.ceil(((n-new Date(n.getFullYear(),0,1))/864e5+1)/7)}}}}}]);var dialogModule=angular.module("ui.bootstrap.dialog",["ui.bootstrap.transition"]);dialogModule.controller("MessageBoxController",["$scope","dialog","model",function(e,t,n){e.title=n.title,e.message=n.message,e.buttons=n.buttons,e.close=function(e){t.close(e)}}]),dialogModule.provider("$dialog",function(){var e={backdrop:!0,dialogClass:"modal",backdropClass:"modal-backdrop",transitionClass:"fade",triggerClass:"in",resolve:{},backdropFade:!1,dialogFade:!1,keyboard:!0,backdropClick:!0},t={},n={value:0};this.options=function(e){t=e},this.$get=["$http","$document","$compile","$rootScope","$controller","$templateCache","$q","$transition","$injector",function(a,o,i,r,l,s,c,u,p){function d(e){var t=angular.element("<div>");return t.addClass(e),t}function m(n){var a=this,o=this.options=angular.extend({},e,t,n);this._open=!1,this.backdropEl=d(o.backdropClass),o.backdropFade&&(this.backdropEl.addClass(o.transitionClass),this.backdropEl.removeClass(o.triggerClass)),this.modalEl=d(o.dialogClass),o.dialogFade&&(this.modalEl.addClass(o.transitionClass),this.modalEl.removeClass(o.triggerClass)),this.handledEscapeKey=function(e){27===e.which&&(a.close(),e.preventDefault(),a.$scope.$apply())},this.handleBackDropClick=function(e){a.close(),e.preventDefault(),a.$scope.$apply()},this.handleLocationChange=function(){a.close()}}var g=o.find("body");return m.prototype.isOpen=function(){return this._open},m.prototype.open=function(e,t){var n=this,a=this.options;if(e&&(a.templateUrl=e),t&&(a.controller=t),!a.template&&!a.templateUrl)throw Error("Dialog.open expected template or templateUrl, neither found. Use options or open method to specify them.");return this._loadResolves().then(function(e){var t=e.$scope=n.$scope=e.$scope?e.$scope:r.$new();if(n.modalEl.html(e.$template),n.options.controller){var a=l(n.options.controller,e);n.modalEl.children().data("ngControllerController",a)}i(n.modalEl)(t),n._addElementsToDom(),setTimeout(function(){n.options.dialogFade&&n.modalEl.addClass(n.options.triggerClass),n.options.backdropFade&&n.backdropEl.addClass(n.options.triggerClass)}),n._bindEvents()}),this.deferred=c.defer(),this.deferred.promise},m.prototype.close=function(e){function t(e){e.removeClass(a.options.triggerClass)}function n(){a._open&&a._onCloseComplete(e)}var a=this,o=this._getFadingElements();if(o.length>0)for(var i=o.length-1;i>=0;i--)u(o[i],t).then(n);else this._onCloseComplete(e)},m.prototype._getFadingElements=function(){var e=[];return this.options.dialogFade&&e.push(this.modalEl),this.options.backdropFade&&e.push(this.backdropEl),e},m.prototype._bindEvents=function(){this.options.keyboard&&g.bind("keydown",this.handledEscapeKey),this.options.backdrop&&this.options.backdropClick&&this.backdropEl.bind("click",this.handleBackDropClick)},m.prototype._unbindEvents=function(){this.options.keyboard&&g.unbind("keydown",this.handledEscapeKey),this.options.backdrop&&this.options.backdropClick&&this.backdropEl.unbind("click",this.handleBackDropClick)},m.prototype._onCloseComplete=function(e){this._removeElementsFromDom(),this._unbindEvents(),this.deferred.resolve(e)},m.prototype._addElementsToDom=function(){g.append(this.modalEl),this.options.backdrop&&(0===n.value&&g.append(this.backdropEl),n.value++),this._open=!0},m.prototype._removeElementsFromDom=function(){this.modalEl.remove(),this.options.backdrop&&(n.value--,0===n.value&&this.backdropEl.remove()),this._open=!1},m.prototype._loadResolves=function(){var e,t=[],n=[],o=this;return this.options.template?e=c.when(this.options.template):this.options.templateUrl&&(e=a.get(this.options.templateUrl,{cache:s}).then(function(e){return e.data})),angular.forEach(this.options.resolve||[],function(e,a){n.push(a),t.push(angular.isString(e)?p.get(e):p.invoke(e))}),n.push("$template"),t.push(e),c.all(t).then(function(e){var t={};return angular.forEach(e,function(e,a){t[n[a]]=e}),t.dialog=o,t})},{dialog:function(e){return new m(e)},messageBox:function(e,t,n){return new m({templateUrl:"template/dialog/message.html",controller:"MessageBoxController",resolve:{model:function(){return{title:e,message:t,buttons:n}}}})}}}]}),angular.module("ui.bootstrap.dropdownToggle",[]).directive("dropdownToggle",["$document","$location",function(e){var t=null,n=angular.noop;return{restrict:"CA",link:function(a,o){a.$watch("$location.path",function(){n()}),o.parent().bind("click",function(){n()}),o.bind("click",function(a){var i=o===t;a.preventDefault(),a.stopPropagation(),t&&n(),i||(o.parent().addClass("open"),t=o,n=function(a){a&&(a.preventDefault(),a.stopPropagation()),e.unbind("click",n),o.parent().removeClass("open"),n=angular.noop,t=null},e.bind("click",n))})}}}]),angular.module("ui.bootstrap.modal",["ui.bootstrap.dialog"]).directive("modal",["$parse","$dialog",function(e,t){return{restrict:"EA",terminal:!0,link:function(n,a,o){var i,r=angular.extend({},n.$eval(o.uiOptions||o.bsOptions||o.options)),l=o.modal||o.show;r=angular.extend(r,{template:a.html(),resolve:{$scope:function(){return n}}});var s=t.dialog(r);a.remove(),i=o.close?function(){e(o.close)(n)}:function(){angular.isFunction(e(l).assign)&&e(l).assign(n,!1)},n.$watch(l,function(e){e?s.open().then(function(){i()}):s.isOpen()&&s.close()})}}}]),angular.module("ui.bootstrap.pagination",[]).controller("PaginationController",["$scope",function(e){e.noPrevious=function(){return 1===e.currentPage},e.noNext=function(){return e.currentPage===e.numPages},e.isActive=function(t){return e.currentPage===t},e.selectPage=function(t){!e.isActive(t)&&t>0&&e.numPages>=t&&(e.currentPage=t,e.onSelectPage({page:t}))}}]).constant("paginationConfig",{boundaryLinks:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",rotate:!0}).directive("pagination",["paginationConfig",function(e){return{restrict:"EA",scope:{numPages:"=",currentPage:"=",maxSize:"=",onSelectPage:"&"},controller:"PaginationController",templateUrl:"template/pagination/pagination.html",replace:!0,link:function(t,n,a){function o(e,t,n,a){return{number:e,text:t,active:n,disabled:a}}var i=angular.isDefined(a.boundaryLinks)?t.$eval(a.boundaryLinks):e.boundaryLinks,r=angular.isDefined(a.directionLinks)?t.$eval(a.directionLinks):e.directionLinks,l=angular.isDefined(a.firstText)?t.$parent.$eval(a.firstText):e.firstText,s=angular.isDefined(a.previousText)?t.$parent.$eval(a.previousText):e.previousText,c=angular.isDefined(a.nextText)?t.$parent.$eval(a.nextText):e.nextText,u=angular.isDefined(a.lastText)?t.$parent.$eval(a.lastText):e.lastText,p=angular.isDefined(a.rotate)?t.$eval(a.rotate):e.rotate;t.$watch("numPages + currentPage + maxSize",function(){t.pages=[];var e=1,n=t.numPages,a=angular.isDefined(t.maxSize)&&t.maxSize<t.numPages;a&&(p?(e=Math.max(t.currentPage-Math.floor(t.maxSize/2),1),n=e+t.maxSize-1,n>t.numPages&&(n=t.numPages,e=n-t.maxSize+1)):(e=(Math.ceil(t.currentPage/t.maxSize)-1)*t.maxSize+1,n=Math.min(e+t.maxSize-1,t.numPages)));for(var d=e;n>=d;d++){var m=o(d,d,t.isActive(d),!1);t.pages.push(m)}if(a&&!p){if(e>1){var g=o(e-1,"...",!1,!1);t.pages.unshift(g)}if(t.numPages>n){var f=o(n+1,"...",!1,!1);t.pages.push(f)}}if(r){var h=o(t.currentPage-1,s,!1,t.noPrevious());t.pages.unshift(h);var v=o(t.currentPage+1,c,!1,t.noNext());t.pages.push(v)}if(i){var b=o(1,l,!1,t.noPrevious());t.pages.unshift(b);var $=o(t.numPages,u,!1,t.noNext());t.pages.push($)}t.currentPage>t.numPages&&t.selectPage(t.numPages)})}}}]).constant("pagerConfig",{previousText:"« Previous",nextText:"Next »",align:!0}).directive("pager",["pagerConfig",function(e){return{restrict:"EA",scope:{numPages:"=",currentPage:"=",onSelectPage:"&"},controller:"PaginationController",templateUrl:"template/pagination/pager.html",replace:!0,link:function(t,n,a){function o(e,t,n,a,o){return{number:e,text:t,disabled:n,previous:l&&a,next:l&&o}}var i=angular.isDefined(a.previousText)?t.$parent.$eval(a.previousText):e.previousText,r=angular.isDefined(a.nextText)?t.$parent.$eval(a.nextText):e.nextText,l=angular.isDefined(a.align)?t.$parent.$eval(a.align):e.align;t.$watch("numPages + currentPage",function(){t.pages=[];var e=o(t.currentPage-1,i,t.noPrevious(),!0,!1);t.pages.unshift(e);var n=o(t.currentPage+1,r,t.noNext(),!1,!0);t.pages.push(n),t.currentPage>t.numPages&&t.selectPage(t.numPages)})}}}]),angular.module("ui.bootstrap.position",[]).factory("$position",["$document","$window",function(e,t){function n(e,n){return e.currentStyle?e.currentStyle[n]:t.getComputedStyle?t.getComputedStyle(e)[n]:e.style[n]}function a(e){return"static"===(n(e,"position")||"static")}var o,i;e.bind("mousemove",function(e){o=e.pageX,i=e.pageY});var r=function(t){for(var n=e[0],o=t.offsetParent||n;o&&o!==n&&a(o);)o=o.offsetParent;return o||n};return{position:function(t){var n=this.offset(t),a={top:0,left:0},o=r(t[0]);return o!=e[0]&&(a=this.offset(angular.element(o)),a.top+=o.clientTop,a.left+=o.clientLeft),{width:t.prop("offsetWidth"),height:t.prop("offsetHeight"),top:n.top-a.top,left:n.left-a.left}},offset:function(n){var a=n[0].getBoundingClientRect();return{width:n.prop("offsetWidth"),height:n.prop("offsetHeight"),top:a.top+(t.pageYOffset||e[0].body.scrollTop),left:a.left+(t.pageXOffset||e[0].body.scrollLeft)}},mouse:function(){return{x:o,y:i}}}}]),angular.module("ui.bootstrap.tooltip",["ui.bootstrap.position"]).provider("$tooltip",function(){function e(e){var t=/[A-Z]/g,n="-";return e.replace(t,function(e,t){return(t?n:"")+e.toLowerCase()})}var t={placement:"top",animation:!0,popupDelay:0},n={mouseenter:"mouseleave",click:"click",focus:"blur"},a={};this.options=function(e){angular.extend(a,e)},this.setTriggers=function(e){angular.extend(n,e)},this.$get=["$window","$compile","$timeout","$parse","$document","$position","$interpolate",function(o,i,r,l,s,c,u){return function(o,p,d){function m(e){var t,a;return t=e||g.trigger||d,a=angular.isDefined(g.trigger)?n[g.trigger]||t:n[t]||t,{show:t,hide:a}}var g=angular.extend({},t,a),f=e(o),h=m(void 0),v=u.startSymbol(),b=u.endSymbol(),$="<"+f+"-popup "+'title="'+v+"tt_title"+b+'" '+'content="'+v+"tt_content"+b+'" '+'placement="'+v+"tt_placement"+b+'" '+'animation="tt_animation()" '+'is-open="tt_isOpen"'+">"+"</"+f+"-popup>";return{restrict:"EA",scope:!0,link:function(e,t,n){function a(){e.tt_isOpen?d():u()}function u(){e.tt_popupDelay?y=r(f,e.tt_popupDelay):e.$apply(f)}function d(){e.$apply(function(){v()})}function f(){var n,a,o,i;if(e.tt_content){switch(b&&r.cancel(b),k.css({top:0,left:0,display:"block"}),x?(w=w||s.find("body"),w.append(k)):t.after(k),n=g.appendToBody?c.offset(t):c.position(t),a=k.prop("offsetWidth"),o=k.prop("offsetHeight"),e.tt_placement){case"mouse":var l=c.mouse();i={top:l.y,left:l.x};break;case"right":i={top:n.top+n.height/2-o/2,left:n.left+n.width};break;case"bottom":i={top:n.top+n.height,left:n.left+n.width/2-a/2};break;case"left":i={top:n.top+n.height/2-o/2,left:n.left-a};break;default:i={top:n.top-o,left:n.left+n.width/2-a/2}}i.top+="px",i.left+="px",k.css(i),e.tt_isOpen=!0}}function v(){e.tt_isOpen=!1,r.cancel(y),angular.isDefined(e.tt_animation)&&e.tt_animation()?b=r(function(){k.remove()},500):k.remove()}var b,y,w,k=i($)(e),x=angular.isDefined(g.appendToBody)?g.appendToBody:!1;e.tt_isOpen=!1,n.$observe(o,function(t){e.tt_content=t}),n.$observe(p+"Title",function(t){e.tt_title=t}),n.$observe(p+"Placement",function(t){e.tt_placement=angular.isDefined(t)?t:g.placement}),n.$observe(p+"Animation",function(t){e.tt_animation=angular.isDefined(t)?l(t):function(){return g.animation}}),n.$observe(p+"PopupDelay",function(t){var n=parseInt(t,10);e.tt_popupDelay=isNaN(n)?g.popupDelay:n}),n.$observe(p+"Trigger",function(e){t.unbind(h.show),t.unbind(h.hide),h=m(e),h.show===h.hide?t.bind(h.show,a):(t.bind(h.show,u),t.bind(h.hide,d))}),n.$observe(p+"AppendToBody",function(t){x=angular.isDefined(t)?l(t)(e):x}),x&&e.$on("$locationChangeSuccess",function(){e.tt_isOpen&&v()}),e.$on("$destroy",function(){e.tt_isOpen?v():k.remove()})}}}}]}).directive("tooltipPopup",function(){return{restrict:"E",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$tooltip",function(e){return e("tooltip","tooltip","mouseenter")}]).directive("tooltipHtmlUnsafePopup",function(){return{restrict:"E",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-unsafe-popup.html"}}).directive("tooltipHtmlUnsafe",["$tooltip",function(e){return e("tooltipHtmlUnsafe","tooltip","mouseenter")}]),angular.module("ui.bootstrap.popover",["ui.bootstrap.tooltip"]).directive("popoverPopup",function(){return{restrict:"EA",replace:!0,scope:{title:"@",content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/popover/popover.html"}}).directive("popover",["$compile","$timeout","$parse","$window","$tooltip",function(e,t,n,a,o){return o("popover","popover","click")}]),angular.module("ui.bootstrap.progressbar",["ui.bootstrap.transition"]).constant("progressConfig",{animate:!0,autoType:!1,stackedTypes:["success","info","warning","danger"]}).controller("ProgressBarController",["$scope","$attrs","progressConfig",function(e,t,n){function a(e){return r[e]}var o=angular.isDefined(t.animate)?e.$eval(t.animate):n.animate,i=angular.isDefined(t.autoType)?e.$eval(t.autoType):n.autoType,r=angular.isDefined(t.stackedTypes)?e.$eval("["+t.stackedTypes+"]"):n.stackedTypes;this.makeBar=function(e,t,n){var r=angular.isObject(e)?e.value:e||0,l=angular.isObject(t)?t.value:t||0,s=angular.isObject(e)&&angular.isDefined(e.type)?e.type:i?a(n||0):null;return{from:l,to:r,type:s,animate:o}},this.addBar=function(t){e.bars.push(t),e.totalPercent+=t.to},this.clearBars=function(){e.bars=[],e.totalPercent=0},this.clearBars()}]).directive("progress",function(){return{restrict:"EA",replace:!0,controller:"ProgressBarController",scope:{value:"=percent",onFull:"&",onEmpty:"&"},templateUrl:"template/progressbar/progress.html",link:function(e,t,n,a){e.$watch("value",function(e,t){if(a.clearBars(),angular.isArray(e))for(var n=0,o=e.length;o>n;n++)a.addBar(a.makeBar(e[n],t[n],n));else a.addBar(a.makeBar(e,t))},!0),e.$watch("totalPercent",function(t){t>=100?e.onFull():0>=t&&e.onEmpty()},!0)}}}).directive("progressbar",["$transition",function(e){return{restrict:"EA",replace:!0,scope:{width:"=",old:"=",type:"=",animate:"="},templateUrl:"template/progressbar/bar.html",link:function(t,n){t.$watch("width",function(a){t.animate?(n.css("width",t.old+"%"),e(n,{width:a+"%"})):n.css("width",a+"%")})}}}]),angular.module("ui.bootstrap.rating",[]).constant("ratingConfig",{max:5}).directive("rating",["ratingConfig","$parse",function(e,t){return{restrict:"EA",scope:{value:"="},templateUrl:"template/rating/rating.html",replace:!0,link:function(n,a,o){var i=angular.isDefined(o.max)?n.$eval(o.max):e.max;n.range=[];for(var r=1;i>=r;r++)n.range.push(r);n.rate=function(e){n.readonly||(n.value=e)},n.enter=function(e){n.readonly||(n.val=e)},n.reset=function(){n.val=angular.copy(n.value)},n.reset(),n.$watch("value",function(e){n.val=e}),n.readonly=!1,o.readonly&&n.$parent.$watch(t(o.readonly),function(e){n.readonly=!!e})}}}]),angular.module("ui.bootstrap.tabs",[]).directive("tabs",function(){return function(){throw Error("The `tabs` directive is deprecated, please migrate to `tabset`. Instructions can be found at http://github.com/angular-ui/bootstrap/tree/master/CHANGELOG.md")}}).controller("TabsetController",["$scope","$element",function(e){var t=this,n=t.tabs=e.tabs=[];t.select=function(e){angular.forEach(n,function(e){e.active=!1}),e.active=!0},t.addTab=function(e){n.push(e),1==n.length&&t.select(e)},t.removeTab=function(e){var a=n.indexOf(e);if(e.active&&n.length>1){var o=a==n.length-1?a-1:a+1;t.select(n[o])}n.splice(a,1)}}]).directive("tabset",function(){return{restrict:"EA",transclude:!0,scope:{},controller:"TabsetController",templateUrl:"template/tabs/tabset.html",link:function(e,t,n){e.vertical=angular.isDefined(n.vertical)?e.$eval(n.vertical):!1,e.type=angular.isDefined(n.type)?e.$parent.$eval(n.type):"tabs"}}}).directive("tab",["$parse","$http","$templateCache","$compile",function(e){return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"template/tabs/tab.html",transclude:!0,scope:{heading:"@",onSelect:"&select"},controller:function(){},compile:function(t,n,a){return function(t,n,o,i){var r,l;t.active=!1,o.active?(r=e(o.active),l=r.assign,t.$parent.$watch(r,function(e){e&&t.disabled?l(t.$parent,!1):t.active=!!e})):l=r=angular.noop,t.$watch("active",function(e){l(t.$parent,e),e&&(i.select(t),t.onSelect())}),t.disabled=!1,o.disabled&&t.$parent.$watch(e(o.disabled),function(e){t.disabled=!!e}),t.select=function(){t.disabled||(t.active=!0)},i.addTab(t),t.$on("$destroy",function(){i.removeTab(t)}),t.active&&l(t.$parent,!0),a(t.$parent,function(e){var n,a=[];angular.forEach(e,function(e){e.tagName&&(e.hasAttribute("tab-heading")||e.hasAttribute("data-tab-heading")||"tab-heading"==e.tagName.toLowerCase()||"data-tab-heading"==e.tagName.toLowerCase())?n=e:a.push(e)}),n&&(t.headingElement=angular.element(n)),t.contentElement=angular.element(a)})}}}}]).directive("tabHeadingTransclude",[function(){return{restrict:"A",require:"^tab",link:function(e,t){e.$watch("headingElement",function(e){e&&(t.html(""),t.append(e))})}}}]).directive("tabContentTransclude",["$parse",function(e){return{restrict:"A",require:"^tabset",link:function(t,n,a){t.$watch(e(a.tabContentTransclude),function(e){n.html(""),e&&n.append(e.contentElement)})}}}]),angular.module("ui.bootstrap.timepicker",[]).filter("pad",function(){return function(e){return angular.isDefined(e)&&2>(""+e).length&&(e="0"+e),e}}).constant("timepickerConfig",{hourStep:1,minuteStep:1,showMeridian:!0,meridians:["AM","PM"],readonlyInput:!1,mousewheel:!0}).directive("timepicker",["padFilter","$parse","timepickerConfig",function(e,t,n){return{restrict:"EA",require:"ngModel",replace:!0,templateUrl:"template/timepicker/timepicker.html",scope:{model:"=ngModel"},link:function(a,o,i){function r(){var e=parseInt(a.hours,10),t=a.showMeridian?e>0&&13>e:e>=0&&24>e;return t?(a.showMeridian&&(12===e&&(e=0),a.meridian===u[1]&&(e+=12)),e):void 0}function l(){var t=c.getHours();a.showMeridian&&(t=0===t||12===t?12:t%12),a.hours="h"===b?t:e(t),a.validHours=!0;var n=c.getMinutes();a.minutes="m"===b?n:e(n),a.validMinutes=!0,a.meridian=a.showMeridian?12>c.getHours()?u[0]:u[1]:"",b=!1}function s(e){var t=new Date(c.getTime()+6e4*e);t.getDate()!==c.getDate()&&t.setDate(t.getDate()-1),c.setTime(t.getTime()),a.model=new Date(c)}var c=new Date,u=n.meridians,p=n.hourStep;i.hourStep&&a.$parent.$watch(t(i.hourStep),function(e){p=parseInt(e,10)});var d=n.minuteStep;i.minuteStep&&a.$parent.$watch(t(i.minuteStep),function(e){d=parseInt(e,10)}),a.showMeridian=n.showMeridian,i.showMeridian&&a.$parent.$watch(t(i.showMeridian),function(e){if(a.showMeridian=!!e,a.model)l();else{var t=new Date(c),n=r();angular.isDefined(n)&&t.setHours(n),a.model=new Date(t)}});var m=o.find("input"),g=m.eq(0),f=m.eq(1),h=angular.isDefined(i.mousewheel)?a.$eval(i.mousewheel):n.mousewheel;if(h){var v=function(e){return e.originalEvent&&(e=e.originalEvent),e.detail||e.wheelDelta>0};g.bind("mousewheel",function(e){a.$apply(v(e)?a.incrementHours():a.decrementHours()),e.preventDefault()}),f.bind("mousewheel",function(e){a.$apply(v(e)?a.incrementMinutes():a.decrementMinutes()),e.preventDefault()})}var b=!1;a.readonlyInput=angular.isDefined(i.readonlyInput)?a.$eval(i.readonlyInput):n.readonlyInput,a.readonlyInput?(a.updateHours=angular.noop,a.updateMinutes=angular.noop):(a.updateHours=function(){var e=r();angular.isDefined(e)?(b="h",null===a.model&&(a.model=new Date(c)),a.model.setHours(e)):(a.model=null,a.validHours=!1)},g.bind("blur",function(){a.validHours&&10>a.hours&&a.$apply(function(){a.hours=e(a.hours)
})}),a.updateMinutes=function(){var e=parseInt(a.minutes,10);e>=0&&60>e?(b="m",null===a.model&&(a.model=new Date(c)),a.model.setMinutes(e)):(a.model=null,a.validMinutes=!1)},f.bind("blur",function(){a.validMinutes&&10>a.minutes&&a.$apply(function(){a.minutes=e(a.minutes)})})),a.$watch(function(){return+a.model},function(e){!isNaN(e)&&e>0&&(c=new Date(e),l())}),a.incrementHours=function(){s(60*p)},a.decrementHours=function(){s(60*-p)},a.incrementMinutes=function(){s(d)},a.decrementMinutes=function(){s(-d)},a.toggleMeridian=function(){s(720*(12>c.getHours()?1:-1))}}}}]),angular.module("ui.bootstrap.typeahead",["ui.bootstrap.position"]).factory("typeaheadParser",["$parse",function(e){var t=/^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;return{parse:function(n){var a=n.match(t);if(!a)throw Error("Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_' but got '"+n+"'.");return{itemName:a[3],source:e(a[4]),viewMapper:e(a[2]||a[1]),modelMapper:e(a[1])}}}}]).directive("typeahead",["$compile","$parse","$q","$timeout","$document","$position","typeaheadParser",function(e,t,n,a,o,i,r){var l=[9,13,27,38,40];return{require:"ngModel",link:function(s,c,u,p){var d,m=s.$eval(u.typeaheadMinLength)||1,g=s.$eval(u.typeaheadWaitMs)||0,f=r.parse(u.typeahead),h=s.$eval(u.typeaheadEditable)!==!1,v=t(u.typeaheadLoading).assign||angular.noop,b=t(u.typeaheadOnSelect),$=angular.element("<typeahead-popup></typeahead-popup>");$.attr({matches:"matches",active:"activeIdx",select:"select(activeIdx)",query:"query",position:"position"});var y=s.$new();s.$on("$destroy",function(){y.$destroy()});var w=function(){y.matches=[],y.activeIdx=-1},k=function(e){var t={$viewValue:e};v(s,!0),n.when(f.source(y,t)).then(function(n){if(e===p.$viewValue){if(n.length>0){y.activeIdx=0,y.matches.length=0;for(var a=0;n.length>a;a++)t[f.itemName]=n[a],y.matches.push({label:f.viewMapper(y,t),model:n[a]});y.query=e,y.position=i.position(c),y.position.top=y.position.top+c.prop("offsetHeight")}else w();v(s,!1)}},function(){w(),v(s,!1)})};w(),y.query=void 0,p.$parsers.push(function(e){var t;return w(),d?e:(e&&e.length>=m&&(g>0?(t&&a.cancel(t),t=a(function(){k(e)},g)):k(e)),h?e:void 0)}),p.$render=function(){var e={};e[f.itemName]=d||p.$viewValue,c.val(f.viewMapper(y,e)||p.$viewValue),d=void 0},y.select=function(e){var t,n,a={};a[f.itemName]=n=d=y.matches[e].model,t=f.modelMapper(y,a),p.$setViewValue(t),p.$render(),b(y,{$item:n,$model:t,$label:f.viewMapper(y,a)}),c[0].focus()},c.bind("keydown",function(e){0!==y.matches.length&&-1!==l.indexOf(e.which)&&(e.preventDefault(),40===e.which?(y.activeIdx=(y.activeIdx+1)%y.matches.length,y.$digest()):38===e.which?(y.activeIdx=(y.activeIdx?y.activeIdx:y.matches.length)-1,y.$digest()):13===e.which||9===e.which?y.$apply(function(){y.select(y.activeIdx)}):27===e.which&&(e.stopPropagation(),w(),y.$digest()))}),o.bind("click",function(){w(),y.$digest()}),c.after(e($)(y))}}}]).directive("typeaheadPopup",function(){return{restrict:"E",scope:{matches:"=",query:"=",active:"=",position:"=",select:"&"},replace:!0,templateUrl:"template/typeahead/typeahead.html",link:function(e){e.isOpen=function(){return e.matches.length>0},e.isActive=function(t){return e.active==t},e.selectActive=function(t){e.active=t},e.selectMatch=function(t){e.select({activeIdx:t})}}}}).filter("typeaheadHighlight",function(){function e(e){return e.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")}return function(t,n){return n?t.replace(RegExp(e(n),"gi"),"<strong>$&</strong>"):n}}),angular.module("template/accordion/accordion-group.html",[]).run(["$templateCache",function(e){e.put("template/accordion/accordion-group.html",'<div class="accordion-group">\n  <div class="accordion-heading" ><a class="accordion-toggle" ng-click="isOpen = !isOpen" accordion-transclude="heading">{{heading}}</a></div>\n  <div class="accordion-body" collapse="!isOpen">\n    <div class="accordion-inner" ng-transclude></div>  </div>\n</div>')}]),angular.module("template/accordion/accordion.html",[]).run(["$templateCache",function(e){e.put("template/accordion/accordion.html",'<div class="accordion" ng-transclude></div>')}]),angular.module("template/alert/alert.html",[]).run(["$templateCache",function(e){e.put("template/alert/alert.html","<div class='alert' ng-class='type && \"alert-\" + type'>\n    <button ng-show='closeable' type='button' class='close' ng-click='close()'>&times;</button>\n    <div ng-transclude></div>\n</div>\n")}]),angular.module("template/carousel/carousel.html",[]).run(["$templateCache",function(e){e.put("template/carousel/carousel.html",'<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel">\n    <ol class="carousel-indicators" ng-show="slides().length > 1">\n        <li ng-repeat="slide in slides()" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a ng-click="prev()" class="carousel-control left" ng-show="slides().length > 1">&lsaquo;</a>\n    <a ng-click="next()" class="carousel-control right" ng-show="slides().length > 1">&rsaquo;</a>\n</div>\n')}]),angular.module("template/carousel/slide.html",[]).run(["$templateCache",function(e){e.put("template/carousel/slide.html","<div ng-class=\"{\n    'active': leaving || (active && !entering),\n    'prev': (next || active) && direction=='prev',\n    'next': (next || active) && direction=='next',\n    'right': direction=='prev',\n    'left': direction=='next'\n  }\" class=\"item\" ng-transclude></div>\n")}]),angular.module("template/datepicker/datepicker.html",[]).run(["$templateCache",function(e){e.put("template/datepicker/datepicker.html",'<table class="well well-large">\n  <thead>\n    <tr class="text-center">\n      <th><button class="btn pull-left" ng-click="move(-1)"><i class="icon-chevron-left"></i></button></th>\n      <th colspan="{{rows[0].length - 2 + showWeekNumbers}}"><button class="btn btn-block" ng-click="toggleMode()"><strong>{{title}}</strong></button></th>\n      <th><button class="btn pull-right" ng-click="move(1)"><i class="icon-chevron-right"></i></button></th>\n    </tr>\n    <tr class="text-center" ng-show="labels.length > 0">\n      <th ng-show="showWeekNumbers">#</th>\n      <th ng-repeat="label in labels">{{label}}</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows">\n      <td ng-show="showWeekNumbers" class="text-center"><em>{{ getWeekNumber(row) }}</em></td>\n      <td ng-repeat="dt in row" class="text-center">\n        <button style="width:100%;" class="btn" ng-class="{\'btn-info\': dt.isSelected}" ng-click="select(dt.date)" ng-disabled="dt.disabled"><span ng-class="{muted: ! dt.isCurrent}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/dialog/message.html",[]).run(["$templateCache",function(e){e.put("template/dialog/message.html",'<div class="modal-header">\n	<h3>{{ title }}</h3>\n</div>\n<div class="modal-body">\n	<p>{{ message }}</p>\n</div>\n<div class="modal-footer">\n	<button ng-repeat="btn in buttons" ng-click="close(btn.result)" class="btn" ng-class="btn.cssClass">{{ btn.label }}</button>\n</div>\n')}]),angular.module("template/modal/backdrop.html",[]).run(["$templateCache",function(e){e.put("template/modal/backdrop.html",'<div class="modal-backdrop"></div>')}]),angular.module("template/modal/window.html",[]).run(["$templateCache",function(e){e.put("template/modal/window.html",'<div class="modal in" ng-transclude></div>')}]),angular.module("template/pagination/pager.html",[]).run(["$templateCache",function(e){e.put("template/pagination/pager.html",'<div class="pager">\n  <ul>\n    <li ng-repeat="page in pages" ng-class="{disabled: page.disabled, previous: page.previous, next: page.next}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  </ul>\n</div>\n')}]),angular.module("template/pagination/pagination.html",[]).run(["$templateCache",function(e){e.put("template/pagination/pagination.html",'<div class="pagination"><ul>\n  <li ng-repeat="page in pages" ng-class="{active: page.active, disabled: page.disabled}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  </ul>\n</div>\n')}]),angular.module("template/tooltip/tooltip-html-unsafe-popup.html",[]).run(["$templateCache",function(e){e.put("template/tooltip/tooltip-html-unsafe-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind-html-unsafe="content"></div>\n</div>\n')}]),angular.module("template/tooltip/tooltip-popup.html",[]).run(["$templateCache",function(e){e.put("template/tooltip/tooltip-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')}]),angular.module("template/popover/popover.html",[]).run(["$templateCache",function(e){e.put("template/popover/popover.html",'<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')}]),angular.module("template/progressbar/bar.html",[]).run(["$templateCache",function(e){e.put("template/progressbar/bar.html",'<div class="bar" ng-class=\'type && "bar-" + type\'></div>')}]),angular.module("template/progressbar/progress.html",[]).run(["$templateCache",function(e){e.put("template/progressbar/progress.html",'<div class="progress"><progressbar ng-repeat="bar in bars" width="bar.to" old="bar.from" animate="bar.animate" type="bar.type"></progressbar></div>')}]),angular.module("template/rating/rating.html",[]).run(["$templateCache",function(e){e.put("template/rating/rating.html",'<span ng-mouseleave="reset()">\n	<i ng-repeat="number in range" ng-mouseenter="enter(number)" ng-click="rate(number)" ng-class="{\'icon-star\': number <= val, \'icon-star-empty\': number > val}"></i>\n</span>\n')}]),angular.module("template/tabs/pane.html",[]).run(["$templateCache",function(e){e.put("template/tabs/pane.html",'<div class="tab-pane" ng-class="{active: selected}" ng-show="selected" ng-transclude></div>\n')}]),angular.module("template/tabs/tab.html",[]).run(["$templateCache",function(e){e.put("template/tabs/tab.html",'<li ng-class="{active: active, disabled: disabled}">\n  <a ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')}]),angular.module("template/tabs/tabs.html",[]).run(["$templateCache",function(e){e.put("template/tabs/tabs.html",'<div class="tabbable">\n  <ul class="nav nav-tabs">\n    <li ng-repeat="pane in panes" ng-class="{active:pane.selected}">\n      <a ng-click="select(pane)">{{pane.heading}}</a>\n    </li>\n  </ul>\n  <div class="tab-content" ng-transclude></div>\n</div>\n')}]),angular.module("template/tabs/tabset.html",[]).run(["$templateCache",function(e){e.put("template/tabs/tabset.html",'\n<div class="tabbable">\n  <ul class="nav {{type && \'nav-\' + type}}" ng-class="{\'nav-stacked\': vertical}" ng-transclude>\n  </ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab" tt="tab">\n    </div>\n  </div>\n</div>\n')}]),angular.module("template/timepicker/timepicker.html",[]).run(["$templateCache",function(e){e.put("template/timepicker/timepicker.html",'<table class="form-inline">\n	<tr class="text-center">\n		<td><a ng-click="incrementHours()" class="btn btn-link"><i class="icon-chevron-up"></i></a></td>\n		<td>&nbsp;</td>\n		<td><a ng-click="incrementMinutes()" class="btn btn-link"><i class="icon-chevron-up"></i></a></td>\n		<td ng-show="showMeridian"></td>\n	</tr>\n	<tr>\n		<td class="control-group" ng-class="{\'error\': !validHours}"><input type="text" ng-model="hours" ng-change="updateHours()" class="span1 text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2" /></td>\n		<td>:</td>\n		<td class="control-group" ng-class="{\'error\': !validMinutes}"><input type="text" ng-model="minutes" ng-change="updateMinutes()" class="span1 text-center" ng-readonly="readonlyInput" maxlength="2"></td>\n		<td ng-show="showMeridian"><button ng-click="toggleMeridian()" class="btn text-center">{{meridian}}</button></td>\n	</tr>\n	<tr class="text-center">\n		<td><a ng-click="decrementHours()" class="btn btn-link"><i class="icon-chevron-down"></i></a></td>\n		<td>&nbsp;</td>\n		<td><a ng-click="decrementMinutes()" class="btn btn-link"><i class="icon-chevron-down"></i></a></td>\n		<td ng-show="showMeridian"></td>\n	</tr>\n</table>')}]),angular.module("template/typeahead/typeahead.html",[]).run(["$templateCache",function(e){e.put("template/typeahead/typeahead.html",'<ul class="typeahead dropdown-menu" ng-style="{display: isOpen()&&\'block\' || \'none\', top: position.top+\'px\', left: position.left+\'px\'}">\n    <li ng-repeat="match in matches" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)">\n        <a tabindex="-1" ng-click="selectMatch($index)" ng-bind-html-unsafe="match.label | typeaheadHighlight:query"></a>\n    </li>\n</ul>')}]);
!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle()
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('.dropdown-menu', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);
var guiders = (function($) {
  var guiders = {};
  
  guiders.version = "1.3.0";

  guiders._defaultSettings = {
    attachTo: null, // Selector of the element to attach to.
    autoFocus: false, // Determines whether or not the browser scrolls to the element.
    buttons: [{name: "Close"}],
    buttonCustomHTML: "",
    classString: null,
    closeOnEscape: false,
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    highlight: null,
    isHashable: true,
    offset: {
      top: null,
      left: null
    },
    onClose: null, 
    onHide: null,
    onShow: null,
    overlay: false,
    position: 0, // 1-12 follows an analog clock, 0 means centered.
    shouldSkip: function() {}, // Optional handler allows you to skip a guider if returns true.
    title: "Sample title goes here",
    width: 400,
    xButton: false // This places a closer "x" button in the top right of the guider.
  };

  guiders._htmlSkeleton = [
    "<div class='guider'>",
    "  <div class='guiders_content'>",
    "    <h1 class='guiders_title'></h1>",
    "    <div class='guiders_close'></div>",
    "    <p class='guiders_description'></p>",
    "    <div class='guiders_buttons_container'>",
    "    </div>",
    "  </div>",
    "  <div class='guiders_arrow'>",
    "  </div>",
    "</div>"
  ].join("");

  guiders._arrowSize = 42; // This is the arrow's width and height.
  guiders._backButtonTitle = "Back";
  guiders._buttonAttributes = {"href": "javascript:void(0);"};
  guiders._buttonClassName = "guiders_button"; // Override this if you use a different class name for your buttons.
  guiders._buttonClickEvent = "click touch"; // Using click touch allows this to trigger with iPad/iPhone taps, as well as browser clicks
  guiders._buttonElement = "<a></a>"; // Override this if you want to use a different element for your buttons, like spans.
  guiders._closeButtonTitle = "Close";
  guiders._currentGuiderID = null;
  guiders._fixedOrAbsolute = "fixed";
  guiders._guiders = {};
  guiders._lastCreatedGuiderID = null;
  guiders._nextButtonTitle = "Next";
  guiders._offsetNameMapping = {
    "topLeft": 11,
    "top": 12,
    "topRight": 1,
    "rightTop": 2,
    "right": 3,
    "rightBottom": 4,
    "bottomRight": 5,
    "bottom": 6,
    "bottomLeft": 7,
    "leftBottom": 8,
    "left": 9,
    "leftTop": 10
  };
  guiders._windowHeight = 0;
  
  // Basic IE browser detection
  var ieBrowserMatch = navigator.userAgent.match('MSIE (.)');
  guiders._isIE = ieBrowserMatch && ieBrowserMatch.length > 1;
  guiders._ieVersion = ieBrowserMatch && ieBrowserMatch.length > 1 ? Number(ieBrowserMatch[1]) : -1;
  
  guiders._addButtons = function(myGuider) {
    var guiderButtonsContainer = myGuider.elem.find(".guiders_buttons_container");
  
    if (myGuider.buttons === null || myGuider.buttons.length === 0) {
      guiderButtonsContainer.remove();
      return;
    }
  
    for (var i = myGuider.buttons.length - 1; i >= 0; i--) {
      var thisButton = myGuider.buttons[i];
      var thisButtonElem = $(guiders._buttonElement,
        $.extend({"class" : guiders._buttonClassName, "html" : thisButton.name }, guiders._buttonAttributes, thisButton.html || {})
      );

      if (typeof thisButton.classString !== "undefined" && thisButton.classString !== null) {
        thisButtonElem.addClass(thisButton.classString);
      }
  
      guiderButtonsContainer.append(thisButtonElem);
      
      var thisButtonName = thisButton.name.toLowerCase();
      if (thisButton.onclick) {
        thisButtonElem.bind(guiders._buttonClickEvent, thisButton.onclick);
      } else {
        switch (thisButtonName) {
          case guiders._closeButtonTitle.toLowerCase():
            thisButtonElem.bind(guiders._buttonClickEvent, function () {
              guiders.hideAll();
              if (myGuider.onClose) {
                myGuider.onClose(myGuider, false /* close by button */);
              }
            });
            break;
          case guiders._nextButtonTitle.toLowerCase():
            thisButtonElem.bind(guiders._buttonClickEvent, function () {
              !myGuider.elem.data("locked") && guiders.next();
            });
            break;
          case guiders._backButtonTitle.toLowerCase():
            thisButtonElem.bind(guiders._buttonClickEvent, function () {
              !myGuider.elem.data("locked") && guiders.prev();
            });
            break;
        }
      }
    }
  
    if (myGuider.buttonCustomHTML !== "") {
      var myCustomHTML = $(myGuider.buttonCustomHTML);
      myGuider.elem.find(".guiders_buttons_container").append(myCustomHTML);
    }
  
    if (myGuider.buttons.length === 0) {
      guiderButtonsContainer.remove();
    }
  };

  guiders._addXButton = function(myGuider) {
    var xButtonContainer = myGuider.elem.find(".guiders_close");
    var xButton = $("<div></div>", {
      "class" : "guiders_x_button",
      "role" : "button"
    });
    xButtonContainer.append(xButton);
    xButton.click(function() {
      guiders.hideAll();
      if (myGuider.onClose) {
        myGuider.onClose(myGuider, true);
       }
    });
  };

  guiders._wireEscape = function (myGuider) {
    $(document).keydown(function(event) {
      if (event.keyCode == 27 || event.which == 27) {
        guiders.hideAll();
        if (myGuider.onClose) {
          myGuider.onClose(myGuider, true /*close by X/Escape*/);
        }
        return false;
      }
    });      
  };

  guiders._unWireEscape = function (myGuider) {
    $(document).unbind("keydown");
  };
  
  guiders._attach = function(myGuider) {
    if (typeof myGuider !== 'object') {
      return;
    }
        
    var attachTo = $(myGuider.attachTo);

    var myHeight = myGuider.elem.innerHeight();
    var myWidth = myGuider.elem.innerWidth();

    if (myGuider.position === 0 || attachTo.length === 0) {
      var fixedOrAbsolute = "fixed";
      if (guiders._isIE && guiders._ieVersion < 9) {
        fixedOrAbsolute = "absolute";
      }
      myGuider.elem.css("position", fixedOrAbsolute);
      myGuider.elem.css("top", ($(window).height() - myHeight) / 3 + "px");
      myGuider.elem.css("left", ($(window).width() - myWidth) / 2 + "px");
      return;
    }
    
    // Otherwise, the guider is positioned relative to the attachTo element.
    var base = attachTo.offset();
    var top = base.top;
    var left = base.left;
    
    // topMarginOfBody corrects positioning if body has a top margin set on it.
    var topMarginOfBody = $("body").outerHeight(true) - $("body").outerHeight(false);
    top -= topMarginOfBody;

    // Now, take into account how the guider should be positioned relative to the attachTo element.
    // e.g. top left, bottom center, etc.
    if (guiders._offsetNameMapping[myGuider.position]) {
      // As an alternative to the clock model, you can also use keywords to position the guider.
      myGuider.position = guiders._offsetNameMapping[myGuider.position];
    }
    
    var attachToHeight = attachTo.innerHeight();
    var attachToWidth = attachTo.innerWidth();  
    var bufferOffset = 0.9 * guiders._arrowSize;
    
    // offsetMap follows the form: [height, width]
    var offsetMap = {
      1: [-bufferOffset - myHeight, attachToWidth - myWidth],
      2: [0, bufferOffset + attachToWidth],
      3: [attachToHeight/2 - myHeight/2, bufferOffset + attachToWidth],
      4: [attachToHeight - myHeight, bufferOffset + attachToWidth],
      5: [bufferOffset + attachToHeight, attachToWidth - myWidth],
      6: [bufferOffset + attachToHeight, attachToWidth/2 - myWidth/2],
      7: [bufferOffset + attachToHeight, 0],
      8: [attachToHeight - myHeight, -myWidth - bufferOffset],
      9: [attachToHeight/2 - myHeight/2, -myWidth - bufferOffset],
      10: [0, -myWidth - bufferOffset],
      11: [-bufferOffset - myHeight, 0],
      12: [-bufferOffset - myHeight, attachToWidth/2 - myWidth/2]
    };
    
    var offset = offsetMap[myGuider.position];
    top += offset[0];
    left += offset[1];
    
    var positionType = "absolute";
    // If the element you are attaching to is position: fixed, then we will make the guider
    // position: fixed as well.
    if (attachTo.css("position") === "fixed" && guiders._fixedOrAbsolute === "fixed") {
      positionType = "fixed";
      top -= $(window).scrollTop();
      left -= $(window).scrollLeft();
    }
    
    // If you specify an additional offset parameter when you create the guider, it gets added here.
    if (myGuider.offset.top !== null) {
      top += myGuider.offset.top;
    }
    if (myGuider.offset.left !== null) {
      left += myGuider.offset.left;
    }
    
    guiders._styleArrow(myGuider);
    
    // Finally, set the style of the guider and return it!
    myGuider.elem.css({
      "position": positionType,
      "top": top,
      "left": left
    });
    
    return myGuider;
  };

  guiders._guiderById = function(id) {
    if (typeof guiders._guiders[id] === "undefined") {
      throw "Cannot find guider with id " + id;
    }
    return guiders._guiders[id];
  };

  guiders._showOverlay = function() {
    // This callback is needed to fix an IE opacity bug.
    // See also:
    // http://www.kevinleary.net/jquery-fadein-fadeout-problems-in-internet-explorer/
    $("#guiders_overlay").fadeIn("fast", function(){
      if (this.style.removeAttribute) {
        this.style.removeAttribute("filter");
      }
    });
    if (guiders._isIE) {
      $("#guiders_overlay").css("position", "absolute");
    }
  };

  guiders._highlightElement = function(selector) {
    $(selector).addClass('guiders_highlight');
  };

  guiders._dehighlightElement = function(selector) {
    $(selector).removeClass('guiders_highlight');
  };

  guiders._hideOverlay = function() {
    $("#guiders_overlay").fadeOut("fast");
  };

  guiders._initializeOverlay = function() {
    if ($("#guiders_overlay").length === 0) {
      $("<div id='guiders_overlay'></div>").hide().appendTo("body");
    }
  };

  guiders._styleArrow = function(myGuider) {
    var position = myGuider.position || 0;
    if (!position) {
      return;
    }
    var myGuiderArrow = $(myGuider.elem.find(".guiders_arrow"));
    var newClass = {
      1: "guiders_arrow_down",
      2: "guiders_arrow_left",
      3: "guiders_arrow_left",
      4: "guiders_arrow_left",
      5: "guiders_arrow_up",
      6: "guiders_arrow_up",
      7: "guiders_arrow_up",
      8: "guiders_arrow_right",
      9: "guiders_arrow_right",
      10: "guiders_arrow_right",
      11: "guiders_arrow_down",
      12: "guiders_arrow_down"
    };
    myGuiderArrow.addClass(newClass[position]);
  
    var myHeight = myGuider.elem.innerHeight();
    var myWidth = myGuider.elem.innerWidth();
    var arrowOffset = guiders._arrowSize / 2;
    var positionMap = {
      1: ["right", arrowOffset],
      2: ["top", arrowOffset],
      3: ["top", myHeight/2 - arrowOffset],
      4: ["bottom", arrowOffset],
      5: ["right", arrowOffset],
      6: ["left", myWidth/2 - arrowOffset],
      7: ["left", arrowOffset],
      8: ["bottom", arrowOffset],
      9: ["top", myHeight/2 - arrowOffset],
      10: ["top", arrowOffset],
      11: ["left", arrowOffset],
      12: ["left", myWidth/2 - arrowOffset]
    };
    var position = positionMap[myGuider.position];
    myGuiderArrow.css(position[0], position[1] + "px");
  };

  /**
   * One way to show a guider to new users is to direct new users to a URL such as
   * http://www.mysite.com/myapp#guider=welcome
   *
   * This can also be used to run guiders on multiple pages, by redirecting from
   * one page to another, with the guider id in the hash tag.
   *
   * Alternatively, if you use a session variable or flash messages after sign up,
   * you can add selectively add JavaScript to the page: "guiders.show('first');"
   */
  guiders._showIfHashed = function(myGuider) {
    var GUIDER_HASH_TAG = "guider=";
    var hashIndex = window.location.hash.indexOf(GUIDER_HASH_TAG);
    if (hashIndex !== -1) {
      var hashGuiderId = window.location.hash.substr(hashIndex + GUIDER_HASH_TAG.length);
      if (myGuider.id.toLowerCase() === hashGuiderId.toLowerCase()) {
        guiders.show(myGuider.id);
      }
    }
  };

  guiders.reposition = function() {
    var currentGuider = guiders._guiders[guiders._currentGuiderID];
    guiders._attach(currentGuider);
  };
  
  guiders.next = function() {
    var currentGuider = guiders._guiders[guiders._currentGuiderID];
    if (typeof currentGuider === "undefined") {
      return;
    }
    currentGuider.elem.data("locked", true);

    var nextGuiderId = currentGuider.next || null;
    if (nextGuiderId !== null && nextGuiderId !== "") {
      var nextGuider = guiders._guiderById(nextGuiderId);
      var omitHidingOverlay = nextGuider.overlay ? true : false;
      guiders.hideAll(omitHidingOverlay, true);
      if (currentGuider && currentGuider.highlight) {
        guiders._dehighlightElement(currentGuider.highlight);
      }
      if (nextGuider.shouldSkip && nextGuider.shouldSkip()) {
        guiders._currentGuiderID = nextGuider.id;
        guiders.next();
        return;
      }
      else {
        guiders.show(nextGuiderId);
      }
    }
  };

  guiders.prev = function () {
    var currentGuider = guiders._guiders[guiders._currentGuiderID];
    if (typeof currentGuider === "undefined") {
      // not what we think it is
      return;
    }
    if (currentGuider.prev === null) {
      // no previous to look at
      return;
    }
  
    var prevGuider = guiders._guiders[currentGuider.prev];
    prevGuider.elem.data("locked", true);
    
    // Note we use prevGuider.id as "prevGuider" is _already_ looking at the previous guider
    var prevGuiderId = prevGuider.id || null;
    if (prevGuiderId !== null && prevGuiderId !== "") {
      var myGuider = guiders._guiderById(prevGuiderId);
      var omitHidingOverlay = myGuider.overlay ? true : false;
      guiders.hideAll(omitHidingOverlay, true);
      if (prevGuider && prevGuider.highlight) {
        guiders._dehighlightElement(prevGuider.highlight);
      }
      guiders.show(prevGuiderId);
    }
  };

  guiders.createGuider = function(passedSettings) {
    if (passedSettings === null || passedSettings === undefined) {
      passedSettings = {};
    }
    
    // Extend those settings with passedSettings
    myGuider = $.extend({}, guiders._defaultSettings, passedSettings);
    myGuider.id = myGuider.id || String(Math.floor(Math.random() * 1000));
    
    var guiderElement = $(guiders._htmlSkeleton);
    myGuider.elem = guiderElement;
    if (typeof myGuider.classString !== "undefined" && myGuider.classString !== null) {
      myGuider.elem.addClass(myGuider.classString);
    }
    myGuider.elem.css("width", myGuider.width + "px");
    
    var guiderTitleContainer = guiderElement.find(".guiders_title");
    guiderTitleContainer.html(myGuider.title);
    
    guiderElement.find(".guiders_description").html(myGuider.description);
    
    guiders._addButtons(myGuider);
    
    if (myGuider.xButton) {
        guiders._addXButton(myGuider);
    }
    
    guiderElement.hide();
    guiderElement.appendTo("body");
    guiderElement.attr("id", myGuider.id);
    
    // Ensure myGuider.attachTo is a jQuery element.
    if (typeof myGuider.attachTo !== "undefined" && myGuider !== null) {
      guiders._attach(myGuider);
    }
    
    guiders._initializeOverlay();
    
    guiders._guiders[myGuider.id] = myGuider;
    if (guiders._lastCreatedGuiderID != null) {
      myGuider.prev = guiders._lastCreatedGuiderID;
    }
    guiders._lastCreatedGuiderID = myGuider.id;
    
    /**
     * If the URL of the current window is of the form
     * http://www.myurl.com/mypage.html#guider=id
     * then show this guider.
     */
    if (myGuider.isHashable) {
      guiders._showIfHashed(myGuider);
    }
    
    return guiders;
  }; 

  guiders.hideAll = function(omitHidingOverlay, next) {
    next = next || false;

    $(".guider:visible").each(function(index, elem){
      var myGuider = guiders._guiderById($(elem).attr('id'));
      if (myGuider.onHide) {
        myGuider.onHide(myGuider, next);
      }
    });
    $(".guider").fadeOut("fast");
    var currentGuider = guiders._guiders[guiders._currentGuiderID];
    if (currentGuider && currentGuider.highlight) {
    	guiders._dehighlightElement(currentGuider.highlight);
    }
    if (typeof omitHidingOverlay !== "undefined" && omitHidingOverlay === true) {
      // do nothing for now
    } else {
      guiders._hideOverlay();
    }
    return guiders;
  };

  guiders.show = function(id) {
    if (!id && guiders._lastCreatedGuiderID) {
      id = guiders._lastCreatedGuiderID;
    }
  
    var myGuider = guiders._guiderById(id);
    if (myGuider.overlay) {
      guiders._showOverlay();
      // if guider is attached to an element, make sure it's visible
      if (myGuider.highlight) {
        guiders._highlightElement(myGuider.highlight);
      }
    }
    
    if (myGuider.closeOnEscape) {
      guiders._wireEscape(myGuider);
    } else {
      guiders._unWireEscape(myGuider);
    }
  
    // You can use an onShow function to take some action before the guider is shown.
    if (myGuider.onShow) {
      myGuider.onShow(myGuider);
    }
    guiders._attach(myGuider);
    myGuider.elem.fadeIn("fast").data("locked", false);
      
    guiders._currentGuiderID = id;
    
    var windowHeight = guiders._windowHeight = $(window).height();
    var scrollHeight = $(window).scrollTop();
    var guiderOffset = myGuider.elem.offset();
    var guiderElemHeight = myGuider.elem.height();
    
    var isGuiderBelow = (scrollHeight + windowHeight < guiderOffset.top + guiderElemHeight); /* we will need to scroll down */
    var isGuiderAbove = (guiderOffset.top < scrollHeight); /* we will need to scroll up */
    
    if (myGuider.autoFocus && (isGuiderBelow || isGuiderAbove)) {
      // Sometimes the browser won't scroll if the person just clicked,
      // so let's do this in a setTimeout.
      setTimeout(guiders.scrollToCurrent, 10);
    }
    
    $(myGuider.elem).trigger("guiders.show");

    return guiders;
  };
  
  guiders.scrollToCurrent = function() {
    var currentGuider = guiders._guiders[guiders._currentGuiderID];
    if (typeof currentGuider === "undefined") {
      return;
    }
    
    var windowHeight = guiders._windowHeight;
    var scrollHeight = $(window).scrollTop();
    var guiderOffset = currentGuider.elem.offset();
    var guiderElemHeight = currentGuider.elem.height();
    
    // Scroll to the guider's position.
    var scrollToHeight = Math.round(Math.max(guiderOffset.top + (guiderElemHeight / 2) - (windowHeight / 2), 0));
    window.scrollTo(0, scrollToHeight);
  };
  
  // Change the bubble position after browser gets resized
  var _resizing = undefined;
  $(window).resize(function() {
    if (typeof(_resizing) !== "undefined") {
      clearTimeout(_resizing); // Prevents seizures
    }
    _resizing = setTimeout(function() {
      _resizing = undefined;
      if (typeof (guiders) !== "undefined") {
        guiders.reposition();
      }
    }, 20);
  });
  
  return guiders;
}).call(this, jQuery);

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
jQuery.timeago.settings.allowFuture=true;
angular.module("shinyTrain",["ngCookies","pdate","ui.bootstrap","timeago"])
.config(['$locationProvider',function ($locationProvider) {
       $locationProvider.html5Mode(true).hashPrefix('!');
}])
.factory('UserService',['$cookies',function($cookies) {
    var UserService = {
            user:  {name : ''}
    };
    
    UserService.user.name = $cookies.user || "";
    UserService.signIn = function(newName) {
       $cookies.user= newName;
       UserService.user.name=newName;
   }
   UserService.signOut = function() {
       UserService.user.name="";
       $cookies.user="";
   }
   
    UserService.isLoggedIn = function() {
        return !(UserService.user.name == "" || !UserService.user.name);
    }    
    UserService.usrname = function() {return UserService.user.name}
    
    return UserService;
}]) ;
    


var ShinyCtrl=function($scope,$http,$cookies,$log,$location,UserService) {
   $scope.tid = "next";
   if("tid" in $location.search()) { $scope.tid = $location.search().tid};
  
   function hasVote() {
        if(!UserService.isLoggedIn()) return false;
        myVote = $.grep($scope.votes,function(v) { return v.name == UserService.user.name});
        
        if (myVote.length > 0) {
            $scope.myVote = myVote[0];
            return true;
        } else {
            return false;
        }
            
    }
    
     $scope.addCmt = function() {
         var newComment = {"autor" : UserService.user.name, "msg" : $scope.curCmt };
         if (!UserService.isLoggedIn()) {
             $scope.addAlert("Bitte erst Namen eingeben","warn");
         } else {
            $log.log("Adding Comment " + $scope.curCmt + " from " + UserService.user.name);
            $http.post("/res/trainings/" + $scope.tid + "/comments", newComment)
                    .error(function(data) {
                        $log.log("Fehler: " + data);
                        $scope.addAlert("Fehler beim Kommentar eintragen!");
                    })
                    .success(function(data) {
                         $log.log("OK!");
                         $scope.addAlert("Kommentar eingetragen!","success");
                         $scope.comments.unshift(data);
                    });
         }
    }
   
   $scope.updateVotes = function() {
        var nocache= Math.random(); //HACK for IE ajax caching
        $http.get("/res/trainings/" + $scope.tid + "/votes?nocache=" + nocache).success(function(data) {
            $scope.votes=data; 
            $scope.voted = hasVote();
        });
        $http.get("/res/trainings/" + $scope.tid + "/details").success(function(data) {$scope.details=data;});
    }
    
    $scope.revote = function() {
         $log.log("revoting to " + $scope.myVote.vid);
         $log.log("Usr is |" + UserService.user.name + "| -> empty:" + (UserService.user.name == "" || !UserService.user.name) );
         if (!UserService.isLoggedIn()) {
             $scope.addAlert("Bitte erst Namen eingeben","warn");
         } else {
         $scope.myVote.name=UserService.user.name;
         //angular.extend($scope.myVote,$scope.myVote.name,{"name" : $scope.usrname});
         $http.post("/res/trainings/" + $scope.tid + "/votes", $scope.myVote)
                    .error(function(data) {
                        $log.log("Fehler: " + data);
                        $scope.addAlert("Fehler beim Abstimmung eintragen!");
                    })
                    .success(function(data) {
                        $log.log("OK!");
                        $scope.addAlert("Abstimmung eingetragen!","success");
                        $scope.updateVotes();
                    });
         }
    }
    
    //Alert handling
   $scope.alerts = [];

    $scope.addAlert = function(msg,type) {
        if(!type || type=="") 
            type='error';
        $scope.alerts.push({
            "msg" : msg,
            "type" : type
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    
   //load data 
   $log.log("loading " + $scope.tid);
   $http.get("/res/votetypes").success(function(data) {$scope.votetypes=data;}); 
   $http.get("/res/users").success(function(data) {$scope.unames=data;});
   $http.get("/res/trainings/" + $scope.tid + "/comments").success(function(data) {$scope.comments=data;});   
   //$http.get("/res/trainings/" + $scope.tid + "/stats").success(function(data) {$scope.stats=data;});   
   $http.get("/res/trainings/" + $scope.tid + "/details").success(function(data) {$scope.details=data;});
   $scope.updateVotes();
   
   
   
   //expose user service
   $scope.user = UserService.user;
   $scope.signOut = UserService.signOut;
   $scope.signIn =      UserService.signIn;
   $scope.$watch('user.name', function(nV,oV) {
      if(nV)$log.log("username changed to " + nV.name);
      $scope.nameKnown = UserService.isLoggedIn();
      $scope.updateVotes();
   });
   

};
ShinyCtrl.$inject = ['$scope','$http','$cookies','$log','$location','UserService'];

var OverviewCtrl=function($scope,$http,$window,$log,UserService) {
   $http.get("/res/trainings/next/details").success(function(data) {$scope.details=data;});
   $http.get("/res/users").success(function(data) {$scope.unames=data;});
   $http.get("/res/soon/5").success(function(data) {$scope.soon=data;});
   
   //switch to event
   $scope.gotoEvt = function(tid) {
       $log.log("switching to " + tid);
       $window.location.href = "event.html?tid=" + tid;
   }
   
   //shoutbox
   $scope.updateShouts = function() {
        $http.get("/res/shouts/5").success(function(data) {$scope.shouts=data;});
   }
   $scope.updateShouts();
   
   $scope.addShout = function(msg) {
       var newShout = {"autor" : UserService.user.name, "msg" : msg };
         if (!UserService.isLoggedIn()) {
             $scope.addAlert("Bitte erst Namen eingeben","warn");
         } else {
            $log.log("Adding Shout " + msg + " from " + UserService.user.name);
            $http.post("/res/shouts", newShout)
                    .error(function(data) {
                        $log.log("Fehler: " + data);
                        $scope.addAlert("Fehler beim Shoutboxeintrag!");
                    })
                    .success(function(data) {
                         $log.log("OK!");
                         $scope.addAlert("eingetragen!","success");
                         $scope.shouts.unshift(newShout);
                    });
         }
   }
   
       //Alert handling
   $scope.alerts = [];

    $scope.addAlert = function(msg,type) {
        if(!type || type=="") 
            type='error';
        $scope.alerts.push({
            "msg" : msg,
            "type" : type
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
   
   //expose user service
   $scope.user = UserService.user;
   $scope.signOut = UserService.signOut;
   $scope.signIn =      UserService.signIn;
   $scope.$watch('user.name', function(nV,oV) {
      if(nV)$log.log("username changed to " + nV.name);
      $scope.nameKnown = UserService.isLoggedIn();
   });
   
};
OverviewCtrl.$inject= ['$scope','$http','$window','$log','UserService'];