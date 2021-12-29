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

// CreateSubscription Handlers
handlers.publish = (data,callback) => {
  let acceptableMethods = ['post','get', 'put'];
  (acceptableMethods.indexOf(data.method) > -1) ? handlers._subscribers[data.method](data,callback) : callback(405)
};
// Test 1
handlers.test1 = (data,callback) => {
  let acceptableMethods = ['post','get', 'put'];
  (acceptableMethods.indexOf(data.method) > -1) ? handlers._subscribers[data.method](data,callback) : callback(405)
};

// Test 2
handlers.test2 = (data,callback) => {
  let acceptableMethods = ['post','get', 'put'];
  (acceptableMethods.indexOf(data.method) > -1) ? handlers._subscribers[data.method](data,callback) : callback(405)
};

// Container for subscribers submethods
 handlers._subscribers = {};

  // Create Subscription to topic
  handlers.createSubscription.post = (url, msg, callback) => {
    if(msg){
        // Call http post function here
      httpRequest.createSubscription(url, msg, (req, res)=>{
        // First check if topic exists
        let idx = httpRequest.list_of_topics.indexOf(requestDetails.path);
         const check_topic = idx > -1;
         if(check_topic){
          // Check if Subscriber was not previously subscribed to topic
          let subscriber_index = httpRequest.list_of_topics[idx].indexOf(url);
           let content = httpRequest.list_of_topics[idx]
            if(subscriber_index > -1){
              callback(400, {'Error': 'You are already subscribed to this Topic'})
            } else {
            // In production, this should be saved in persistent storage, and accessed from an in-memory store
             httpRequest.list_of_topics[idx].push(url);
              // Make sure the subscriber does not already exist
              _data.read('subscribers', url, function(err, data){
                if(err){
                  // Create subscriber Object
                  let subscriberObject = {
                     'url': url,
                     'topic': topic
                      }
                      // Save the New Subscription Object
                     _data.create('subscribers', url, subscriberObject, (err) => {
                     if(!err){
                        callback(200)
                     } else {
                        callback(500, {'Error': 'Could not create new Subscriber'})
                     }
                  })
                 } else {
                // Subscriber already exists
                callback(400, {'Error': 'A subscriber is already subscribed to this topic'})
               }
              })
            res.end(JSON.stringify({ "url": url, "topic": msg}));
           }
          } else {
         callback(400, {'Error': 'Topic does not exist'})
        };
      })
      }  else {
       callback(400, {'Error': 'Missing required fields'})
    }
   };

   handlers.test1.post = (url, msg, callback) =>{
    if(msg){
      // First create token
      _data.read('subscribers', url, (err, subscriberData)=>{
        if(!err && subscriberData){
              httpRequest.sendPostRequest(url, msg, (req, res) =>{
                const tid = tid;
                if(tid){
                  _data.read('tokens', tid, (err, tokenData) => {
                    if(!err && tokenData){
                      if(tokenData.expires > Date.now()){
                        // Set the expiration an hour from now
                        tokenData.expires = Date.now() + 1000 * 60 * 60;
                        // Store the new updates
                        _data.update('tokens', tid,tokenData,(err) => {
                          if(!err){
                        req.on("data", data => {
                        // Send actual post request to all subscribers for topic
                        handlers.inboundPublish.post(url, msg, (res) => {
                          if (error) {
                            callback(400, {'Error': 'Broadcast notification'})
                          } else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.write(JSON.stringify(`Notificatioins broadcast consumed by Subscriber ${url}`));
                            res.end()}
                          })
                        })
                          } else {
                            callback(500,{'Error' : 'Could not update the token\'s expiration.'});
                          }
                        });
                      } else {
                        callback(400,{"Error" : "The token has already expired."});
                      }
                      } else {
                       callback(404);
                    }
                  })
                 }
                  else {
                  callback(403, {'Forbidden': 'Unauthorized access'})
                }
              })
        } else {
          callback(400, {'Error': 'Could not find the specified Subscriber'})
        }
      })
    }  
    else {
      callback(400, {'Error': 'Missing required fields'})
    }
  };

  
  handlers.test2.post = (url, msg, callback) =>{
    if(msg){
      // First create token
      _data.read('subscribers', url, (err, subscriberData)=>{
        if(!err && subscriberData){
              httpRequest.sendPostRequest(url, msg, (req, res) =>{
                const tid = tid;
                if(tid){
                  _data.read('tokens', tid, (err, tokenData) => {
                    if(!err && tokenData){
                      if(tokenData.expires > Date.now()){
                        // Set the expiration an hour from now
                        tokenData.expires = Date.now() + 1000 * 60 * 60;
                        // Store the new updates
                        _data.update('tokens', tid,tokenData,(err) => {
                          if(!err){
                        req.on("data", data => {
                        // Send actual post request to all subscribers for topic
                        handlers.secondInboundPublish.post(url, msg, (res) => {
                          if (error) {
                            callback(400, {'Error': 'Broadcast notification'})
                          } else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.write(JSON.stringify(`Notificatioins broadcast consumed by Subscriber ${url}`));
                            res.end()}
                          })
                        })
                          } else {
                            callback(500,{'Error' : 'Could not update the token\'s expiration.'});
                          }
                        });
                      } else {
                        callback(400,{"Error" : "The token has already expired."});
                      }
                      } else {
                       callback(404);
                    }
                  })
                 }
                  else {
                  callback(403, {'Forbidden': 'Unauthorized access'})
                }
              })
        } else {
          callback(400, {'Error': 'Could not find the specified Subscriber'})
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
