/**
 * Background-Workers-related tasks
 * 
 */

// Dependenciesvar 
let helpers = require('./helpers');
_data = require('./data');
let util = require('util');
let debug = util.debuglog('workers');
const {  parentPort, workerData } = require('worker_threads');

// Container object for workers
let workers = {};

workers.performChecks = () => {

    // define callback to receive data from main thread
    let cb = (err, result) => {
        if(err) return console.error(err);

        console.log("**** Multiple Factor Received From Parent Thread: ", result.multipleFactor, " ****");

    };

    // registering to events to receive messages from the main thread
    parentPort.on('error', (error) => {
        const errorId = helpers.createRandomString(10);
        _data.create('errors', errorId, errorObject, function(err){
            if(!err){
               callback(200)
            } else {
               callback(500, {'Error': 'Could not create new Error log'})
            }
         })
    });
    parentPort.on('message', (msg) => {
        cb(null, msg);
    });
}

// Timer to execute the worker process once per minute
workers.loop = function(){
setInterval(function(){
    workers.performChecks();
}, 1000 * 60);
}

// Workers Init function
workers.init = function(){
    // Send to the console in yellow color
    debug('\x1b[33m%s\x1b[0m', 'Background workers are now up and running');

    // Execute all checks immediately
    workers.performChecks();

    // Call the loop, so the worker will run later on
    workers.loop()
}

module.exports = workers;
