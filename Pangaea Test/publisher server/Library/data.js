// Library for storing and editing data

// Dependencies
let fs = require('fs');
let path = require('path');
let helpers = require('./helpers');

// Container for the module to be exported
let lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Function to write data to a file
lib.create = (dir, file, data, callback) => {
// Open the file for writing
fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', (err, fileDescriptor) => {
    if(!err && fileDescriptor){
        // Convert data to string
        let stringData = JSON.stringify(data);
         // write to file and close it
       fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err){
          fs.close(fileDescriptor, (err) => {
              if(!err){
                  callback(false);
              }else{
                callback('Error closing new file');
              }
          })
      } else {
        callback('Error writing to new file');
      }
    })
    }
    else {
        callback('Could not create new file, it already exists');
    }}
)};


// Function to Read data from a file
lib.read = (dir, file, callback) => {
fs.readFile(lib.baseDir+dir+'/'+ file + '.json','utf8', (err, data) => {
  if(!err && data){
    let parsedData = helpers.parseJsonToObject(data);
    callback(false, parsedData);
  } else {
  callback(err, data);
  }
});
}


// Update data inside a file
lib.update = function(dir, file, data, callback){
  // Open the file for writing
  fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      var stringData = JSON.stringify(data);
      fs.truncate(fileDescriptor, function(err){
        if(!err){
          // write to the file and close it
          fs.writeFile(fileDescriptor, stringData, function(err){
            if(!err){
              fs.close(fileDescriptor, function(err){
                if (!err){
                  callback(false);
                } else {
                  callback('Error closing existing file')
                }
              })
            } else{
              callback('Error writing to existing file')
            }
          })

        } else {
          callback('Error truncating file');
        }
      })

    } else {
      callback('Could not open the file for updating, as it may not exist yet');
    }
  })
}


// Function to List all the items in a directory
lib.list = (dir, callback) => {
  fs.readdir(lib.baseDir+dir+'/', (err,data) => {
    if(!err && data && data.length > 0){
      let trimmedFileNames = [];
      data.forEach((fileName) => {
        trimmedFileNames.push(fileName.replace('.json',''));
      });
      callback(false,trimmedFileNames);
    } else {
      callback(err, data);
    }
  })
}


// Export the module
 module.exports = lib;