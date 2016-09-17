var bgm;

buzz.defaults.preload = 'none';
buzz.defaults.autoplay = true;
buzz.defaults.loop = false;

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

function playSong() {
	scPlayer.resolve('https://soundcloud.com/bombaestereo/fiesta-burns-remix', function (track) {

	    scPlayer.play();
	    scPlayer.on('ended', function () {
	    	scPlayer.play();
	    });
	});
}

function playVideos() {
	var playlist = _.map(vidsJSON.vids, function(videoJSON) {
		var playlistEntryJSON = {containment:'body',autoPlay:true, mute:true, opacity:1, ratio:'4/3', loop:true, showControls:false, showYTLogo:false, stopMovieOnBlur:false, optimizeDisplay:true};
		return _.extend(playlistEntryJSON, videoJSON);
	});
	$(".player").YTPlaylist(playlist, true);

	var init = false;
	$(".player").on("YTPStart", function(e) {
		if (init)
		{
			return;
		}
		init = true;

		bgm = new buzz.sound("http://best-muzon.me/dl/q-DxRCEvy02Nto_-khMz4w/1474132424/songs12/2015/11/bomba-estereo-will-smith-fiesta-burns-remix-(best-muzon.me).mp3");
		bgm.bind("playing", function(e){ 
			$(".counting_numbers_container").append(`
			<div class='counting_numbers'>
				<span>1</span>
				<span>2</span>
				<span>3</span>
				<span>4</span>
			</div>`);
		});
		bgm.bind("ended", function(e){ bgm.play(); });
		bgm.play();
	});
}

$().ready(function () {
	//playSong();
	playVideos();
});