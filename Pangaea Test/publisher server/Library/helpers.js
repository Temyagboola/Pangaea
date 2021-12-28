/*
* Helpers for letious tasks
*
*/

// Dependencies
const crypto = require('crypto');
let config = require('../Config/config');

// Container for all the helpers
let helpers = {};

helpers.getANumber = function(){
  return 1;
}

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
    try{
      let obj = JSON.parse(str);
      return obj;
    } catch(e){
      return {};
    }
  };


// Create a SHA-256 hash
helpers.hash = (str) => {
    if(typeof(str)=='string' && str.length > 0 ){
        let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;  
    }
}

// Create a string of random alphanumeric characters, of a given length
// In production, a secure token library should be used
helpers.createRandomString = (strLength) => {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false
    if(strLength){
        // All the possible Characters that could go into the string
        let possibleCharacters = 'abcdefghijklmnopqrstuvyxyz0123456789'
        // Start the final string
        let str = '';
        for(i = 1; i <= strLength; i++){
            // Get a random character from the possible characters
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
            // Append this character to the final string
             str += randomCharacter;
        }
            return str;
    } else {
        return false;
    }
};

module.exports = helpers;
