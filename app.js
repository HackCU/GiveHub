var express = require('express');
var app = express();
// var bitcoin = require('./controllers/bitcoin');

// use jade as the view engine
app.set('view engine', 'jade');

// set where the static contents are (e.g., css, js)
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index.jade')
});

app.get('/createOrganization', function(req, res){
  res.render('createOrg.jade');
});

app.get('/braintree', function(req, res){
  res.render('braintree.jade',
    {
      "organization" : req.query.handle || "Example",
      "amount" : req.query.amount || "$10"
    }
  );
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


app.set('port', (process.env.PORT || 3000))

var server = app.listen(app.get('port'), function() {

    var host = server.address().address
    var port = server.address().port
    console.log('App listening at http://%s:%s', host, port)
})
