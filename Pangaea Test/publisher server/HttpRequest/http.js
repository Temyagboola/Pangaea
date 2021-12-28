let httpRequest = {};
httpRequest.list_of_topics = [
  topic1 = ["www.example1.com", "www.example2"],
  topic2 = ["www.example3.com", "www.example4"]
];

// Function to send Post Request
httpRequest.sendPostRequest = (msg, callback) => {
    // Validate parameter
msg = typeof(msg) == 'object' && msg.hasOwnProperty("url") ? msg : false;
if(msg){
  // Configure the request details
  let requestDetails = {
    'protocol' : 'https:',
    'hostname' : url,
    'method' : 'POST',
    'path' : `${topic}`,
    'headers' : {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(stringPayload)
    }
  };

  // Instantiate the request object
  let req = https.request(requestDetails,(res) => {
      // Grab the status of the sent request
      let status =  res.statusCode;
      // Callback successfully if the request went through
      status == 200 || status == 201 ? callback(false) : callback('Status code returned was '+status)
  })

  // Bind to the error event so it doesn't get thrown
  req.on('error', (e) => {
    callback(e);
  });

  // Add the payload
  req.write(msg);

  // End the request
  req.end();

} else {
    callback('Given parameters were missing or invalid')
}

};

httpRequest.publish = (url, msg, callback) => {
  // Validate parameter
msg = typeof(msg) == 'object' && msg.hasOwnProperty("url") ? msg : false;
if(msg){
  // Configure the request details
  let requestDetails = {
    'protocol' : 'https:',
    'hostname' : url,
    'method' : 'POST',
    'path' : '/sub',
    'headers' : {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(msg)
    }
  };

  // Instantiate the request object
  if(typeof(url) == 'string'){
  let req = https.request(requestDetails, (res) => {
      // Grab the status of the sent request
      let status =  res.statusCode;
      // Callback successfully if the request went through
      status == 200 || status == 201 ? callback(false) : callback('Status code returned was '+status)
  })
  
  // Bind to the error event so it doesn't get thrown
  req.on('error', (e) => {
    callback(e);
  });

  // Add the payload
  req.write(msg);

  // End the request
  req.end();

} else {
  url.map(address => {
    let req = https.request({
      'protocol' : 'https:',
      'hostname' : address,
      'method' : 'POST',
      'path' : '/sub',
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    },function(res){
      // Grab the status of the sent request
      let status =  res.statusCode;
      // Callback successfully if the request went through
      status == 200 || status == 201 ? callback(false) : callback('Status code returned was '+status)
  })
  
  // Bind to the error event so it doesn't get thrown
  req.on('error', (e) => {
    callback(e);
  });

  // Add the payload
  req.write(msg);

  // End the request
  req.end();

  })
  
}} else {
    callback('Given parameters were missing or invalid')
}
};

httpRequest.inboundPublish = (topic, data, callback) => {
  // Validate parameter
data = typeof(data) == 'object' && data.hasOwnProperty("topic") ? data : false;
if(data){
  // Configure the request details
  const options = {
    'protocol' : 'https:',
    hostname: `http://localhost:${process.env.httpsPort}/test1`,
    port: process.env.httpsPort,
    path: `${topic}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }
  
  const req = https.request(options, res => {
    if(!res.error)
    res.on('data', d => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({"status" : "Publish succcessful"}));
      res.end();
      return;
    }) 
    else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify({"status" : "Publish Unsucccessful"}));
      res.end();
      return;
    }
  })
  
  req.on('error', error => {
    throw new Error("Unsuccesful")
  })
  
  req.write(data)
  req.end()

} else {
    callback('Given parameters were missing or invalid')
}
};

httpRequest.secondInboundPublish = (topic, data, callback) => {
  // Validate parameter
data = typeof(data) == 'object' && data.hasOwnProperty("topic") ? data : false;
if(data){
  // Configure the request details
  const options = {
    'protocol' : 'https:',
    hostname: `http://localhost:${process.env.httpsPort}/test2`,
    port: process.env.httpsPort,
    path: `${topic}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }
  
  const req = https.request(options, res => {
    if(!res.error)
    res.on('data', d => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({"status" : "Publish succcessful"}));
      res.end();
      return;
    }) 
    else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify({"status" : "Publish Unsucccessful"}));
      res.end();
      return;
    }
  })
  
  req.on('error', error => {
    throw new Error("Unsuccesful")
  })
  
  req.write(data)
  req.end()

} else {
    callback('Given parameters were missing or invalid')
}
};

module.exports = httpRequest;