/*
 * Primary file for API
 *
 */

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/worker');
var cli = require('./lib/cli');

// Declare the app
var app = {};

// App init function
app.init = function(){
    // Start the server
    server.init();

    // Start the workers
    workers.init();

    // Start the CLi, but make sure it starts last
    setTimeout(function(){
        cli.init();
    }, 50);
};

// Self-executing
app.init();

// Export the app
module.exports = app;
