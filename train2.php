<!DOCTYPE html>
<html ng-app="trainSite">

<head>
<meta charset="utf-8">
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
<link href="http://code.jquery.com/ui/1.9.2/themes/black-tie/jquery-ui.css" media="all" rel="stylesheet" type="text/css" />
<script src="http://code.jquery.com/ui/1.9.2/jquery-ui.min.js" type="text/javascript"></script>
<script src="http://timeago.yarp.com/jquery.timeago.js"></script>
<script src="js/lib/jquery.timeago.de.js"></script>
<link href="css/styling.css" rel="stylesheet" type="text/css" />
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular.min.js" type="text/javascript"></script>
<script src="js/ng-modules/pdate.js"></script>
<script src="js/ng-modules/timeago.js"></script>
<script src="js/ng-directives/dialog.js"></script>
<script src="js/controllers/training.js"></script>
<script type="text/javascript">
        var tid=<?= $_REQUEST["tid"]?>;
        $(function() {
        	$(".addButton").button({
        		icons: {
                primary: "ui-icon-plusthick"
            }
        	});
        });
</script>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<title>New Training site</title>
<style type="text/css">
.players {
	float: left;
	width: 50%;
}
.comments {
	margin: 0px 0px 0px 50%;
	overflow: auto;
}
header * {
	text-align: center;
}
.addButton {
	float:right;	
}
.comments .ui-widget-header {
	height:3em;
}
</style>
</head>

<body ng-controller="TrainCtrl">

<div class="ui-widget ui-corner-all">
	<header class="ui-widget-header">
		<h1>{{details.what}} am {{details.when | date: 'dd.MM.yy'}}</h1>
		<p>Ab {{details.when | date: 'HH:mm'}}, {{details.where}}</p>
	</header>
	<table class="players ui-corner-all ui-widget ">
		<thead>
			<tr class="ui-widget-header ui-corner-all">
				<th>Name</th>
				<th>Vote</th>
				<th>Zeit</th>
			</tr>
		</thead>
		<tr class="ui-widget-content ui-corner-all" ng-repeat="vote in votes">
			<td>{{vote.name}}</td>
			<td class="v{{vote.vid}}">{{vote.vote}}</td>
			<td>{{vote.time | pdate | timeago}}</td>
		</tr>
	</table>
	<div class="comments ui-corner-all">
		<div class="ui-widget-header">
			Kommentare <button ng-click="dlgState=true" class="addButton">Neu</button></div>
		<div class="ui-widget-content" ng-repeat="comment in comments">
			{{comment.autor}} ({{comment.time | pdate | timeago}}):<br />
			{{comment.msg}}</div>
	</div>
</div>
<div id="diagCmt" dlg-state="dlgState" jq-dialog="" title="Add/Edit Comment">
	<form>
		<fieldset>
		<input type="hidden" name="tid" ng-model="curCmt.tid" />		
		<label for="autor">Autor</label>
		<input id="autor" class="text ui-widget-content ui-corner-all" name="autor" ng-model="curCmt.autor" type="text" />
		<label for="msg">Inhalt</label>
		<textarea id="msg" class="text ui-widget-content ui-corner-all" name="msg" ng-model="curCmt.msg"></textarea>
		</fieldset>
	</form>
</div>
<footer>
	<ul>
		<li ng-repeat="stat in stats">{{stat.vote}}: {{stat.count}}</li>
	</ul>
</footer>

</body>

</html>
