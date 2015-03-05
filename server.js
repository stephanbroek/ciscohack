var http = require('http');
var url = require('url');
var node_static = require('node-static');

var file_server = new node_static.Server('./public');

var server = http.createServer(function(request, response) {
  var path = url.parse(request.url).pathname;
  if (path == '/') {
    // Index static
    response.writeHead(302, {
      'Location': '/index.html'
    });
    response.end();
  } else if (path.slice(0, 4) == '/api') {
    // API
    if (false) {

    } else {
      response.writeHead(404, {
        'Content-Type': 'application/json'
      });
      response.write('{"message": "invalid API call"}');
      response.end();
    }
    response.end();
  } else {
    // General static
    file_server.serve(request, response);
  }
});

server.listen(3000);