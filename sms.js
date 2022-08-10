const accountSid = "AC157ad5529a44f178bab5bcaeac41ec77";  //process.env.TWILIO_ACCOUNT_SID;
const authToken = "e4a76a0991e075096fbb8fc5a826da6c"      //process.env.TWILIO_AUTH_TOKEN"";

const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Hola Luis Carlos',
     from: '+12057828201',
     to: '+573005484401'
   })
  .then(message => console.log(message.sid));