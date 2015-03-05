var http = require('http');
var url = require('url');
var static = require('node-static');

var file = static.Server('./public');

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

    response.end();
  } else {
    // General static
    file.serve(request, response);
  }
});

server.listen(3000);