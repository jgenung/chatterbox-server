/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var count = 0;
var fs = require('fs');
var requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "json";

  try{
    var storage = require('./data.json');
  }catch(err){ 
    storage = {};
    storage.results = [];
  }

  if(request.url.indexOf( '/classes' ) === -1) {
    response.writeHead(404, headers );
    response.end('error');
  }
 
  switch(request.method){
    case 'GET':
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(storage));

    case 'POST':
      statusCode = 201;
      response.writeHead(statusCode, headers);
      var body = '';
      request.on('data', function (data) {
        body += data;
        var x = JSON.parse(body);
        if(!x.objectID){
          x.objectID = ++count;
        }
        storage.results.push(x);
        fs.writeFile("./data.JSON", JSON.stringify(storage), function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("The file was saved!");
          }
        }); 
      });
      response.end();

    case 'OPTIONS':
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end();

    default:
      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
  }
};

exports.requestHandler = requestHandler;

