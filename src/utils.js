'use strict'

module.exports.searchYoutube = (trackName) => {
  return new Promise(function(resolve, reject) {
      search(trackName, youtubeSearchOpts, function(err, results) {
        if(err) reject(err)
        else    resolve(results)
      }) 
  })
}