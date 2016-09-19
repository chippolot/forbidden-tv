buzz.defaults.preload = true;
buzz.defaults.autoplay = false;
buzz.defaults.loop = false;

var image = { width: 1280, height: 1024 };
var targetPos = { x: 415, y: 495 };
var targetDims = { width: 370, height: 275 };

var tv_content = $('.tv_content');

$(document).ready(positionTVContent);
$(window).resize(positionTVContent);

function positionTVContent() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    // Get largest dimension increase
    var xScale = windowWidth / image.width;
    var yScale = windowHeight / image.height;
    var scale;
    var yOffset = 0;
    var xOffset = 0;

    if (xScale > yScale) {
        // The image fits perfectly in x axis, stretched in y
        scale = xScale;
        yOffset = (windowHeight - (image.height * scale)) / 2;
    } else {
        // The image fits perfectly in y axis, stretched in x
        scale = yScale;
        xOffset = (windowWidth - (image.width * scale)) / 2;
    }

    var tv_content = $(".tv_content")
    var x = (targetPos.x) * scale + xOffset;
    var y = (targetPos.y) * scale + yOffset;
    tv_content.css('left', x);
    tv_content.css('top', y);

    var tv_content_children = $(".tv_content *");
    tv_content_children.css('width', targetDims.width * scale);
    tv_content_children.css('height', targetDims.height * scale);
}

var sfxKnob = new buzz.sound("data/knob.wav", {
    volume: 100
});

function preparePlaylist(videoList) {
    return _.map(videoList, function(videoJSON) {
        var playlistEntryJSON = {containment:'self',autoPlay:true, mute:false, volume:1, opacity:1, ratio:'4/3', loop:true, showControls:false, showYTLogo:false, stopMovieOnBlur:false};
        return _.extend(playlistEntryJSON, videoJSON);
    });
}

function appendPlaylist(playlist, newPlaylist) {
    var numSample = _.random(newPlaylist.info.minSample, newPlaylist.info.maxSample);
    if (numSample == 0) {
        return playlist;
    }
    return playlist.concat(preparePlaylist(_.sample(newPlaylist.videos, numSample)));
}

function playVideos() {
    var playlist = [];
    playlist = appendPlaylist(playlist, videosJSON.infomercials);
    playlist = appendPlaylist(playlist, videosJSON.commercials);
    playlist = appendPlaylist(playlist, videosJSON.chairs);
    playlist = appendPlaylist(playlist, videosJSON.workout);
    playlist = appendPlaylist(playlist, videosJSON.toonIntros);

    $(".player").YTPlaylist(playlist, true);
    $(".player").on("YTPStart", function(e) {
        $(".standby").hide();
    });
    $(document).click(function() {
        $(".player").playNext();
        sfxKnob.play();
    });
}

function animateOverlay() {
    setInterval(function () {
        $('.overlay').css('opacity', Math.random()*0.3+0.4);
    }, 10);
}

$(".tv_content").hide();

$().ready(function () {
    $(".tv_content").show();
    playVideos();
    animateOverlay();
});