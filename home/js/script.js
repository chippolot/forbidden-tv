buzz.defaults.preload = true;
buzz.defaults.autoplay = false;
buzz.defaults.loop = false;

var image = { width: 1280, height: 1024 };
var targetPos = { x: 400, y: 475 };
var targetDims = { width: 385, height: 295 };

var player;
var totalPlaylistWeights = 0;

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

function animateOverlay() {
    setInterval(function () {
        $('.overlay').css('opacity', Math.random()*0.3+0.4);
    }, 10);
}

function preparePlaylist() {
    totalPlaylistWeights = 0;

    $.each(videoChannelsJSON, function(categoryName, playlistCategory) {

        // compute total weight
        totalPlaylistWeights += playlistCategory.info.weight;
    });
}

function getRandomVideoDataFromCategory(categoryKey) {
    var playlistCategory = videoChannelsJSON[categoryKey];
    var videos = playlistCategory.videos;
    var randomVideo = _.sample(videos);
    return _.extend(randomVideo, {containment:'self',autoPlay:true, mute:false, volume:1, opacity:1, ratio:'4/3', loop:true, showControls:false, showYTLogo:false, stopMovieOnBlur:false});
}

function getRandomVideoData() {
    var randomWeight = Math.random() * totalPlaylistWeights;
    for (var categoryKey in videoChannelsJSON)
    {
        var playlistCategory = videoChannelsJSON[categoryKey];
        randomWeight -= playlistCategory.info.weight;
        if (randomWeight <= 0) 
        {
            return getRandomVideoDataFromCategory(categoryKey);
        }
    }
    return null;
}

function playRandomVideo() {
    var videoData = getRandomVideoData();
    player.changeMovie(videoData);
}

$(window).on("load", function() {
    $(".tv_content").show();

    preparePlaylist();
    animateOverlay();

    player = $(".player");
    player.on("YTPEnd", function(e) {
        playRandomVideo();
    });
    player.on("YTPStart", function(e) {
        $(".standby").hide();
    });
    player.YTPlayer(_.extend({onError: function(e) {
        playRandomVideo();
    }}, getRandomVideoData()));

    $(document).click(function() {
        playRandomVideo();
        sfxKnob.play();
    });
});