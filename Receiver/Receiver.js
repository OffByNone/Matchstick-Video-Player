"use strict";
(function() {
    //if the below two lines are not executed the matchstick will think it 
    //failed to open the app and return to the default screen after a timeout
    
    var receiverManager = new ReceiverManager("~mediaPlayerDemo"); //create a new ReceiverManager with the same app id used in the sender
    var messageChannel = receiverManager.createMessageChannel("mediaPlayerDemo");
    var media = {
        video : document.getElementById("video"),
        audio : document.getElementById("audio"),
        image : document.getElementById("image")
    };
    var info = document.getElementById("info");
    
    messageChannel.on("message", function(senderId, data){
        var message = JSON.parse(data);
        
        if(message.hasOwnProperty("properties") && typeof message.properties === "object") setProperties(message.properties, message.type);
        if(message.hasOwnProperty("commands") && Array.isArray(message.commands) && message.commands.length > 0) executeCommands(message.commands, message.type);
    });        
    
    function executeCommands(commands, type){
        commands.forEach(command => media[type][command]());
    }
    
    function setProperties(properties, type){
         for (var property in properties)
            if(properties.hasOwnProperty(property))
                media[type][property] = properties[property];
    }
    
    receiverManager.open();
    
})();