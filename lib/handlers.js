/*
*  Request Handlers
*/

// Dependencies
var _data = require('./data')
var helpers = require('./helpers')
const apiCallFromNode = require('./../nodeJSCall')
const { type } = require('os')

// Define the handler
const handlers = {}


handlers.users = function (data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete']
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data, callback)
    }else{
        callback(405)
    }

}

// Container for the users submethods 

handlers._users = {}

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
handlers._users.post = function (data, callback){
    //check that all required fields are filled out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim(): false
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim(): false
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim(): false
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim(): false
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement  == true ? true : false

    if(firstName && lastName && phone && password && tosAgreement){
      
      _data.read('users', phone, function(err, data){
        //error reading means the user does not exist
        if(err){
          var hashedPassword = helpers.hash(password) //TODO: The hash in helpers
          
          // create the user object
          var userObject = {
            'firstName': firstName, 
            'lastName': lastName, 
            'phone': phone, 
            'hashedPassword': hashedPassword,
            'tosAgreement': true  
          }

          // store the user
          _data.create('users',phone, userObject, function(err){
             if (!err){
                callback(200)
              } else {
                console.log(err)
                callback(500, {'Error' : 'Could not create the new user'})
              }
          } )

        } else {
          callback(400, {"Error" : "An User with that phone number already exists"})
        }
      })

    } else {
      callback(400, {'Error':'Missing Required Fields'})
    }

}

// Users Get
//required: Phone
//@TODO request authentication
handlers._users.get = function (data, callback){
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false
    if(phone){

      //Get the token from headers
      var token = typeof(data.headers.token) == 'string' ? data.headers.token : false

      //Verify that the given token is valid for the phone number

      handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
        if(tokenIsValid){

          _data.read('users', phone, function(error, data){
            if(!error && data){
              //remove password
              delete data.hashedPassword
              const obj = JSON.parse(data);
              callback(200, obj)
            } else{
              callback (404)
            }
          })
        }else{
          callback(403, {'Error':'Missing required token in header to GET USERS, or token is invalid'})
        }
      })


    }else{
      callback(400, {'Error': 'Missing required field: Phone'})
    }
}


//Required Data: phone
//Optional Data: firstName, lastName, password (at least one must be specified)
handlers._users.put = function (data, callback){
  // check the required Data
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
  
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim(): false
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim(): false
  
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim(): false

  if(phone){

    if(firstName || lastName || password ){

    //Get the token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false

    handlers._tokens.verifyToken(token, phone, function(tokenIsValid){
     
      if(tokenIsValid){
        //Lookup the user
        _data.read('users', phone, function(err, userData){
            if(!err && userData){
              //update fields
              if(firstName){
                userData.firstName = firstName
              }

              if(lastName){
                userData.lastName = lastName
              }
              if(password){
                userData.password = password
              }

              //Store the new updates
              _data.update('users', phone, userData, function(err){
                if(!err){
                  callback(200)
                }else{
                  callback(500,{'Error':'Could not update the User'} )
                }
              })

            }else{
              callback(400, {'Error':'User does not exist'} )
            }

          })
      } else{
        callback(403, {'Error':'Missing required token in header, or token is invalid'})
      }
    })

      

    } else{
      callback(400, {'Error':'Missing Fields to update'})  
    }

  } else{
    callback(400, {'Error':'Missing required Field'})
  }
}

handlers._users.delete = function (data, callback){
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false
  if(phone){
    _data.read('users', phone, function(error, data){
      if(!error && data){
        _data.delete('users', phone, function(err){
          if(!err){
            callback(200)
          } else{
            callback(500, {'Error': 'Could not delete the specify user'})
          }
        })

      } else{
        callback (400, {'Error': 'Could not delete the specify user'})
      }
    })
  }else{
    callback(400, {'Error': 'Missing required field: Phone'})
  } 
}


handlers.callapi = function (data, callback){
  
  apiCallFromNode.callApi(function(response){
    
    const obj = JSON.parse(response);

    callback(200, obj)
    //callback(406, response)
    //console.log('the response is', response)
  
  })
  

} 

handlers.ping = (data, callback) =>{
  //console.log("the data dump is", data)
  callback(200)
}

handlers.tokens = function (data, callback){
  var acceptableMethods = ['post', 'get', 'put', 'delete']
  if(acceptableMethods.indexOf(data.method) > -1){
      handlers._tokens[data.method](data, callback)
  }else{
      callback(405)
  }

}


//container for all the tokens methods

handlers._tokens = {}


//Tokens - post
//Required Data: phone, password
//Optiona Data: none
handlers._tokens.post = function(data, callback){
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim(): false
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim(): false

  if(phone && password){
    _data.read('users', phone, function(err, userData){
      if(!err && userData){
        //TODO: Compare passwords (hashed)
        
        // create token and set expiration to 1 hour in the future
        var tokenId = helpers.createRandomString(20)

        var expires = Date.now() + 1000 * 60 * 60

        var tokenObject = {
          'phone': phone,
          'id': tokenId,
          'expires': expires
        }

        //Store tokens

        _data.create('tokens',tokenId, tokenObject, function(err){
          if(!err){
            callback(200, tokenObject)
          } else{
            callback(500, {'Error':'Could not create new token'})
          }
        })



      } else {
        callback(400, {'Error':'Could not find the specified user'})
      }
    })
  }

}

handlers._tokens.get = function(data, callback){
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false
  if(id){
    _data.read('tokens', id, function(error, tokenData){
      if(!error && tokenData){
        //remove password

        callback(200, tokenData)
      } else{
        callback (404)
      }
    })
  }else{
    callback(400, {'Error': 'Missing required field: id'})
  }

  

}

//required: id and extend
//optional data is none

handlers._tokens.put = function(data, callback){
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim(): false
  var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true: false

  if(id && extend){
    //lookup token
    _data.read('tokens', id, function(err, tokenData){
      console.log("token data is " + tokenData)
      console.log("expires " + tokenData.expires)
      
      if(!err && tokenData){

        if(tokenData.expires > Date.now()){
          //set the expiration 1 hour from now
          tokenData.expires = Date.now() * 1000 * 60 * 60

          //Store new update
          _data.update('tokens', id, tokenData, function(err){
            if(!err){
              callback(200)
            }else{
              callback(500, {'Error':'could not update token expiration'})
            }
          })
        } else{
          callback(400, {'Error': 'The token cannot be extended'})
        }


      } else{
        callback(400, {'Error': 'Token does not exist'})
      }
    })

  } else{
    callback(400, {'Error': 'Missing required fields or fields are invalid'})
  }

  
}

handlers._tokens.delete = function(data, callback){
  
}

handlers._tokens.verifyToken = function(id, phone, callback){

  //lookup the token
  _data.read('tokens', id, function (err, tokenData){
    console.log("the token data is" + tokenData)
    var tkData = JSON.parse(tokenData)
    if(!err ){
      
      console.log("the phone is " + tkData.phone)

      if(tkData.phone == phone && tkData.expires > Date.now()){

        callback(true)

      } else{

        callback(false)
      }

    }else {
      callback(false)
    }
  })

}

handlers.checks = function (data, callback){
  var acceptableMethods = ['post', 'get', 'put', 'delete']
  if(acceptableMethods.indexOf(data.method) > -1){
      handlers._checks[data.method](data, callback)
  }else{
      callback(405)
  }

}

handlers._checks = {}

// Required: protocol, url, method, successCodes, timeOutSeconds

handlers._checks.post = function (data, callback){
  //validate inputs
  var protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1  ? data.payload.protocol : false  
  var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim(): false
  var method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1  ? data.payload.method : false  
  var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes: false
  var timeOutSeconds = typeof(data.payload.timeOutSeconds) == 'number' && data.payload.timeOutSeconds % 1 === 0 && data.payload.timeOutSeconds >= 1 && data.payload.timeOutSeconds <= 5 ? data.payload.timeOutSeconds: false

  if(protocol && url && method && successCodes && timeOutSeconds){
    
  }

}


//Not found handler
handlers.notFound = function (data, callback){
  callback(404, {} )
}


module.exports = handlers