// Dependencies
let httpRequest = require('../httpRequest/http');
let _data = require('./data');
let helpers = require('./helpers');
let config = require('../Config/config');


// All our Request handlers

// Define the handlers
let handlers = {};

// Ping handler
handlers.ping = (data, callback) => {
callback(200);
};
 
// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// Forbidden: Unauthorized access handler
handlers.unauthorized = (data, callback) => {
  callback(403);
};

// SUbscribers
handlers.subscribers = (data,callback) => {
  let acceptableMethods = ['post','get'];
  (acceptableMethods.indexOf(data.method) > -1) ? handlers._subscribers[data.method](data,callback) : callback(405)
};

// Publish Handlers
handlers.publish = (data,callback) => {
  let acceptableMethods = ['post','get', 'put'];
  (acceptableMethods.indexOf(data.method) > -1) ? handlers._subscribers[data.method](data,callback) : callback(405)
};

// Container for subscribers submethods
 handlers._subscribers = {};

 handlers.publish.post = function(url, msg, callback){
    if(msg){
          // if valid, create a new token with a random name, and set expiration date to be 1 hour into the future
          let tokenId = helpers.createRandomString(20);
          let expires = Date.now() + 1000 * 60 * 60;
            let tokenObject = {
              'url': url,
              'id': tokenId,
              'expires': expires
            };
            // Store the Token Object
              _data.create('tokens', tokenId, tokenObject, function(err){
                 if(!err){
                   callback(200, tokenObject)
                    // Call http post function here
                  // Call http post function here
                  httpRequest.sendPostRequest(url, msg, (req, res)=>{
                  req.on("data", data => {
                    // Send actual post request to all subscribers for topic
                    handlers.publish.post(url, msg, (res) => {
                      if (error) {
                        callback(400, {'Error': 'Could not broadcast notification'})
                      } else {
                        res.writeHead(400, {
                          "Content-Type": "application/json" ,
                          "Authorization": tokenId
                      });
                        res.write(JSON.stringify({"topic" : url, "data": msg}));
                      res.end()}
                  })
                })
              })
            } else {
            callback(500, {'Operation failed': 'Could not create Subscription Token'})
          }
       })
    }   
    else {
      callback(400, {'Error': 'Missing required fields'})
    }
  };
  

 // Tokens Handlers
 handlers.tokens = (data, callback) => {
  let acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
     handlers._tokens[data.method](data,callback); 
  } else {
     callback(405);
  }
}
// Tokens Handlers
handlers.tokens = (data, callback) => {
  let acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
     handlers._tokens[data.method](data,callback); 
  } else {
     callback(405);
  }
}

handlers._tokens = {};

// Token Post route
handlers._tokens.post = (data, callback) => {
  let url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
   if(url){
    // Lookup subscriber who matches the url
    _data.read('subscribers', url, (err, subscriberData)=>{
      if(!err && subscriberData){
          //  create a new token with a random name, and set expiration date to be 1 hour into the future
          let tokenId = helpers.createRandomString(20);
          let expires = Date.now() + 1000 * 60 * 60;
          let tokenObject = {
            'url': url,
            'id': tokenId,
            'expires': expires
          };
          // Store the Token Object
          _data.create('tokens', tokenId, tokenObject, (err) => {
            if(!err){
                callback(200, tokenObject)
            } else {
              callback(500, {'Error': 'Could not create the new Token'})
            }
          })
      } else {
        callback(400, {'Error': 'Could not find the specified Subscriber'})
      }
    })
  } else {
    callback(400, {'Error': 'Missing required fields'})
  }
};


// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = (data,callback) => {
  // Check that id is valid
  let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup the token
    _data.read('tokens',id,(err,tokenData) => {
      if(!err && tokenData){
        // Delete the token
        _data.delete('tokens',id,(err) => {
          if(!err){
            callback(200);
          } else {
            callback(500,{'Error' : 'Could not delete the specified token'});
          }
        });
      } else {
        callback(400,{'Error' : 'Could not find the specified token.'});
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};

// Export the module
 module.exports = handlers;
