function PlayPanel(div)
{
    this._div = div;
    var self = this;
    $(div)
        .append(
            $("<div>")
                .append(
                    $("<button>").click(function(){self.conceal();})
                )
        )
        .append($("<div>").attr("id", "player"));
        
    this._player = new YT.Player(
        "player",
        {
            width: "100%",
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
        }
    );
    
    // when video ends
    function onPlayerStateChange(event) {        
        if(event.data === 0) {            
            self.conceal();
        }
    }
    function onPlayerReady(event) {
        console.log("player is ready.");
    }

}

PlayPanel.prototype.present = function(youTubeID) {
    $(this._div).addClass("active");
    this._player.loadVideoById(youTubeID);
};

PlayPanel.prototype.conceal = function() {
    $(this._div).removeClass("active");
    this._player.stopVideo();
};
