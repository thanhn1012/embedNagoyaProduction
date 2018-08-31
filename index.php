<!DOCTYPE html>
<html lang="ja">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=2.0,user-scalable=yes"/>
  <title>MobiAgent Sample</title>
  <style>
    body{
      height: 100vh;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
    }
    pre{
      overflow: scroll;
    }
    #userIdForBot {
      font-size: 24px;
      font-weight: 100;
      padding: 20px;
      color: aliceblue;
      background: green;
    }
  </style>
</head>
<body>
  </br>
  <?php $userId = isset($_GET["user_id"]) ? $_GET["user_id"] : 0;?>
  
  <?php if ($userId != 0) { ?>
    <button id="userIdForBot" data-id="<?php echo $userId; ?>">起動</button>
  <?php 
    } else  {
      echo "<h3>UserId Invalid</h3>";
    }
  ?>
  </br>
  <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
  <script type="text/javascript" src="https://agent.mobilus.me/assets/script/embed/current/mobi-agent-client-frame-loader.min.js"></script>
  
  <script type="text/javascript" src="./embedChat.js">
    
  </script>
</body>
</html>
