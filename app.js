var express = require('express');
var app = express();
var config = require('./config.json');
var orgs = require('./data/orgs.json');
if (config.twitter.stream){
  var stream = require('./controllers/twitter')();
} else {
  console.log('Twitter not being run on server');
}

// use jade as the view engine
app.set('view engine', 'jade');

// set where the static contents are (e.g., css, js)
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index.jade', {
    orgs: orgs
  })
});

app.get('/createOrganization', function(req, res){
  res.render('createOrg.jade');
});

app.get('/donate', function(req, res){
  res.render('donate.jade',
    {
      "organization" : req.query.handle,
      "amount" : req.query.amount
    }
  );
});

app.get('/sendEmail', function(req, res){
    var email = require('./controllers/mandrill')(req, res);
})



app.post('/newOrganization', function(req, res){
  //var name = req.body.name;
  console.log(req.body);
  res.redirect('/');
});

app.set('port', (process.env.PORT || 3000))

var server = app.listen(app.get('port'), function() {

    var host = server.address().address
    var port = server.address().port
    console.log('App listening at http://%s:%s', host, port)
})

