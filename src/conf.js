'use strict'

module.exports.config = {
	playlistLink: '0eNoY50Me7mOZ3DsHLYYLa',
	bucketParams: {
	  Bucket: 'first-set'
	},
  lambdaOpts: {
	  FunctionName: 'downloader'
	},
	spotifyCreds: {
	  clientId:     process.env.SpotifyClientId,
	  clientSecret: process.env.SpotifyClientSecret
	},
	youtubeSearchOpts: {
	  maxResults: 1,
	  key: process.env.YoutubeApiKey
	}
}
