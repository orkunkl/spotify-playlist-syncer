'use strict';

const SpotifyWebApi = require('spotify-web-api-node');
const search = require('youtube-search');
const vandium = require('vandium');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SpotifyClientId,
  clientSecret: process.env.SpotifyClientSecret
});

const youtubeSearchOpts = {
  maxResults: 1,
  key: process.env.YoutubeApiKey
};

function searchYoutube(trackName) {
    return new Promise(function(resolve, reject) {
        search(trackName, youtubeSearchOpts, function(err, results) {
          if(err) reject(err)
          else    resolve(results)
        }) 
    })
}

module.exports.main = vandium.api() 
                      .GET((event) => {
                        spotifyApi.clientCredentialsGrant()
                          .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
                          .then((a) => spotifyApi.getPlaylist('0eNoY50Me7mOZ3DsHLYYLa'))
                          .then((playlist) => {
                            return Promise.all(playlist.body.tracks.items.map(function (item) {
                              return searchYoutube(item.track.name)
                            }))
                          })
                          .catch((err) => console.log(err))
                      })

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
