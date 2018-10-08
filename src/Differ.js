'use strict';

var SpotifyWebApi = require('spotify-web-api-node');
var search = require('youtube-search');

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SpotifyClientId,
  clientSecret: process.env.SpotifyClientSecret
});

var youtubeSearchOpts = {
  maxResults: 1,
  key: process.env.YoutubeApiKey
};

var lambda = new aws.Lambda()
var lambdaOpts = {
  FunctionName: 'download'
}

module.exports.main = async (event, context) => {
  var statusCode;
  var message;

  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.getPlaylist('0eNoY50Me7mOZ3DsHLYYLa')
        .then(function(data) {
        	var tracks = data.body.tracks.items;
          tracks.forEach(track => 
            search(track.name, youtubeSearchOpts, function(err, results) {
              if(err) return console.log(err);

            }));          
        })
        .catch(function(err) {
          console.error('Something went wrong!', err);
        });
    },
  ).catch(function(err) {
      console.error('Something went wrong when retrieving an access token', err);
    });
  var diff = [1,4,6].diff([1, 2, 3]);
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: diff
    }),
  };

};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
