var express = require('express');
var app = express();
// var bitcoin = require('./controllers/bitcoin');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/twitter', function(req,res){
    var stream = require('./controllers/twitter')();
});

app.get('/sendEmail', function(req, res){
    var email = require('./controllers/mandrill')(req, res);
})

/*
app.get('/sendTxn/:from/:to', function(req, res){
    bitcoin.sendTxn(req,res);
});
*/


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
