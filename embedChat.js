var sentFirstMsg = false;
var allowSpeech = true;
var flashCheckSpeak = true;
var countMess = 0;

$(function(){
  var query = {};
  location.search.replace("?","").split("&").forEach(function(keyVal){var tokens = keyVal.split("="); query[tokens[0]]=tokens[1]});
  
  MobiAgentClient.on('sdkReady', function(data) 
  {
    showChatFrame();
    sentFirstMsg = true;
    MobiAgentClient.sendMessage(' ');
  });
  
  MobiAgentClient.on('roomReady', function() 
  {
    MobiAgentClient.setTempField($("#userIdForBot").data("id"));
  });

  
  // 'https://mbwac.dev-mobilus.chat',
  //  'playnexttestchatbot',
  //  'https://agent.trial-mobilus.chat',
  //     'pnlchatbot',
  $('#userIdForBot').on('click', function() {
    var option = {};
    MobiAgentClient.init(
      'https://mbwac.dev-mobilus.chat',
      'nupme',
      option,
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
      }
    );

    showChatFrame();
  });

  MobiAgentClient.on(MobiAgentClient.Events.messageReceived, function(body, sender) 
  {
    if (body.text !="") {
      checkToAllowSpeech(body);
      if(allowSpeech && body.text != "Image" && body.text != "Template message")
      {
        speak(body.text);
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
    $('#konnect-container').css('opacity','1');
    $('#konnect-container').css('bottom','0px');
    $('.supportBnr-show').fadeOut(100);
}