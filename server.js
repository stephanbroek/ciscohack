var http = require('http');
var url = require('url');
var node_static = require('node-static');
var faye = require('faye');

var file_server = new node_static.Server('./public');
var stations = require('./stations');

var socket_adapter = new faye.NodeAdapter({mount: '/stream', timeout: 60});

var server = http.createServer(function(request, response) {
  var path = url.parse(request.url).pathname;
  if (path == '/') {
    // Index static
    response.writeHead(302, {
      'Location': '/index.html'
    });
    response.end();
  } else {
    // General static
    file_server.serve(request, response);
  }
});

socket_adapter.attach(server);

server.listen(3000);

var socket_client = socket_adapter.getClient();

function sendData() {
  socket_client.publish('/stations', stations.getList());
}

setInterval(sendData, 1000);