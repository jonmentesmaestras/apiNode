// Dependencies
const https = require('https');
var http = require('http');
var url = require('url');
const { REPL_MODE_SLOPPY } = require('repl');
var StringDecoder = require('string_decoder').StringDecoder



  // Sample URL
const myurl = 'https://swapi.dev/api/people/1/';

const callExternalApiUsingHttp = (callback) =>{
  https.get(myurl, (resp)=>{
    let data = ''
    resp.on('data', (chunk)=>{
      data += chunk
    })

    resp.on('end', ()=>{
      return callback(data)
      //console.log(data)
    })

  }).on('error', (err)=>{
    console.log('Error: ' + err.message)
  })
}

module.exports.callApi = callExternalApiUsingHttp






