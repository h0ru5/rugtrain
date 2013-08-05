<?
header("Connection:keep-alive",TRUE);
require_once 'const.inc.php'; 
require_once 'functions.inc.php'; 
?>
<!DOCTYPE html>
<html ng-app="trainSite">

    <head>
        <meta charset="utf-8">
            <link href="http://code.jquery.com/ui/1.9.2/themes/smoothness/jquery-ui.css" media="all" rel="stylesheet" type="text/css" />
            <link href="css/styling.css" rel="stylesheet" type="text/css" />

        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <title>New Training site</title>
    </head>

    <body ng-controller="TrainCtrl">
        <div class="ui-widget ui-corner-all">
            <header class="ui-widget-header">
                <a jq-button="home" href="/" style="float: left">zur &Uuml;bersichtseite</a>
                <h1>{{details.what}} am {{details.when | pdate | date: 'EEE dd.MM.yy'}}</h1>
                <p>Ab {{details.when | pdate| date: 'HH:mm'}}, {{details.where}}</p>
            </header>
            <div class="players">
                <div id="stats" class="ui-widget ui-corner-all">
                    <div class="ui-widget-header hoch3">Zusammenfassung:</div>
                    <div class="ui-widget-content">
                    <ul>
                        <li ng-repeat="stat in stats">{{stat.vote}}: {{stat.count}}</li>
                    </ul>
                    </div>
                </div>
                <table class="ui-corner-all ui-widget ">
                    <thead>
                        <tr class="ui-widget-header ui-corner-all hoch3">
                            <th>Name</th>
                            <th>Vote</th>
                            <th>Zeit</th>
                        </tr>
                    </thead>
                    <tbody class="ui-widget-content">
                    <tr class="ui-widget-content ui-corner-all" ng-repeat="vote in votes">
                        <td>{{vote.name}}</td>
                        <td class="v{{vote.vid}}" ng-switch on="vote.name==usrname">
                            <span ng-switch-default>{{votetypes[vote.vid-1].text}}</span>
                            <select id="vote" class="text ui-widget-content ui-corner-all" name="vote" 
                                    ng-model="curVote.vid" ng-options="v.id as v.text for v in votetypes" 
                                    value="curVote.vid" ng-change="revote()" ng-switch-when="true" />

                        </td>
                        <td>{{vote.time | pdate | timeago}}</td>
                    </tr>
                    </tbody>
                </table>
                <div class="ui-widget ui-corner-all" id="VoteForm" ng-show="!voted">
                    <form>
                        <fieldset>
                            <span><!-- I'll buy a beer for anyone who can explain me why this span is needed! if i take it away, the following select will humble-->
                                <label for="usrname">Name</label>
                                <input id="usrname"  class="text ui-widget-content ui-corner-all" name="usrname"
                                       ng-model="curVote.name" value="curVote.name" type="text" jq-auto-complete="unames" />

                            </span>
                            <label for="vote">Vote</label>
                            <select id="vote" class="text ui-widget-content ui-corner-all" name="vote" 
                                    ng-model="curVote.vid" ng-options="v.id as v.text for v in votetypes" 
                                    value="curVote.vid" ng-change="revote()">                            

                            </select>

                        </fieldset>
                    </form>
                </div>
            </div>
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
                    <span><label for="autor">Autor</label>
                        <input id="autor" class="text ui-widget-content ui-corner-all" name="autor" ng-model="curCmt.autor" type="text" jq-auto-complete="unames"/>
                    </span>
                    <label for="msg">Inhalt</label>
                    <textarea id="msg" class="text ui-widget-content ui-corner-all" name="msg" ng-model="curCmt.msg"></textarea>
                </fieldset>
            </form>
        </div>
        <footer>
            <p>
                <a href="retro/<?= $_REQUEST["tid"] ?>">Zur alten Ansicht<!-- for loosers with IE --></a> 
            </p>
        </footer>

    </body>
        <? if ($debugging) { ?>
            <!-- debugging -->
            <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.js" type="text/javascript"></script>
            <script src="http://code.jquery.com/ui/1.9.2/jquery-ui.js" type="text/javascript"></script>
            <script src="http://timeago.yarp.com/jquery.timeago.js"></script>
            <script src="js/lib/jquery.timeago.de.js"></script>
            <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular.js" type="text/javascript"></script>
            <script src="http://cdn.jsdelivr.net/angularjs/1.0.2/i18n/angular-locale_de.js" type="text/javascript"></script>
            <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular-cookies.js" type="text/javascript"></script>
            <script src="js/ng-modules/pdate.js"></script>
            <script src="js/ng-modules/timeago.js"></script>
            <script src="js/ng-directives/autocomplete.js"></script>
            <script src="js/ng-directives/dialog.js"></script>
            <script src="js/ng-directives/jqButton.js"></script>
            <script src="js/controllers/training.js"></script>
        <? } else { #productive ?>
            <!-- productive -->
            <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
            <script src="http://code.jquery.com/ui/1.9.2/jquery-ui.min.js" type="text/javascript"></script>
            <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular.min.js" type="text/javascript"></script>
            <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular-cookies.min.js" type="text/javascript"></script>
            <script src="js/dist/train-all.min.js" type="text/javascript"></script><!-- todo: pack&min -->
        <? } #end dbg?>
        <script type="text/javascript">
            //<?= $_REQUEST["tid"] ?>
            
            var tid=<?= nextOrNum($_REQUEST["tid"]) ?>;
            $(function() {
                $(".addButton").button({
                    icons: {
                        primary: "ui-icon-plusthick"
                    }
                });
                $("#diagCmt").parent().resizable({"alsoResize":"#msg"});
            });
            
        </script>
</html>
