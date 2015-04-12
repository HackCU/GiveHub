
var stream = function(){
    var Twitter = require('twitter');
    var orgs = require('../data/orgs.json');
    var _ = require('lodash');
    var config = require('../config.json');

    var client = new Twitter({
      consumer_key: 'sVfnQxrkS2tSLUXmFs1T8eWDO',
      consumer_secret: 'w7rP7Ee1DDts9Q4Zg1I4LtxaltsHaCVNWSOPdycrKULz2m6lHk',
      access_token_key: '3148870314-CpamGhp6bsONWRUw8RBREeMx0vo2NCZHXQhx0nr',
      access_token_secret: 'gxMo7p8XSf3MbGoQTezSagY1Xm8aChNfken43oI7sfJFY'
    });

    console.log('Twitter initialized and listening');

    client.stream('statuses/filter', {track: '#GiveWithGiveHub'}, function(stream) {
        /* All data for our app */
      stream.on('data', function(app_tweet) {
          addToUI(app_tweet);
        /* Watch single user for orgs handle*/

        /* TODO: make user matter */
        _.forEach(orgs, function(org) {
          if ( app_tweet.text.search( org.handle ) != -1 ) {
            /* Contains handle of relevant org */
            console.log( 'contains relevant org info' );
            var tweet = app_tweet;
            var amount = nlpDollars( tweet.text );
            console.log( tweet.user.screen_name + ' tweeted: ' + tweet.text + ' with donation of ' + amount );
            /* Do stuff with this tweet */
            tweetBack( tweet.user.screen_name, org.handle, amount );

          }
          else {
            console.log( 'correct hashtag but this org does not match' );
          }
        })
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
      var url = shortenURL(buildURL(orgHandle, amount));
      var status =  "Thanks for donating to @" + orgHandle + ", @" + userScreenName + ".  Please visit: " + url;

      client.post('statuses/update', {status: status},  function(error, tweet, response){
        if(error) throw JSON.stringify(error);
        console.log("successfully tweeted back.");
        return;
      });
    }

    function buildURL(orgHandle, amount){
      return config.deploy.url + "/donate?handle=" + orgHandle + "&amount=" + amount;
    }

    function shortenURL(url, cb){
      var rest = require('restler');

      url = encodeURI(url);
      rest.get("https://api-ssl.bitly.com/v3/shorten?access_token=b3faf3c5612c590fa8017c870050bdbedb31dbc1&longUrl=" + url, function(err, data){
        if (err) {
          console.log(err);
          cb(url);
          return;
        } else {
          console.log(data);
          var shortened = data.data.url;
          cb(shortened);
          return;
        }

      });
    }

    shortenURL('https://www.google.com?id=100&poo=7', function(err, data){
      console.log(data);
    });

}

module.exports = stream;