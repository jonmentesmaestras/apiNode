const handlers = {}

handlers.sample = ()=>{return "the sample function"}

handlers.notFound = ()=>{return "Not Found"}

const router = {
    'sample' : handlers.sample
  }

const  trimmedPath = "sample"



console.log('router[trimmedPath] ', router['sample'])

var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

console.log('chosenHandler ', chosenHandler) 

console.log('chosenHandler ', chosenHandler()) 
