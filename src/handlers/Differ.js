'use strict';

const aws           = require('aws-sdk')
const SpotifyWebApi = require('spotify-web-api-node')
const vandium       = require('vandium')

const s3Client = new aws.S3()
const sns      = new aws.SNS()

const Song = require('../models/Song.js')
const conf = require('../conf.js')

const spotifyApi = new SpotifyWebApi({
  clientId:     conf.config.spotifyCreds.clientId,
  clientSecret: conf.config.spotifyCreds.clientSecret
})

module.exports.diff = vandium.api() 
                      .GET((event) => {
                        spotifyApi.clientCredentialsGrant()
                          .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
                          .then((_)    => spotifyApi.getPlaylist(conf.config.playlistLink))
                          .then(findSongsToDownload)
                          .then((songsToDownload) => {
                            var promises = songsToDownload.map(song => {
                              console.log(song)
                              return sns.publish(conf.config.snsOpts(song)).promise()
                            })
                            return Promise.all(promises).then(() => console.log('downloading songs'))
                          })
                          .catch((err) => console.error(err))
                      })

function findSongsToDownload(playlist) {
  return s3Client.listObjects(conf.config.bucketParams).promise().then((ss) => {
    console.log(ss.Contents)
    const playlistSongs = playlist.body.tracks.items.map((item) => {
      var artistName = item.track.artists.map(a => a.name).join(" ")
      return new Song(item.track.id, artistName, item.track.name)
    })
    const metadataList = ss.Contents.map(x => x.metadata)
    return playlistSongs.filter((song) => {
      return !metadataList.includes(song.id);
    })
  })
}                      
