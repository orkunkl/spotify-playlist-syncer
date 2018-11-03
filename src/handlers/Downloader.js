'use strict'

process.env['PATH'] += ':' + process.env['LAMBDA_TASK_ROOT']

const aws           = require('aws-sdk'),
      vandium       = require('vandium'),
      ytdl          = require('ytdl-core'),
      youtubeSearch = require('youtube-search'),
      path          = require('path'),
      fs            = require('fs')

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
console.log(ffmpegPath)
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

const s3Client = new aws.S3(),
      s3Stream = require('s3-upload-stream')(s3Client)

const Song  = require('../models/Song'),
      conf  = require('../conf')


module.exports.download = vandium.sns((records, context) => {
                              console.log(records)
                              const song      = JSON.parse(records[0].Sns.Message)
                              const songParam = toSearchParameter(song.artist, song.name)

                              console.log(song)
                              console.log(songParam)

                              searchYoutube(songParam)
                                .then(search => search[0].link)
                                .then(link => 
                                  downloadFromYoutubeAndExtract(link, songParam)
                                    .pipe(uploadToS3(song))
                                )
                                .catch(err => console.error(err))
                            }) 

function toSearchParameter(artist, name) {
  return artist + name
}

function searchYoutube(searchParams) {
  return new Promise(function(resolve, reject) {
      youtubeSearch(searchParams, conf.config.youtubeSearchOpts, function(err, results) {
        if(err) reject(err)
        else    resolve(results)
      }) 
  })
}

function downloadFromYoutubeAndExtract(link, songName) {
  const videoStream = ytdl(link)
   
  videoStream.on('info', (info) => console.log(`Download started for ${songName}`))
             .on('error',(err)  => console.error(`Download error for  ${songName}`, err))
             .on('end',  (end)  => console.log(`Download ended for ${songName}`))

  return ffmpeg(videoStream)
          .audioCodec('libmp3lame')
          .toFormat('mp3')
} 

function uploadToS3(song) {
  const metadata = new Map(Object.entries({ id: song.id}))

  const s3params = Object.assign({"Key": song.artist + " - " + song.name + ".mp3", 'Metadata': metadata }, conf.config.bucketParams)
  
  const stream = s3Stream.upload(s3params)

  return stream.on('uploaded',(details) => console.log(details))
               .on('error',   (err)     => console.error(err))
}
