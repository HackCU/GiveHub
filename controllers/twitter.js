
var stream = function(){
    var Twitter = require('twitter');
    var user = require('../data/users.json')[0];
    var org = require('../data/orgs.json')[0];
    var _ = require('lodash');
    var config = require('../config.json');

    var client = new Twitter({
      consumer_key: 'ZGZbn8Ub3CLK5czKbJ95q2q0m ',
      consumer_secret: '7ak6OHpgNt9zCOY414fSDmYyQEyfiyagLSmBIkySsB6HPLVtbK',
      access_token_key: '3150658694-2atGSRb4hPi9AV8q06iOERWpcSf4h03EnZIzOXB',
      access_token_secret: '8Eghx1DJaIK978n3bVbM9qujhP2oas0lgEpl7vSheXxTz'
    });

    console.log('Twitter initialized and listening');

    client.stream('statuses/filter', {track: '#GiveWithSouare'}, function(stream) {
        /* All data for our app */
      stream.on('data', function(app_tweet) {
          addToUI(app_tweet);
        /* Watch single user for orgs handle*/
        var params = { track: org.handle };
        /* TODO: make user matter */
        if( app_tweet.text.search(params.track) != -1 ){
            /* Contains handle of relevant org */
            console.log('contains relevant org info');
            var tweet = app_tweet;
            var amount = nlpDollars(tweet.text);
            console.log(tweet.user.screen_name + ' tweeted: ' + tweet.text + ' with donation of ' + amount);
            /* Do stuff with this tweet */
            tweetBack(tweet.user.screen_name, params.track, amount);

        }else {
            console.log('correct hashtag but no matching org');
        }
      });

      stream.on('error', function(error) {
        console.log(error);
        console.log('Twitter no longer being filtered.');
        //stream.close();
        return;
      });
    });

    function addToUI(tweet){
        /* Add tweet to ui because it has our hashtag */
        console.log('adding tweet to ui');
        // TODO;
    }

    function nlpDollars(tweetText){
      // TODO: Extend to work with more than $
      var moneyIndex = _.indexOf(tweetText, '$');
      if( ( moneyIndex != -1)){
        var outStr = '';
        var i = moneyIndex;

        while(!isNaN(tweetText[i]) || tweetText[i] === '$'){
          outStr += tweetText[i];
          i++;
        }

        return outStr;
      }
    }

    function tweetBack(userScreenName, orgHandle, amount){
      var url = buildURL(orgHandle, amount);
      var status =  "Thanks for donating to @" + orgHandle + ".  Please visit: " + url;

      client.post('statuses/update', {status: status},  function(error, tweet, response){
        if(error) throw JSON.stringify(error);
        console.log("successfully tweeted back.");
        return;
      });
    }

    function buildURL(orgHandle, amount){
      return config.deploy.url + "/donate?handle=" + orgHandle + "&amount=" + amount;
    }

}

module.exports = stream;