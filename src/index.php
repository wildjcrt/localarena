<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Tutorial: Hello Dojo!</title>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous"/>
    <link rel="stylesheet" href="./dijit/themes/claro/claro.css"/>
    <link href="./fa/css/all.css" rel="stylesheet">
    <link rel="stylesheet" href="./site.css"/>
    <link rel="stylesheet" href="./thecrew/thecrew.css"/>

</head>
<body class="claro">
     <?php


     define("DEV_MODE",1);

     define("APP_BASE_PATH",'/src');
     define("APP_GAMEMODULE_PATH",'/src');

     include('thecrew/thecrew.view.php');

    ?>

     <?php

        $view = new view_thecrew_thecrew();
        $currentPlayer = 2317679;

        if(DEV_MODE)
        {
            if(isset($_GET['testplayer']))
            {
                $currentPlayer = $_GET['testplayer'];
            }
            if(isset($_GET['loadDatabase']))
            {
                $view->game->loadDatabase();
            }
        }
        $view->game->currentPlayer = $currentPlayer;

        if(isset($_GET['replayFrom']))
        {
            $view->game->replayFrom = $_GET['replayFrom'];
        }
        $view->display();
    ?>

    <!-- load Dojo -->
    <script>
    var dojoConfig = {
            async: true,
            baseUrl: './dojo',
            packages: [
            {
                name: "jquery",
                location: "http://localhost/game/",
                main: "jquery-3.5.1.min"
            },
            {
                name: "ebg",
                location: "http://localhost/game/ebg/"
            },
            {
                name: "socketio",
                location: "http://localhost:3000/socket.io/",
                main: "socket.io"
            },
            {
                name: "bgagame",
                location: "http://localhost/game/thecrew/"
            }]
        };

    function escapeRegExp(str) {
    	  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    	};

	function replaceAll(str, find, replace) {
		  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
		};

    function _(val)
	{
		return val;
	};

    function __(val)
	{
		return val;
	};

	function $(val)
	{
		return dojo.byId(val);
	};

	g_gamethemeurl = "http://localhost/game/thecrew/";

    </script>
    <script src="dojo/dojo.js"></script>

    <script>
    require(["dojo", "dojo/_base/unload","bgagame/thecrew", "dojo/domReady!"], function( dojo, baseUnload ) {

        gameui = new bgagame.thecrew();
        gameui.player_id = <?= $view->game->currentPlayer?>;
        gameui.current_player_name="Mistergos1";
		gameui.completesetup( "thecrew", <?= $view->getFullDatasAsJson()?>);
		gameui.logAll(<?= json_encode($view->game->getLogs())?>);

		<?php
		  if($view->game->replayFrom>0)
		  {
		      echo "gameui.replay = true;";
		      $logs = $view->game->getReplay();
		      foreach($logs as $log)
		      {
		          echo "gameui.notifqueue.addEvent(JSON.parse('".$log['gamelog_notification']."'));\n";
		      }
		      echo "gameui.notifqueue.processNotif();";
		  }
		?>

        });
    </script>
</body>
</html>