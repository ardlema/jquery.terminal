function setupWebSocket(endpoint, name, term) {
  if(window[name]) {
    window[name].close();
  }

  var ws = new WebSocket(endpoint)

  ws.onopen = function(event) {
    console.info("Connected to the server")
  };

  ws.onmessage = function(event) {
    console.log(event);
    term.echo(event.data);
  };

  ws.onclose = function() {
    console.info("Disconnected to the server");
    setupWebSocket(this.url)
  };

  window[name] = ws;
}

function wsURL(path) {
  var protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
  var url = protocol + "localhost:8080";
  if(location.hostname === 'localhost') {
    url += '/' + location.pathname.split('/')[1];
  } else {
    url += '/';
  }
  return url + path;
};

function createEventDiv(obj) {
  var newDiv = "";
  newDiv += '<div class="feedback alert alert-info" role="alert" style="margin-top: 20px">';
  newDiv += '<p>' + obj.data + '</p>';
  newDiv += "</div>";
  $(".feedback" ).remove();
  $("div#content").append(newDiv);
};

function sendMessage(msg){
    // Wait until the state of the socket is not ready and send the message when it is...
    waitForSocketConnection(window["input"], function(){
        console.log("send command xx" + msg);
        window["input"].send(msg);
    });
}

function waitForSocketConnection(socket, callback){
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                console.log("Connection is made")
                if(callback != null){
                    callback();
                }
                return;

            } else {
                console.log("wait for connection...")
                waitForSocketConnection(socket, callback);
            }

        }, 5); // wait 5 milisecond for the connection...
}