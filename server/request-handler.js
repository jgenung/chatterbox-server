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
var database = {};

database.results = [];

var requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "json";

if ( request.url.indexOf( '/classes' ) === -1 ) {
    response.writeHead(404, headers );
    response.end('error');
  }
 
  if(request.method === 'GET' || request.url.indexOf('/classes') > -1 && request.method === 'GET'){
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(database));
  }

  else if(request.method === 'POST'){// || request.method === 'POST' && request.url.indexOf('/send') > 0){
    statusCode = 201;
    response.writeHead(statusCode, headers);
    var body = '';

    request.on('data', function (data) {
      console.log(data);
      body += data;
      console.log("Partial body: " + body);
      var x = JSON.parse(body);
      x.objectID = ++count;
      console.log(x);
      database.results.push(x);
    });
    response.end();
  }

  else if(request.method === 'OPTIONS'){
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  }

  else{ //error case
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  }

};


exports.requestHandler = requestHandler;

