var bgm;

buzz.defaults.preload = 'none';
buzz.defaults.autoplay = true;
buzz.defaults.loop = false;

function getRandomURLFromList(list) {
	var track = list[Math.floor(Math.random() * list.length)];
	return track.url;
};

function playNextTrack() {
	var url = getRandomURLFromList(tracksJSON.tracks);
	
	if (bgm != null) {
		bgm.stop();
	}

	bgm = new buzz.sound(url);
	bgm.play();
	bgm.bind("ended", function(e){ playNextTrack(); });
};

function playVideo() {
	var url = getRandomURLFromList(vidsJSON.vids);
	$(".player").YTPlayer({videoURL:url});
}

$().ready(function () {
	playNextTrack();
	playVideo();
});

$(document).bind( "click tap", function(e){ 
	if (bgm) bgm.play(); 
} );