
<!DOCTYPE html>
<html ng-app>
    <head>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular.min.js" type="text/javascript"></script>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
        <script type="text/javascript">
        var tid=<?= $_REQUEST["tid"]?>;
        </script>
        <script src="controllers.js"></script>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>T2</title>
    </head>
    <body ng-controller="TrainCtrl">
        <header>T at <?= $_REQUEST["tid"]?> </header>
        
        <table>
            <tr ng-repeat="vote in votes">
                    <td>{{vote.name}}</td>
                    <td class="v{{vote.vid}}">{{vote.vote}}</td>
                <td>{{vote.time}}</td>
            </tr>
        </table>

        <div>
            <p ng-repeat="comment in comments">{{comment.autor}} ({{comment.time}}):<br/>{{comment.msg}}</p>
        </div>
        
    </body>
</html>
