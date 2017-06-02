// Handle SIGINT/SIGTERM
var sighandler = function() {
  console.log('Exiting..');
  process.exit();
}
process.on( "SIGINT", sighandler );
process.on( "SIGTERM", sighandler );

// Overload console.log and console.error to log to a file and also to stdout

// If running in CAF environment, use the CAF_APP_LOG_DIR location to write the log file
var cafLogDir = process.env.CAF_APP_LOG_DIR
var path = require('path');
var lf = "server.log"
if (cafLogDir) {
	lf = path.join(cafLogDir, lf)
}
var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream(lf, { flags: 'a' });
var logStdout = process.stdout;

console.log("Setting up logging to file " + lf)
console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;


// Load the http module to create an http server.
//var http = require('http');

// Configure our HTTP server to respond with Hello World to all requests.


//Restify server
var restify = require('restify');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

// Listen on port 8000, IP defaults to 127.0.0.1
//server.listen(8000, "0.0.0.0");

// Put a friendly message on the terminal
//console.log("Server running at http://0.0.0.0:8000/");