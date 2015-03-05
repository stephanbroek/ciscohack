var http = require('http');
var url = require('url');
var node_static = require('node-static');
var faye = require('faye');

var file_server = new node_static.Server('./public', {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
});
var simulation = require('./simulation.js');

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
    response.writeHeader(200, {
      'Access-Control-Allow-Origin': '*'
    });
    file_server.serve(request, response);
  }
});

socket_adapter.attach(server);

server.listen(3000);

var socket_client = socket_adapter.getClient();

function sendData() {
  socket_client.publish('/stations', simulation.getStations());
}

setInterval(sendData, 1000);