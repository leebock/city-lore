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
        .append($("<div>"));
    
}

PlayPanel.prototype.present = function(youTubeID) {
    $(this._div).addClass("active");
    $(this._div).children("div:nth-child(2)").empty();
    $(this._div).children("div:nth-child(2)").append(
        $("<iframe>")
        .attr("src", "https://www.youtube.com/embed/"+youTubeID+"?autoplay=1")
        .attr("frameborder", "0")
        .attr("allowfullscreen", "")
        .attr("allow", "autoplay")
    );    
    
    /*
    $("#video-stage iframe").focus();
    */
};

PlayPanel.prototype.conceal = function() {
    $(this._div).removeClass("active");
    $(this._div).children("div:nth-child(2)").empty();
};
