/* Primary or Entry File for API  */

// Dependencies

const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const path = require('path');
const util = require('util');
const fs = require('fs');
const debug = util.debuglog('workers');
let config = require('../Config/config');
let handlers = require('./handlers');
let helpers = require('./helpers');

let server = {};

// Instantiate HTTP Server and Have it respond to all requests with a string
server.httpServer = http.createServer(function(req, res){
    server.unifiedServer(req, res);
});

// Instantiate the HTTPS server
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};
server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res){
    server.unifiedServer(req, res);
});

    
// All the Unified logic for both http and https
server.unifiedServer = function (req, res){
    
    // Get url and parse it
   let parsedUrl = url.parse(req.url, true)

   // Get the path and parse it
   let path = parsedUrl.pathname;
   let trimmedPath = path.replace(/^\/+|\/+$/g,'');

   // Get the query string as an object
   let queryStringObject = parsedUrl.query;

    // Get the HTTP Method
   let method = req.method.toLowerCase();

   // Get Request Headers
   let headers = req.headers;

   // Get the Payload, if any
   let decoder = new StringDecoder('utf-8');
   let buffer = '';
    req.on('data', (data) => {
       buffer += decoder.write(data);
   });

   req.on('end', () => {
       buffer += decoder.end();

   // Choose handler request should go to. If one is not found, use the notFound handler
   let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

   // Construct the Data object to send to the handler
   let data = {
       'trimmedPath': trimmedPath,
       'queryStringObject': queryStringObject,
       'method': method,
       'headers': headers,
       'payload' : helpers.parseJsonToObject(buffer)
   };

   // Route the request to the handler specified in the router
   chosenHandler(data, function(statusCode, payload){
       // Use status code called back by the handler, or default to 200
       statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

       // Use the payload called back by the handler or default to an emprty object
       payload = typeof(payload) == 'object' ? payload : {};

       // Convert the payload to String
       let payloadString = JSON.stringify(payload);

       // Return the response
       res.setHeader('Content-Type', 'application/json');
       res.writeHead(statusCode);
       res.end(payloadString);

       // Log the request path
       if(statusCode == 200 ){
        debug('\x1b[32m%s\x1b[0m', method.toUpperCase()+ ' /' + trimmedPath+' '+statusCode);
       } else {
        debug('\x1b[31m%s\x1b[0m', method.toUpperCase()+ ' /' + trimmedPath+' '+statusCode);
       }
   }); 
   });
  }

       // Define a request router
       server.router = {
       'createSubscription': handlers.createSub,
       'publish' : handlers.publish,
       'inboundPublish' : handlers.inboundPublish,
       'secondInboundPublish' : handlers.secondInboundPublish,
       'tokens': handlers.tokens
   };

// Server init function
server.init = () => {
     // Start HTTP server, and have it respond on PORT 
 server.httpServer.listen(config.httpPort, () => {
    console.log('\x1b[36m%s\x1b[0m', 'HTTP Server has STARTED listening on port ' + config.httpPort);
    });

// Start the HTTPS server
server.httpsServer.listen(config.httpsPort, () => {
    console.log('\x1b[35m%s\x1b[0m', 'HTTPS Server has STARTED listening on port ' + config.httpsPort);
    });
    
}


   module.exports = server;
