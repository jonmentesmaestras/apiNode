const apiCallFromNode = require('./nodeJSCall')

apiCallFromNode.callApi(function(response){
    console.log('the response is', response)
  })