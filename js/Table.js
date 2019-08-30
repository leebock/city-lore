function Table(ul)
{
    this._ul = ul;
    this._usingTouch = false;
    var self = this;
    $(ul).one(
        "touchstart", 
        function(){self._usingTouch = true;}
    );
}

Table.prototype.load = function(items) {
    var ul = this._ul;
    var self = this;
    $(ul).empty();
    $.each(
        items,
        function(index, item) {

            $("<li>")
                .append(
                    $("<button>")
                        .data("storymaps-id", item.getID())
                        .css(
                            "background-image", 
                            "url('"+
                            "https://img.youtube.com/vi/"+
                            item.getYouTubeID()+"/0.jpg"+
                            "')"
                        )
                        .append($("<h3>").html(item.getTitle()))
                        .append($("<h4>").html(item.getLocation()))
                        .append(
                            $("<div>").addClass("veil")
                                .append(
                                    $("<button>")
                                        .click(
                                            function(event) {
                                                event.stopPropagation();
                                                $(self).trigger(
                                                    "itemPresent", 
                                                    [item.getYouTubeID()]
                                                );
                                            }
                                        )
                                        .hover(
                                            function(event) {
                                                event.stopPropagation();
                                            }
                                        )
                                )
                        )
                        .click(onItemButtonClick)
                        .hover(onItemButtonHover)
                )
                .appendTo($(ul));
        }
    );

    $(ul).animate({scrollTop: 0}, 'slow');

    function onItemButtonClick(event) {
        $(ul).children("li").removeClass("active pinned");
        $(this).parent().addClass("active");
        $(self).trigger("itemActivate", [$(event.target).data("storymaps-id")]);
        /*
        $(ul).animate(
            {scrollTop: $(this).parent().offset().top - $(ul).offset().top + $(ul).scrollTop()}, 
            'slow'
        );
        */
    }
    
    function onItemButtonHover(event) {
        if (self._usingTouch) {
            return;
        }
        if ($(ul).children("li.pinned").length) {
            return;
        }
        $(ul).children("li").removeClass("active");
        $(this).parent().addClass("active");
        $(self).trigger("itemActivate", [$(event.target).data("storymaps-id")]);
    }

};

Table.prototype.activateItem = function(video)
{
    this.clearActive();
    var ul = this._ul;
    var selected = $.grep(
        ul.children("li"),
        function(li){
            return $(li).children("button").data("storymaps-id") === video.getID();
        }
    );
    $(selected).addClass("active pinned");
    $(ul).animate(
        {scrollTop: $(selected).offset().top - $(ul).offset().top + $(ul).scrollTop()}, 
        'slow'
    );    
};

Table.prototype.clearActive = function()
{
    $(this._ul).children("li").removeClass("active");
};

Table.prototype.filter = function(videos)
{
    this.clearFilter();

    var ul = this._ul;
    videos = $.map(videos, function(video){return video.getID();});
    var selected = $.grep(
        ul.children("li"),
        function(li){
            return $.inArray($(li).children("button").data("storymaps-id"), videos) > -1;
        }
    );
    $(selected).addClass("selected");
    $(ul).addClass("filtered");
};

Table.prototype.clearFilter = function()
{
    $(this._ul).removeClass("filtered");
    $(this._ul).children("li").removeClass("selected");
};