'use strict';

class Song {
    constructor(id, artist, name) {
        this.id     = id;
        this.artist = artist;
        this.name   = name;
    }

}

Song.fromJson = obj => {
    return new Song (obj.id, obj.artist, obj.name)
}

module.exports = Song
