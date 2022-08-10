// Dependencies
const { stat } = require('fs/promises');
var http = require('http');
const { type } = require('os');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder

var _data = require('./lib/data')
var handlers = require('./lib/handlers')
var helpers = require('./lib/helpers')

/*_data.create('test', 'newFile',{'foo':'bar'}, function(err){
  console.log('The error was', err)
} )*/

/*_data.read('test', 'newFile', function(err, data){
  console.log('this is the error ', err, 'this is the data ', data)
})*/

/*_data.update('test', 'newFile',{"name":"Jon"}, function(err, data){
  console.log('this is the error ', err)
})*/

/*
_data.delete('test', 'newFile', function(err, data){
  console.log('this is the error ', err)
})*/


 // Configure the server to respond to all requests with a string
var server = http.createServer(function(req,res){

  // Parse the url
  // set to true for the second argument in order to parse the entire query string
  var parsedUrl = url.parse(req.url, true);
  

  // Get the path
  var path = parsedUrl.pathname
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');
  
  // get the query string as an object
  var queryStringObject = parsedUrl.query

  //get the http method
  var method = req.method.toLowerCase()

  // get the http headers
  var httpHeaders = req.headers

  // geth the http payload
  var decoder = new StringDecoder('utf-8')

  var buffer = ''

  req.on('data', function(data){
    buffer += decoder.write(data)
  })
  
  req.on('end', function(data){
    buffer += decoder.end()

    //pick the proper handler. Use the notFound handler in case there is 
    // not any match for handlers name defititions.
    
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

    

    // Construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath, 
      'queryStringObject' : queryStringObject,
      'method': method,
      'headers' : httpHeaders, 
      'payload' : helpers.parseJsonToObject(buffer)

    }

    //route the request
    chosenHandler(data, function(statusCode, payload){
      // check status code
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200

      // check the payload
      console.log('payload is', payload)

      //payload =  ? payload : {}

      if(typeof(payload) != 'object'){
     //   payload = {}
      }

      console.log('payload is', typeof(payload))
      

      var payloadString = JSON.stringify(payload)

      res.setHeader('Content-Type', 'application/json')
      
      res.writeHead(statusCode)

      res.end(payloadString)

      console.log ('Returning this response ', statusCode, payloadString)

    })


  })
  


});

// Start the server
server.listen(3000,function(){
  console.log('The server is up and running now');
});


//Define request router
const router = {
  'ping' : handlers.ping,
  'callapi': handlers.callapi, 
  'users': handlers.users,
  'tokens': handlers.tokens
}


