 /*
 * Library for creating and storing logs
 *
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// Container for module (to be exported)
let lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname,'/../.logs/');

// Append a string to a file. Create the file if it does not exist
lib.append = (file,str,callback) => {
  // Open the file for appending
  fs.open(lib.baseDir+file+'.log', 'a', (err, fileDescriptor) => {
    if(!err && fileDescriptor){
      // Append to file and close it
      fs.appendFile(fileDescriptor, str+'\n', (err) => {
        if(!err){
          fs.close(fileDescriptor, (err) => {
            if(!err){
              callback(false);
            } else {
              callback('Error closing file that was being appended to');
            }
          });
        } else {
          callback('Error appending to file');
        }
      });
    } else {
      callback('Could open file for appending');
    }
  });
};


// Export the module
module.exports = lib;
