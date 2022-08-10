var crypto = require('crypto')

var  helpers = {}


helpers.hash = function(str){
    return str
}

helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str)
        return obj
    }catch(e){
        return {}

    }
}

// Create a string of random alphanumeric characters, of a given length

helpers.createRandomString = function(strLength){
    var possibleCharacters = 'abcdefghiklmnopqrstuvwxyz0123456789'

    // Start the final string
    var str = ''
    for(i=1;i<=strLength;i++){
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length))
        str+= randomCharacter
    }

    return str


}


module.exports = helpers