<!DOCTYPE html>
<html ng-app="">

<head>
<meta charset="utf-8">
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular.min.js" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
<link href="http://code.jquery.com/ui/1.9.2/themes/vader/jquery-ui.css" media="all" rel="stylesheet" type="text/css" />
<script src="http://code.jquery.com/ui/1.9.2/jquery-ui.min.js" type="text/javascript"></script>
<script type="text/javascript">
        var tid=<?= $_REQUEST["tid"]?>;
        </script>
<script src="controllers.js"></script>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<title>T2</title>
<style type="text/css">
.players {
	float: left;
	width: 50%;
}
.comments {
	margin: 0px 0px 0px 50%;
	overflow: auto;
}
</style>
</head>

<body ng-controller="TrainCtrl">

<div class="ui-widget ui-corner-all">
<header class="ui-widget-header">
	T at <?= $_REQUEST["tid"]?>
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
		<td>{{vote.time}}</td>
	</tr>
</table>
<div class="comments ui-corner-all">
	<div class="ui-widget-header">Kommentare</div>
	<div class="ui-widget-content" ng-repeat="comment in comments">{{comment.autor}} 
	({{comment.time}}):<br />
	{{comment.msg}}</div>
</div>
</div>
</body>

</html>
