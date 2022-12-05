import app from './app.js'
import { connectToDB } from './utils/mongoose.js'


//var express = require('express');
//var app = express();

//app.set('port', (process.env.PORT || 3000))

//app.get('/', function(req, res) {
//  var result = 'Funcionando'
//  res.send(result);
//}).listen(app.get('port'), function(){
 // console.log('Corriendo en puerto', app.get('port'));
//});

async function main() {
  await connectToDB()
  app.listen(process.env.PORT || 3000)
  console.log('Funcionando en ', 3000)
}

main()