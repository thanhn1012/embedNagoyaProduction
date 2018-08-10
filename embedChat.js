var sentFirstMsg = false;
    var allowSpeech = true;

    $(function(){
      var query = {};
      location.search.replace("?","").split("&").forEach(function(keyVal){var tokens = keyVal.split("="); query[tokens[0]]=tokens[1]});
      Object.keys(MobiAgentClient.Events).forEach(function(key){
        MobiAgentClient.on(key, function(data){
          // console.log(key, data);
        });
      });
      
      MobiAgentClient.on('sdkReady', function(data) 
      {
        showChatFrame();
        $( "#mbaGuestFrame_content_input_wrapper_sendButton button:nth-child(1)").text(111);
      });
      
      MobiAgentClient.on('roomReady', function() 
      {
        var scriptText = `
          <script>
            window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
            var recognition = new webkitSpeechRecognition();
            recognition.lang = 'ja';

            // 録音終了時トリガー
            recognition.addEventListener('result', function(event){
                var text = event.results.item(0).item(0).transcript;
                document.getElementsByName("description")[0].value = text;
            }, false);

            // 録音開始
            function record()
            {
                recognition.start();
            }

          <\/script>
          <button id="record_button" class="btn" style='color: rgb(255, 255, 255); background-color: rgb(33, 150, 243); display: inline-block; padding: 2px 12px; margin-top: 4px; margin-bottom: 10px; margin-right: 7px; font-size: 1em; line-height: 1.5em; text-align: center; white-space: nowrap; vertical-align: middle; touch-action: manipulation; cursor: pointer; user-select: none; background-image: none; border: 1px solid transparent; border-radius: 20px; margin-left: 12px;' onclick='javascript:record()'>録音</button>
        `;
        var appendNode = document.createElement("div");
        appendNode.innerHTML = scriptText;

        var btn = window.document.getElementById("konnect-frame").contentWindow.document.getElementById("mbaGuestFrame_content_input_wrapper_sendButton");
        $(btn).append(appendNode);
      });

      $('#openChat').on('click', function(){
        var option = {};
        MobiAgentClient.init(
          'https://agent.trial-mobilus.chat',
          'pnlchatbot',
          option,
          function(f){
            $('#btn1').hide();
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
          }
        );
        showChatFrame();
      });

      MobiAgentClient.on(MobiAgentClient.Events.messageReceived, function(body, sender) 
      {
        checkToAllowSpeech(body);
        if(isAllowToSpeech(body.text))
        {
          speak(body.text);
        }
      });
    });

    function isAllowToSpeech(text)
  {
    if(allowSpeech && text != "Image" && text != "Template message"){
      return true;
    } else {
      console.log(text);
    }
  }

    function checkToAllowSpeech(body)
    {
      if(body.msgObject.extra)
        {
          var extra = JSON.parse(body.msgObject.extra);
          if(JSON.parse(extra.data.postback.payload).allowSpeech) {
            allowSpeech = true;
          }
          else {
            allowSpeech = false;
          }
        }
    }

    function speak(text) {
      var chunkLength = 60;
      var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
      let voices = window.speechSynthesis.getVoices();
      var arr = [];
      while (text.length > 0) {
        arr.push(text.match(pattRegex)[0]);
        text = text.substring(arr[arr.length - 1].length);
      }
      $.each(arr, function () {
        var msg = new SpeechSynthesisUtterance(this.trim());
        msg.voice = voices[57]; // 57: Google 日本語
        msg.volume = parseFloat(1.0); // 音量 min 0 ~ max 1
        msg.rate = parseFloat(1.0); // 速度 min 0 ~ max 10
        msg.pitch = parseFloat(1.0); // 音程 min 0 ~ max 2
        msg.lang = 'ja-JP';
        window.speechSynthesis.speak(msg);
      });
    }
    
    function showChatFrame()
    {
        MobiAgentClient.toggle(true);
        //MobiAgentClient.sendMessage(' ');
        $('#konnect-container').css('opacity','1');
        $('#konnect-container').css('bottom','0px');
        $('.supportBnr-show').fadeOut(100);
        window.document.getElementById("konnect-frame").contentWindow.document.getElementById("record_button").style.visibility = 'visible';
    }