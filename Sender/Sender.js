"use strict";
(function() {
    var appid = "~mediaPlayerDemo"; //Unique id of your application, must start with a ~
    var matchstickIPAddress = "192.168.1.13"; //IP address of the matchstick
    var receiverAppUrl = "http://192.168.1.2/Matchstick-Video-Player/Receiver/Receiver.html"; //Url of the page to load on the receiver
    var timeout = -1; //after not communicating with the sender for this many milliseconds return to the default matchstick screen. -1 means don't timeout
    var useInterprocessCommunication = true; //not sure what this means for my application
    var isRunning = false;
    var isPlaying = false;
    var messageChannel; //used to send messages between sender and receiver
    var senderDaemon = new SenderDaemon(matchstickIPAddress, appid); //comes from the sender api, is the object which will be used to communicate with the matchstick    
    
    var setSource = document.getElementById("setSource");
    var playPause = document.getElementById("playPause");
    
    
    senderDaemon.on("appopened", function (channel) {
        messageChannel = channel;
    });

    document.getElementById("toggleAppStatus").onclick  = function(){
        if(isRunning)
        {
            setSource.className = "disabled";
            playPause.className = "disabled";            
            this.innerHTML = "Launch App";
            senderDaemon.closeApp();
        }
        else 
        {
            setSource.className = "";
            playPause.className = "";
            this.innerHTML = "Close App";
            senderDaemon.openApp(receiverAppUrl, timeout, useInterprocessCommunication);
        }
        
        isRunning = !isRunning;
    };
    setSource.onclick = function(){
        if(this.className.indexOf("disabled") >= 0)
            return alert("App must be running on receiver before you can send a message.\nPlease click launch app, then try again");
        
        var message = {
            type:"video",
            properties:{
                src: "Source URL Here",
            }
        };
        messageChannel.send(JSON.stringify(message)); //messages must be stringified if json
    };
    playPause.onclick = function(){
        if(this.className.indexOf("disabled") >= 0)
            return alert("App must be running on receiver before you can send a message.\nPlease click launch app, then try again");
        
        playPause.innerHTML = isPlaying ? "Play" : "Pause";
        
        var message = {
            type:"video",
            commands : [isPlaying ? "pause" : "play"]
        };
        
        messageChannel.send(JSON.stringify(message)); //messages must be stringified if json
        isPlaying = !isPlaying;
    };
})();


/*
        poster<String> - poster image
        height<String>
        width<String>
        audioTracks<AudioTrackList>
        autoplay<Boolean>
        buffered<TimeRanges>(Read Only)
        controller<MediaController>
        controls<Boolean> - show controls
        crossOrigin<String>
        currentSrc<String>(Read Only)
        currentTime<double> - current playback time in seconds
        defaultMuted<Boolean>
        defaultPlaybackRate<double> - Default playback rate. 1.0 is "normal speed," lower than 1.0 is slower, higher is faster. 0.0 is invalid and throws a NOT_SUPPORTED_ERR exception.
        duration<double>(Read Only) - The length of the media in seconds, or zero if no media data is available.  If the media data is available but the length is unknown, this value is NaN.  If the media is streamed and has no predefined length, the value is Inf.
        ended<Boolean>(Read Only)
        error<MediaError>(Read Only) - The MediaError object for the most recent error, or null if there has not been an error.
        loop<Boolean>
        mediaGroup<String> - Reflects the mediagroup HTML attribute, indicating the name of the group of elements it belongs to. A group of media elements shares a common controller.
        muted<Boolean>
        networkState<unsigned short> - current state of fetching the media over the network. {NETWORK_EMPTY : 0, NETWORK_IDLE :	1, NETWORK_LOADING : 2, NETWORK_NO_SOURCE : 3}
        paused<Boolean>(Read Only)
        playbackRate<double>
        played<TimeRanges>(Read Only)
        preload<String> - what data should be preloaded, if any. Possible values are: none, metadata, auto
        readyState<unsigned short> - {HAVE_NOTHING : 0, HAVE_METADATA : 1, HAVE_CURRENT_DATA : 2, HAVE_FUTURE_DATA : 3, HAVE_ENOUGH_DATA : 4}
        seekable<TimeRanges>(Read Only)
        seeking<Boolean>(Read Only)
        src<String>
        textTracks<TextTrackList>
        videoTracks<VideoTrackList>
        volume<double> - 0.0 (silent) to 1.0 (loudest).
    */