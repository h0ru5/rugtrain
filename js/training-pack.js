/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 0.11.4
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2012, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */
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
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {"DATETIME_FORMATS":{"MONTH":["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],"SHORTMONTH":["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],"DAY":["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],"SHORTDAY":["So.","Mo.","Di.","Mi.","Do.","Fr.","Sa."],"AMPMS":["vorm.","nachm."],"medium":"dd.MM.yyyy HH:mm:ss","short":"dd.MM.yy HH:mm","fullDate":"EEEE, d. MMMM y","longDate":"d. MMMM y","mediumDate":"dd.MM.yyyy","shortDate":"dd.MM.yy","mediumTime":"HH:mm:ss","shortTime":"HH:mm"},"NUMBER_FORMATS":{"DECIMAL_SEP":",","GROUP_SEP":".","PATTERNS":[{"minInt":1,"minFrac":0,"macFrac":0,"posPre":"","posSuf":"","negPre":"-","negSuf":"","gSize":3,"lgSize":3,"maxFrac":3},{"minInt":1,"minFrac":2,"macFrac":0,"posPre":"","posSuf":" \u00A4","negPre":"-","negSuf":" \u00A4","gSize":3,"lgSize":3,"maxFrac":2}],"CURRENCY_SYM":"€"},"pluralCat":function (n) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;},"id":"de"});
}]);/**
 * AngularUI - The companion suite for AngularJS
 * @version v0.3.2 - 2012-12-04
 * @link http://angular-ui.github.com
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module("ui.config",[]).value("ui.config",{}),angular.module("ui.filters",["ui.config"]),angular.module("ui.directives",["ui.config"]),angular.module("ui",["ui.filters","ui.directives","ui.config"]),angular.module("ui.directives").directive("uiSortable",["ui.config",function(e){var t;return t={},e.sortable!=null&&angular.extend(t,e.sortable),{require:"?ngModel",link:function(e,n,r,i){var s,o,u,a,f;return u=angular.extend({},t,e.$eval(r.uiOptions)),i!=null&&(s=function(e,t){return t.item.data("ui-sortable-start",t.item.index())},o=function(t,n){var r,s;return s=n.item.data("ui-sortable-start"),r=n.item.index(),i.$modelValue.splice(r,0,i.$modelValue.splice(s,1)[0]),e.$apply()},a=u.start,u.start=function(t,n){return s(t,n),typeof a=="function"&&a(t,n),e.$apply()},f=u.update,u.update=function(t,n){return o(t,n),typeof f=="function"&&f(t,n),e.$apply()}),n.sortable(u)}}}]),angular.module("ui.directives").directive("uiJq",["ui.config",function(e){return{restrict:"A",compile:function(t,n){if(!angular.isFunction(t[n.uiJq]))throw new Error('ui-jq: The "'+n.uiJq+'" function does not exist');var r=e.jq&&e.jq[n.uiJq];return function(e,t,n){var i=[],s="change";n.uiOptions?(i=e.$eval("["+n.uiOptions+"]"),angular.isObject(r)&&angular.isObject(i[0])&&(i[0]=angular.extend(r,i[0]))):r&&(i=[r]),n.ngModel&&t.is("select,input,textarea")&&(i&&angular.isObject(i[0])&&i[0].ngChange!==undefined&&(s=i[0].ngChange),s&&t.on(s,function(){t.trigger("input")})),t[n.uiJq].apply(t,i)}}}}]),angular.module("ui.directives").directive("uiEvent",["$parse",function(e){return function(t,n,r){var i=t.$eval(r.uiEvent);angular.forEach(i,function(r,i){var s=e(r);n.bind(i,function(e){var n=Array.prototype.slice.call(arguments);n=n.splice(1),t.$apply(function(){s(t,{$event:e,$params:n})})})})}}]),angular.module("ui.directives").directive("uiMask",[function(){return{require:"ngModel",link:function(e,t,n,r){r.$render=function(){var i=r.$viewValue||"";t.val(i),t.mask(e.$eval(n.uiMask))},r.$parsers.push(function(e){var n=t.isMaskValid()||angular.isUndefined(t.isMaskValid())&&t.val().length>0;return r.$setValidity("mask",n),n?e:undefined}),t.bind("keyup",function(){e.$apply(function(){r.$setViewValue(t.mask())})})}}}]),angular.module("ui.directives").directive("uiModal",["$timeout",function(e){return{restrict:"EAC",require:"ngModel",link:function(t,n,r,i){n.addClass("modal hide"),n.on("shown",function(){n.find("[autofocus]").focus()}),t.$watch(r.ngModel,function(e){n.modal(e&&"show"||"hide")}),n.on(jQuery.support.transition&&"shown"||"show",function(){e(function(){i.$setViewValue(!0)})}),n.on(jQuery.support.transition&&"hidden"||"hide",function(){e(function(){i.$setViewValue(!1)})})}}}]),angular.module("ui.directives").directive("uiReset",["ui.config",function(e){var t=null;return e.reset!==undefined&&(t=e.reset),{require:"ngModel",link:function(e,n,r,i){var s;s=angular.element('<a class="ui-reset" />'),n.wrap('<span class="ui-resetwrap" />').after(s),s.bind("click",function(n){n.preventDefault(),e.$apply(function(){r.uiReset?i.$setViewValue(e.$eval(r.uiReset)):i.$setViewValue(t),i.$render()})})}}}]),function(){function t(e,t,n,r){angular.forEach(t.split(" "),function(t){var i={type:"map-"+t};google.maps.event.addListener(n,t,function(t){r.trigger(angular.extend({},i,t)),e.$$phase||e.$apply()})})}function n(n,r){e.directive(n,[function(){return{restrict:"A",link:function(e,i,s){e.$watch(s[n],function(n){t(e,r,n,i)})}}}])}var e=angular.module("ui.directives");e.directive("uiMap",["ui.config","$parse",function(e,n){var r="bounds_changed center_changed click dblclick drag dragend dragstart heading_changed idle maptypeid_changed mousemove mouseout mouseover projection_changed resize rightclick tilesloaded tilt_changed zoom_changed",i=e.map||{};return{restrict:"A",link:function(e,s,o){var u=angular.extend({},i,e.$eval(o.uiOptions)),a=new google.maps.Map(s[0],u),f=n(o.uiMap);f.assign(e,a),t(e,r,a,s)}}}]),e.directive("uiMapInfoWindow",["ui.config","$parse","$compile",function(e,n,r){var i="closeclick content_change domready position_changed zindex_changed",s=e.mapInfoWindow||{};return{link:function(e,o,u){var a=angular.extend({},s,e.$eval(u.uiOptions));a.content=o[0];var f=n(u.uiMapInfoWindow),l=f(e);l||(l=new google.maps.InfoWindow(a),f.assign(e,l)),t(e,i,l,o),o.replaceWith("<div></div>");var c=l.open;l.open=function(n,i,s,u,a,f){r(o.contents())(e),c.call(l,n,i,s,u,a,f)}}}}]),n("uiMapMarker","animation_changed click clickable_changed cursor_changed dblclick drag dragend draggable_changed dragstart flat_changed icon_changed mousedown mouseout mouseover mouseup position_changed rightclick shadow_changed shape_changed title_changed visible_changed zindex_changed"),n("uiMapPolyline","click dblclick mousedown mousemove mouseout mouseover mouseup rightclick"),n("uiMapPolygon","click dblclick mousedown mousemove mouseout mouseover mouseup rightclick"),n("uiMapRectangle","bounds_changed click dblclick mousedown mousemove mouseout mouseover mouseup rightclick"),n("uiMapCircle","center_changed click dblclick mousedown mousemove mouseout mouseover mouseup radius_changed rightclick"),n("uiMapGroundOverlay","click dblclick")}(),angular.module("ui.directives").factory("keypressHelper",["$parse",function(t){var n={8:"backspace",9:"tab",13:"enter",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"delete"},r=function(e){return e.charAt(0).toUpperCase()+e.slice(1)};return function(e,i,s,o){var u,a=[];u=i.$eval(o["ui"+r(e)]),angular.forEach(u,function(e,n){var r,i;i=t(e),angular.forEach(n.split(" "),function(e){r={expression:i,keys:{}},angular.forEach(e.split("-"),function(e){r.keys[e]=!0}),a.push(r)})}),s.bind(e,function(t){var r=t.metaKey||t.altKey,s=t.ctrlKey,o=t.shiftKey,u=t.keyCode;e==="keypress"&&!o&&u>=97&&u<=122&&(u-=32),angular.forEach(a,function(e){var u=e.keys[n[t.keyCode]]||e.keys[t.keyCode.toString()]||!1,a=e.keys.alt||!1,f=e.keys.ctrl||!1,l=e.keys.shift||!1;u&&a==r&&f==s&&l==o&&i.$apply(function(){e.expression(i,{$event:t})})})})}}]),angular.module("ui.directives").directive("uiKeydown",["keypressHelper",function(e){return{link:function(t,n,r){e("keydown",t,n,r)}}}]),angular.module("ui.directives").directive("uiKeypress",["keypressHelper",function(e){return{link:function(t,n,r){e("keypress",t,n,r)}}}]),angular.module("ui.directives").directive("uiKeyup",["keypressHelper",function(e){return{link:function(t,n,r){e("keyup",t,n,r)}}}]),angular.module("ui.directives").directive("uiValidate",function(){return{restrict:"A",require:"ngModel",link:function(e,t,n,r){var i,s=n.uiValidate;s=e.$eval(s);if(!s)return;angular.isFunction(s)&&(s={validator:s}),angular.forEach(s,function(e,t){i=function(n){return e(n)?(r.$setValidity(t,!0),n):(r.$setValidity(t,!1),undefined)},r.$formatters.push(i),r.$parsers.push(i)})}}}),angular.module("ui.directives").directive("uiAnimate",["ui.config","$timeout",function(e,t){var n={};return angular.isString(e.animate)?n["class"]=e.animate:e.animate&&(n=e.animate),{restrict:"A",link:function(e,r,i){var s={};i.uiAnimate&&(s=e.$eval(i.uiAnimate),angular.isString(s)&&(s={"class":s})),s=angular.extend({"class":"ui-animate"},n,s),r.addClass(s["class"]),t(function(){r.removeClass(s["class"])},20,!1)}}}]),angular.module("ui.directives").directive("uiSelect2",["ui.config","$http",function(e,t){var n={};return e.select2&&angular.extend(n,e.select2),{require:"?ngModel",compile:function(e,t){var r,i,s,o=e.is("select"),u=t.multiple!==undefined;return e.is("select")&&(i=e.find("option[ng-repeat], option[data-ng-repeat]"),i.length&&(s=i.attr("ng-repeat")||i.attr("data-ng-repeat"),r=jQuery.trim(s.split("|")[0]).split(" ").pop())),function(e,t,i,s){var a=angular.extend({},n,e.$eval(i.uiSelect2));o?(delete a.multiple,delete a.initSelection):u&&(a.multiple=!0);if(s){s.$render=function(){o?t.select2("val",s.$modelValue):u&&!s.$modelValue?t.select2("data",[]):t.select2("data",s.$modelValue)},r&&e.$watch(r,function(e,n,r){if(!e)return;setTimeout(function(){t.select2("val",s.$viewValue),t.trigger("change")})});if(!o){t.bind("change",function(){e.$apply(function(){s.$setViewValue(t.select2("data"))})});if(a.initSelection){var f=a.initSelection;a.initSelection=function(e,t){f(e,function(e){s.$setViewValue(e),t(e)})}}}}i.$observe("disabled",function(e){t.select2(e&&"disable"||"enable")}),e.$watch(i.ngMultiple,function(e){t.select2(a)}),t.val(e.$eval(i.ngModel)),setTimeout(function(){t.select2(a)})}}}}]),angular.module("ui.directives").directive("uiCodemirror",["ui.config","$parse",function(e,t){"use strict";return e.codemirror=e.codemirror||{},{require:"ngModel",link:function(n,r,i,s){if(!r.is("textarea"))throw new Error("ui-codemirror can only be applied to a textarea element");var o,u=t(i.uiCodemirror),a=function(e){var t=e.getValue();t!==s.$viewValue&&(s.$setViewValue(t),n.$apply())},f=function(t){t=angular.extend({},t,e.codemirror);var n=t.onChange;n?t.onChange=function(e){a(e),n(e)}:t.onChange=a,o&&o.toTextArea(),o=CodeMirror.fromTextArea(r[0],t)};f(u()),n.$watch(u,f,!0),s.$formatters.push(function(e){if(angular.isUndefined(e)||e===null)return"";if(angular.isObject(e)||angular.isArray(e))throw new Error("ui-codemirror cannot use an object or an array as a model");return e}),s.$render=function(){o.setValue(s.$viewValue)}}}}]),angular.module("ui.directives").directive("uiTinymce",["ui.config",function(e){return e.tinymce=e.tinymce||{},{require:"ngModel",link:function(t,n,r,i){var s,o={onchange_callback:function(e){e.isDirty()&&(e.save(),i.$setViewValue(n.val()),t.$$phase||t.$apply())},handle_event_callback:function(e){return this.isDirty()&&(this.save(),i.$setViewValue(n.val()),t.$$phase||t.$apply()),!0},setup:function(e){e.onSetContent.add(function(e,r){e.isDirty()&&(e.save(),i.$setViewValue(n.val()),t.$$phase||t.$apply())})}};r.uiTinymce?s=t.$eval(r.uiTinymce):s={},angular.extend(o,e.tinymce,s),setTimeout(function(){n.tinymce(o)})}}}]),angular.module("ui.directives").directive("uiIf",[function(){return{transclude:"element",priority:1e3,terminal:!0,restrict:"A",compile:function(e,t,n){return function(e,t,r){t[0].doNotMove=!0;var i=r.uiIf,s,o;e.$watch(i,function(r){s&&(s.remove(),s=null),o&&(o.$destroy(),o=null),r&&(o=e.$new(),n(o,function(e){s=e,t.after(e)})),t.parent().trigger("$childrenChanged")})}}}}]),angular.module("ui.directives").directive("uiScrollfix",["$window",function(e){"use strict";return{link:function(t,n,r){var i=n.offset().top;r.uiScrollfix?r.uiScrollfix.charAt(0)==="-"?r.uiScrollfix=i-r.uiScrollfix.substr(1):r.uiScrollfix.charAt(0)==="+"&&(r.uiScrollfix=i+parseFloat(r.uiScrollfix.substr(1))):r.uiScrollfix=i,angular.element(e).on("scroll.ui-scrollfix",function(){var t;if(angular.isDefined(e.pageYOffset))t=e.pageYOffset;else{var i=document.compatMode&&document.compatMode!=="BackCompat"?document.documentElement:document.body;t=i.scrollTop}!n.hasClass("ui-scrollfix")&&t>r.uiScrollfix?n.addClass("ui-scrollfix"):n.hasClass("ui-scrollfix")&&t<r.uiScrollfix&&n.removeClass("ui-scrollfix")})}}}]),angular.module("ui.directives").directive("uiCalendar",["ui.config","$parse",function(e,t){return e.uiCalendar=e.uiCalendar||{},{require:"ngModel",restrict:"A",scope:{events:"=ngModel"},link:function(n,r,i){function o(){var t,s={header:{left:"prev,next today",center:"title",right:"month,agendaWeek,agendaDay"},eventMouseover:function(e,t,n){n.name!=="agendaDay"&&$(t.target).attr("title",e.title)},events:n.events};i.uiCalendar?t=n.$eval(i.uiCalendar):t={},angular.extend(s,e.uiCalendar,t),r.html("").fullCalendar(s)}var s=t(i.ngModel);o(),n.$watch("events.length",function(e,t){o()},!0)}}}]),angular.module("ui.directives").directive("uiShow",[function(){return function(e,t,n){e.$watch(n.uiShow,function(e,n){e?t.addClass("ui-show"):t.removeClass("ui-show")})}}]).directive("uiHide",[function(){return function(e,t,n){e.$watch(n.uiHide,function(e,n){e?t.addClass("ui-hide"):t.removeClass("ui-hide")})}}]).directive("uiToggle",[function(){return function(e,t,n){e.$watch(n.uiToggle,function(e,n){e?t.removeClass("ui-hide").addClass("ui-show"):t.removeClass("ui-show").addClass("ui-hide")})}}]),angular.module("ui.directives").directive("uiCurrency",["ui.config","currencyFilter",function(e,t){var n={pos:"ui-currency-pos",neg:"ui-currency-neg",zero:"ui-currency-zero"};return e.currency&&angular.extend(n,e.currency),{restrict:"EAC",require:"ngModel",link:function(e,r,i,s){var o,u,a;o=angular.extend({},n,e.$eval(i.uiCurrency)),u=function(e){var n;return n=e*1,n>0?r.addClass(o.pos):r.removeClass(o.pos),n<0?r.addClass(o.neg):r.removeClass(o.neg),n===0?r.addClass(o.zero):r.removeClass(o.zero),e===""?r.text(""):r.text(t(n,o.symbol)),!0},s.$render=function(){a=s.$viewValue,r.val(a),u(a)}}}}]),angular.module("ui.directives").directive("uiDate",["ui.config",function(e){"use strict";var t;return t={},angular.isObject(e.date)&&angular.extend(t,e.date),{require:"?ngModel",link:function(t,n,r,i){var s=function(){return angular.extend({},e.date,t.$eval(r.uiDate))},o=function(){var e=s();if(i){var r=function(){t.$apply(function(){var e=n.datepicker("getDate");n.datepicker("setDate",n.val()),i.$setViewValue(e)})};if(e.onSelect){var o=e.onSelect;e.onSelect=function(e,t){return r(),o(e,t)}}else e.onSelect=r;n.bind("change",r),i.$render=function(){var e=i.$viewValue;if(angular.isDefined(e)&&e!==null&&!angular.isDate(e))throw new Error("ng-Model value must be a Date object - currently it is a "+typeof e+" - use ui-date-format to convert it from a string");n.datepicker("setDate",e)}}n.datepicker("destroy"),n.datepicker(e),i.$render()};t.$watch(s,o,!0)}}}]).directive("uiDateFormat",[function(){var e={require:"ngModel",link:function(e,t,n,r){if(n.uiDateFormat==="")r.$formatters.push(function(e){if(angular.isString(e))return new Date(e)}),r.$parsers.push(function(e){if(e)return e.toISOString()});else{var i=n.uiDateFormat;r.$formatters.push(function(e){if(angular.isString(e))return $.datepicker.parseDate(i,e)}),r.$parsers.push(function(e){if(e)return $.datepicker.formatDate(i,e)})}}};return e}]),angular.module("ui.filters").filter("highlight",function(){return function(e,t,n){return t||angular.isNumber(t)?(e=e.toString(),t=t.toString(),n?e.split(t).join('<span class="ui-match">'+t+"</span>"):e.replace(new RegExp(t,"gi"),'<span class="ui-match">$&</span>')):e}}),angular.module("ui.filters").filter("format",function(){return function(e,t){if(!e)return e;var n=e.toString(),r;return t===undefined?n:!angular.isArray(t)&&!angular.isObject(t)?n.split("$0").join(t):(r=angular.isArray(t)&&"$"||":",angular.forEach(t,function(e,t){n=n.split(r+t).join(e)}),n)}}),angular.module("ui.filters").filter("unique",function(){return function(e,t){if(t===!1)return e;if((t||angular.isUndefined(t))&&angular.isArray(e)){var n={},r=[],i=function(e){return angular.isObject(e)&&angular.isString(t)?e[t]:e};angular.forEach(e,function(e){var t,n=!1;for(var s=0;s<r.length;s++)if(angular.equals(i(r[s]),i(e))){n=!0;break}n||r.push(e)}),e=r}return e}}),angular.module("ui.filters").filter("inflector",function(){function e(e){return e.replace(/^([a-z])|\s+([a-z])/g,function(e){return e.toUpperCase()})}function t(e,t){return e.replace(/[A-Z]/g,function(e){return t+e})}var n={humanize:function(n){return e(t(n," ").split("_").join(" "))},underscore:function(e){return e.substr(0,1).toLowerCase()+t(e.substr(1),"_").toLowerCase().split(" ").join("_")},variable:function(t){return t=t.substr(0,1).toLowerCase()+e(t.split("_").join(" ")).substr(1).split(" ").join(""),t}};return function(e,t,r){return t!==!1&&angular.isString(e)?(t=t||"humanize",n[t](e)):e}});// German
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
};/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 0.11.4
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2012, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */
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
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('addButton', []).directive("addButton", 
function($compile) {
        return function(scope, element, attrs) {
        
        if(attrs.addButton.length > 0) {
            caption=attrs.addButton;
        } else {
            caption="Add";
        }
        
        if(attrs.addButtonAction && attrs.addButtonAction.length > 0) {
            action=attrs.addButtonAction;
        } else {
            action="showDlg()";
        }
        
        
        butAdd = $("<button ng-click='"+ action + "'>" + caption + "</button>").button({
            icons: {
                primary: "ui-icon-plusthick"
            }
        });
        butAdd.css('float','right');
        cbut=$compile(butAdd)(scope);
        
       // $(function() {
            child = element.parent().find(".dataTables_filter");
            $(child).append(cbut);
       // });
        
         
   }
});/* 
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

/* Source: http://jsfiddle.net/zdam/7kLFU/
thanks to zadam@jsfiddle

usage:
<div ng-app="tableExample">
    <div ng-controller="Ctrl">   
    
        <table my-table="overrideOptions"
            aa-data="sampleProductCategories"
        ao-column-defs="columnDefs"
        fn-row-callback="myCallback"         >
        
 orig ctrl:
function Ctrl($scope) {

    $scope.message = '';            
    
        $scope.myCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {            
            $('td:eq(2)', nRow).bind('click', function() {
                $scope.$apply(function() {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function(info) {
            $scope.message = 'clicked: '+ info.price;
        };
    
        $scope.columnDefs = [ 
            { "mDataProp": "category", "aTargets":[0]},
            { "mDataProp": "name", "aTargets":[1] },
            { "mDataProp": "price", "aTargets":[2] }
        ]; 
        
             
        $scope.sampleProductCategories = [

              {
                "name": "1948 Porsche 356-A Roadster",
                "price": 53.9,
                  "category": "Classic Cars",
                  "action":"x"
              },
              {
                "name": "1948 Porsche Type 356 Roadster",
                "price": 62.16,
            "category": "Classic Cars",
                  "action":"x"
              },
              {
                "name": "1949 Jaguar XK 120",
                "price": 47.25,
            "category": "Classic Cars",
                  "action":"x"
              }
              ,
              {
                "name": "1936 Harley Davidson El Knucklehead",
                "price": 24.23,
            "category": "Motorcycles",
                  "action":"x"
              },
              {
                "name": "1957 Vespa GS150",
                "price": 32.95,
            "category": "Motorcycles",
                  "action":"x"
              },
              {
                "name": "1960 BSA Gold Star DBD34",
                "price": 37.32,
            "category": "Motorcycles",
                  "action":"x"
              }
           ,
              {
                "name": "1900s Vintage Bi-Plane",
                "price": 34.25,
            "category": "Planes",
                  "action":"x"
              },
              {
                "name": "1900s Vintage Tri-Plane",
                "price": 36.23,
            "category": "Planes",
                  "action":"x"
              },
              {
                "name": "1928 British Royal Navy Airplane",
                "price": 66.74,
            "category": "Planes",
                  "action":"x"
              },
              {
                "name": "1980s Black Hawk Helicopter",
                "price": 77.27,
            "category": "Planes",
                  "action":"x"
              },
              {
                "name": "ATA: B757-300",
                "price": 59.33,
            "category": "Planes",
                  "action":"x"
              }
          
        ];            
            
}​ 
 
 */

angular.module('myTable', []).directive('myTable', function() {
        return function(scope, element, attrs) {

            // apply DataTable options, use defaults if none specified by user
            var options = {};
            if (attrs.myTable.length > 0) {
                options = scope.$eval(attrs.myTable);
            } else {
                options = {
                    "bStateSave": false,
                    "iCookieDuration": 2419200, /* 1 month */
                    "bJQueryUI": true,
                    "bPaginate": false,
                    "bLengthChange": false,
                    "bFilter": true,
                    "bInfo": true,
                    "bDestroy": true,
                    "bDeferRender": true,
                    "bProcessing": true
                };
            }

            // Tell the dataTables plugin what columns to use
            // We can either derive them from the dom, or use setup from the controller           
            var explicitColumns = [];
            element.find('th').each(function(index, elem) {
                explicitColumns.push($(elem).text());
            });
            if (explicitColumns.length > 0) {
                options["aoColumns"] = explicitColumns;
            } else if (attrs.aoColumns) {
                options["aoColumns"] = scope.$eval(attrs.aoColumns);
            }

            // aoColumnDefs is dataTables way of providing fine control over column config
            if (attrs.aoColumnDefs) {
                options["aoColumnDefs"] = scope.$eval(attrs.aoColumnDefs);
            }
            
            if (attrs.fnRowCallback) {
                options["fnRowCallback"] = scope.$eval(attrs.fnRowCallback);
            }
            
            
            
            
            // apply the plugin
            var dataTable = element.dataTable(options);

           
            
            // watch for any changes to our data, rebuild the DataTable
            scope.$watch(attrs.aaData, function(value) {
                var val = value || null;
                if (val) {
                    dataTable.fnClearTable();
                    dataTable.fnAddData(scope.$eval(attrs.aaData));
                }
            });
        };
    });



/* 
 * directive for dialogs using jQuery UI binding 
 */
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
                    scope.$digest();
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
}]);angular.module('pdate', [])
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
});angular.module('timeago', [])
.filter('timeago',function() {
	return function(input,options) {
		return $.timeago(input);
	}
});angular.module("trainSite",["pdate","timeago","jqDialog","ngCookies","jqAutoComplete","jqButton"]);
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