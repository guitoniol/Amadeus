class DiscordQueueModel {
    textChannel;
    voiceChannel;
    connection;
    player;
    songs;
    volume;
    playing;
    looping;
    paused;
    pageToken;
    lastPlaylist;
    lastMember;

    constructor() {
        this.textChannel = null;
        this.voiceChannel = null;
        this.connection = null;
        this.player = null;
        this.songs = [];
        this.volume = 5;
        this.playing = false;
        this.looping = false;
        this.paused = false;
        this.pageToken = null;
        this.lastPlaylist = null;
        this.lastMember = null;
    }
}

module.exports = DiscordQueueModel;