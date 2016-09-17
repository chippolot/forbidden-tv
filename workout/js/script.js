// create new instance of audio
// https://github.com/voronianski/soundcloud-audio.js
var scPlayer = new SoundCloudAudio('dabdf8a94b121cd6115431803c677de3');

function getRandomURLFromList(list) {
	var track = list[Math.floor(Math.random() * list.length)];
	return track ? track.url : null;
};

function playRandomSong() {
	var index = _.random(scPlayer._playlist.tracks.length-1);
	scPlayer.play({playlistIndex: index});
}

function playMusic() {
	scPlayer.resolve('https://soundcloud.com/ben-smith-58/sets/melting-music', function (playlist) {
	    scPlayer.on('ended', function () {
	    	playRandomSong();
	    });
	    playRandomSong();
	});
};

function playVideos() {
	var playlist = _.map(vidsJSON.vids, function(videoJSON) {
		var playlistEntryJSON = {containment:'body',autoPlay:true, mute:true, opacity:1, ratio:'4/3', loop:true, showControls:false, showYTLogo:false, stopMovieOnBlur:false, optimizeDisplay:true};
		return _.extend(playlistEntryJSON, videoJSON);
	});
	console.log(playlist);
	$(".player").YTPlaylist(playlist, true);
}

$().ready(function () {
	playMusic();
	playVideos();
});