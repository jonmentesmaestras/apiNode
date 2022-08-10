var fs = require('fs')
var path = require('path')

var helpers = {}
helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str)
        return obj
    }catch(e){
        return {}

    }
}

baseDir = path.join(__dirname, '/../.data/')


    fs.readFile('d:/6m1axc1expix39ru8pgw.json', 'utf8', function(err, data){

        if(!err){
            console.log("data read is: " + data)
            var parsedData = helpers.parseJsonToObject(data)
            console.log("data parsed is: " + JSON.stringify(parsedData) )
            return

        }else{
            console.log("un error hubo " + err);
        }


        
    })
