(function() {
    var mailEndpoint, mailRequest, fooEndpoint, fooRequest, broadcastRequest, broadcastEndpoint, testFrame;

    console.log("Web Socket opened!");

    broadcastRequest = navigator.push.register();
    broadcastRequest.onsuccess = function( event ) {
        broadcastEndpoint = event.target.result;
        broadcastRequest.registerWithPushServer( "broadcast", broadcastEndpoint );
        console.log("Subscribed to Broadcast messages on " + broadcastEndpoint.channelID);
        console.log(localStorage.getItem( broadcastEndpoint.channelID ) || 1 );
       
    };

    mailRequest = navigator.push.register();
    mailRequest.onsuccess = function( event ) {
        mailEndpoint = event.target.result;
        mailRequest.registerWithPushServer( "lead", mailEndpoint , "maria" );
       // $("#mailVersion").attr("name", mailEndpoint.channelID);
        console.log("Subscribed to lead messages on " + mailEndpoint.channelID);
        console.log(localStorage.getItem( mailEndpoint.channelID ) || 1 );
        //$("#mail").prop("disabled", false);
    };
       
})();
