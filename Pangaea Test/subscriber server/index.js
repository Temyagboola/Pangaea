/*
 * Primary file for API
 *
 */

// Dependencies
var server = require('./library/server');
var workers = require('./library/worker');


// Declare the app
var app = {};

// App init function
app.init = function(){
    // Start the server
    server.init();

    // Start the workers
    workers.init();

};

// Self-executing
app.init();

// Export the app
module.exports = app;
