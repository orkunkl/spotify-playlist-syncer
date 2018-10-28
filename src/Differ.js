'use strict';

const aws           = require('aws-sdk');
const SpotifyWebApi = require('spotify-web-api-node')
const search        = require('youtube-search')
const vandium       = require('vandium')

const s3Client = new aws.S3()
const lambda   = new aws.Lambda()

const Song = require('./models/Song.js');
const conf = require('./conf.js');

const spotifyApi = new SpotifyWebApi({
  clientId:     conf.config.spotifyCreds.clientId,
  clientSecret: conf.config.spotifyCreds.clientSecret
})

module.exports.main = vandium.api() 
                      .GET((event) => {
                        spotifyApi.clientCredentialsGrant()
                          .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
                          .then((_)    => spotifyApi.getPlaylist(conf.config.playlistLink))
                          .then(findSongsToDownload)
                          .then((songsToDownload) => console.log(songsToDownload))
                          .catch((err) => console.log(err))
                      })

function findSongsToDownload(playlist) {
  return s3Client.listObjects(conf.config.bucketParams).promise().then((ss) => {
    const playlistSongs = playlist.body.tracks.items.map((item) => new Song(item.track.id, item.track.artist,item.track.name))
    return playlistSongs.filter((song) => {
      return !ss.Contents.includes(song.id);
    })
  })
}                      
