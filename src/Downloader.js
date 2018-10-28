'use strict';

var youtubedl = require('youtube-dl');

function searchYoutube(trackName) {
  return Promise.all(playlist.body.tracks.items.map(function (item) {
                              return searchYoutube(item.track.artist+ " " + item.track.name)
                            }))
    return new Promise(function(resolve, reject) {
        search(trackName, youtubeSearchOpts, function(err, results) {
          if(err) reject(err)
          else    resolve(results)
        }) 
    })
}
module.exports.main = async (event, context) => {
	return {
   		statusCode: statusCode,
   		body: JSON.stringify({
	    message: "downloader"
   	}),
}
