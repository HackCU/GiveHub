
var stream = function(){
    var Twitter = require('twitter');
    var user = require('../data/users.json')[0];
    var org = require('../data/orgs.json')[0];
    var _ = require('lodash');
    var config = require('../config.json');

    var client = new Twitter({
      consumer_key: 'sVfnQxrkS2tSLUXmFs1T8eWDO',
      consumer_secret: 'w7rP7Ee1DDts9Q4Zg1I4LtxaltsHaCVNWSOPdycrKULz2m6lHk',
      access_token_key: '3148870314-CpamGhp6bsONWRUw8RBREeMx0vo2NCZHXQhx0nr',
      access_token_secret: 'gxMo7p8XSf3MbGoQTezSagY1Xm8aChNfken43oI7sfJFY'
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