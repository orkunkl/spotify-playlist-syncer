'use strict'

module.exports.config = {
	playlistLink: '0eNoY50Me7mOZ3DsHLYYLa',

	bucketParams: {
	  Bucket: 'first-set'
	},

  snsOpts: (song) => {
  	return {
	  	Message: JSON.stringify(song),
    	TopicArn: `arn:aws:sns:eu-central-1:${process.env.AWSAccountID}:test-topic`
  	}
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
