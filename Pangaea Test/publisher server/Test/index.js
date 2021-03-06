/*
 * Primary TEST file for API
 *
 */

// Dependencies
var helpers = require('./../lib/helpers');
var assert = require('assert');

// Application logic container for the test runner
_app = {};

// Container for the tests
_app.tests = {
    'unit': {}
};

// Assert that the getANumber function is returning a number
_app.tests.unit['helpers.getANumber should return a number'] = function(done){
    var val = helpers.getANumber();
    assert.equal(typeof(val), 'number');
    done();
};

// Assert that the getANumber function is returning 1
_app.tests.unit['helpers.getANumber should return 1'] = function(done){
    var val = helpers.getANumber();
    assert.equal(val, 1);
    done();
};

// Assert that the getANumber function is returning 1
_app.tests.unit['helpers.getANumber should return 2'] = function(done){
    var val = helpers.getANumber();
    assert.equal(val, 2);
    done();
};


//Count all the tests
_app.countTests = function(){
    var counter = 0;
    for (var key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            var subTests = _app.tests[key];
            for (var testName in subTests){
                if(subTests.hasOwnProperty(testName)){
                    counter++;
                }
            }
        }
    }
    return counter;
};


// Product a test outcome report
_app.produceTestReport = function(limit,successes,errors){
    console.log("");
    console.log("--------BEGIN TEST REPORT--------");
    console.log("");
    console.log("Total Tests: ",limit);
    console.log("Pass: ",successes);
    console.log("Fail: ",errors.length);
    console.log("");
  
    // If there are errors, print them in detail
    if(errors.length > 0){
      console.log("--------BEGIN ERROR DETAILS--------");
      console.log("");
      errors.forEach(function(testError){
        console.log('\x1b[31m%s\x1b[0m', testError.name);
        console.log(testError.error);
        console.log("");
      });
      console.log("");
      console.log("--------END ERROR DETAILS--------");
    }
    console.log("");
    console.log("--------END TEST REPORT--------");

  };



// Run all the Tests collecting the errors and successes
_app.runTests = function(){
    var errors= [];
    var successes = 0;
    var limit = _app.countTests();
    var counter = 0;
    for(var key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            var subTests =_app.tests[key];
            for(var testName in subTests){
                if(subTests.hasOwnProperty(testName)){
                    (function(){
                        var tmpTestName = testName;
                        var testvalue = subTests[testName];
                        // Call the test
                        try{
                            testvalue(function(){
                                // If it calls back without throwing an error, then it succeeded, otherwise it failed
                                console.log('\x1b[32m%s\x1b[0m', tmpTestName);
                                counter++;
                                successes++;
                                if(counter == limit){
                                    _app.produceTestReport(limit, successes, errors);
                                };
                            })
                        }
                        catch(e){
                            // if it throws, then it failed. So capture the error thrown and log it out
                            errors.push({
                                'name': testName,
                                'value': e 
                            });
                            console.log('\x1b[31m%s\x1b[0m', tmpTestName);
                            counter++;
                            if(counter == limit){
                                _app.produceTestReport(limit, successes, errors);
                            };
                        }
                    })
                }
            }
        }
    }
};


// Run the Tests
_app.runTests();
