
var stream = function(){
    var Twitter = require('twitter');
    var user = require('../data/users.json')[0];
    var org = require('../data/orgs.json')[0];
    console.log(user);

    var client = new Twitter({
      consumer_key: 'sVfnQxrkS2tSLUXmFs1T8eWDO',
      consumer_secret: 'w7rP7Ee1DDts9Q4Zg1I4LtxaltsHaCVNWSOPdycrKULz2m6lHk',
      access_token_key: '3148870314-CpamGhp6bsONWRUw8RBREeMx0vo2NCZHXQhx0nr',
      access_token_secret: 'gxMo7p8XSf3MbGoQTezSagY1Xm8aChNfken43oI7sfJFY'
    });


    client.stream('statuses/filter', {track: '#GiveWithSouare'}, function(stream) {
        /* All data for our app */
      stream.on('data', function(app_tweet) {
          addToUI(app_tweet);
        /* Watch single user for orgs handle*/
        var params = { screen_name: user.handle, track: org.handle };
        /* TODO: make user matter */
        if( app_tweet.text.search(params.track) != -1 ){
            /* Contains handle of relevant org */
            console.log('contains relevant org info');
            var tweet = app_tweet;
            console.log(tweet.user.screen_name + ' tweeted: ' + tweet.text);
        }else {
            console.log('correct hashtag but no matching org');
        }
      });

      stream.on('error', function(error) {
        throw error;
      });
    });

    function addToUI(tweet){
        /* Add tweet to ui because it has our hashtag */
        console.log('adding tweet to ui');
        // TODO;

    }
}

module.exports = stream;
