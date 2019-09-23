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
}

PlayPanel.prototype.present = function(youTubeID) {
    var self = this;
    $(this._div).addClass("active");
    if (!this._player) {
        this._player = new YT.Player(
            "player",
            {
                width: "100%",
                events: {
                    "onReady": function(event) {
                        self._player.loadVideoById(youTubeID);
                    },
                  'onStateChange': function(event) {
                      // when video ends
                      if(event.data === 0) {            
                          self.conceal();
                      }
                  }
                }
            }
        );
    } else {
        this._player.loadVideoById(youTubeID);
    }
};

PlayPanel.prototype.conceal = function() {
    $(this._div).removeClass("active");
    if (this._player) {
        this._player.stopVideo();
    }
};
