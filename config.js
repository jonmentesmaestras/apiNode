// create and export configuration variables

var enviroments = {}

enviroments.staging = {
    'httpPort':3000,
    'httpsPort':3001,
    'envName' : 'staging',
    'hashingSecret': 'thisIsASecret',
    'maxChecks':5
}

enviroments.production = {
    'httpPort' : 5000,
    'hashingSecret': 'thisAlsoIsASecret',
    'maxChecks':5
}

//var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? 

//var environmentToExport = typeof

//module.exports = enviroment