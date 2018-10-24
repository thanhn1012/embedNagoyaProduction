<script>
var sentFirstMsg = false;
var allowSpeech = true;
var flashCheckSpeak = true;
var countMess = 0;

var mytext = "では、献立クイズを開始いたします。";
var mytext1 = "では1、献立クイズを開始いたします。6種類の分類ごとに食品を選択し、右端の「選択終了」を押してください。途中でやめる場合には「やめる」を画面下の入力欄に入力してください。";
var mytext2 = "では、献立クイズを開始いたします。6種類の分類ごとに食品を選択し、右端の「選択終了」を押してください。途中でやめる場合には「やめる」を画面下の入力欄に入力してください。";

  $(function(){
      // 音声準備
      $voise        = null;
      $voiseName    = 'Google 日本語';
      $voices       = speechSynthesis.getVoices();
      $synthes  = new SpeechSynthesisUtterance();

      // SpeechSynthesisUtterance()に時間かかるから様子みる
      // $repeat  = setInterval(function() {
      //     if($synthes){
      //         $voices  = speechSynthesis.getVoices();
      //         // $voicesの中身を見てみる F12
      //         $.map($voices, function(n, i){});
      //         clearInterval($repeat);
      //     }
      // }, 300);

      // 読み上げ
      // 
      function say(msg) {
          //if(! $voices.length){alert('音声ロード中みたい…'); return;}

          if(! $voices.lenght) $voices = speechSynthesis.getVoices();

          // $voices から $voiseNameを探す
          $voise = $.grep($voices, function(n, i){return n.name == $voiseName})[0];

          if($voise) $synthes.voice = $voise;       // 音声の設定
          //speechSynthesis.cancel();                 // 停止
          $synthes.text  = msg;                     // 読む内容
          $synthes.rate  = 1;                     // 速度    0.1-10
          $synthes.pitch = 1.0;                     // ピッチ  0.0-2.0
          $synthes.lang  = "ja-JP";                 // 日本語に設定
          speechSynthesis.speak($synthes);          // 喋れ

          $synthes.onstart = function(event) {
              resumeInfinity();
          };

          $synthes.onend = function(event) {
              clearTimeout(timeoutResumeInfinity);
          };
         
      }

      function resumeInfinity() {
          window.speechSynthesis.resume();
          timeoutResumeInfinity = setTimeout(resumeInfinity, 1000);
      }

    $('#userIdForBot').on('click', function() {
      MobiAgentClient.init(
        'https://agent.mobilus.me',
        'nupme',
        {},
        function(f){
          $("#konnect-container")
          .append("<div id='draggableHandle' style='pointer-events: auto; cursor: move; height: 20px; width: 20px; background: rgba(34, 34, 34, 0.5); position: absolute; bottom: 1px; left: -19px;'></div>")
          .append("<div id='frameOverlay' style='height: 100%; width: 100%; background: rgba(34, 34, 34, 0.5); position: absolute; top: 0; left: 0; display: none;'></div>")
          .draggable({
            handle: $("#draggableHandle"),
            start: function() {
              $('#frameOverlay').fadeIn('fast');
            },
            stop: function() {
              $('#frameOverlay').fadeOut('fast');
            }
          });
      });
    });

    MobiAgentClient.on('sdkReady', function(data) 
    {
      showChatFrame();

      MobiAgentClient.on('openFrame', function() {
        if(sentFirstMsg || data.hasRoom) return;
        sentFirstMsg = true;
        MobiAgentClient.sendMessage(' ');
      });

      MobiAgentClient.on('roomReady', function(){
        MobiAgentClient.setTempField($("#userIdForBot").data("id"));
      });

    });

    MobiAgentClient.on(MobiAgentClient.Events.messageReceived, function(body, sender) 
    {
        body.text = body.text.replace(/\n/g,'');

        if (body.text != "") {
          checkToAllowSpeech(body);
          if(allowSpeech && body.text != "Image" && body.text != "Template message")
          {
            say(body.text);
          } else {
            console.log(body);
          }
        }
    });


  });




function checkToAllowSpeech(body)
{ 
  if (flashCheckSpeak) {
    if (body.msgObject.extra) {
      let extra = JSON.parse(body.msgObject.extra);
      if (extra.t === "misc_postback" && extra.data.postback.payload) {
        let prePayload = extra.data.postback.payload; 
        let payload = JSON.parse(prePayload);
        allowSpeech = payload.allowSpeech;
        localStorage.setItem('isSpeech', allowSpeech);
        flashCheckSpeak = false; // check only once
      }
    }

  } else if (localStorage.getItem('isSpeech') != null) {
    allowSpeech = localStorage.getItem('isSpeech') == "true" ? true : false;
  }

}

function showChatFrame()
{
    MobiAgentClient.toggle(true);
    $('#konnect-container').css('opacity','1');
    $('#konnect-container').css('bottom','0px');
    $('.supportBnr-show').fadeOut(100);
}

</script>