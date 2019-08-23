function Table(ul)
{
    this._ul = ul;
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
                        .append($("<h3>").html(item.getTitle()))
                        .append($("<br>"))
                        .append($("<span>").html(item.getLocation()))
                        .append($("<br>"))
                        .append($("<a>").text("Video").attr(
                            {
                                "href": item.getVideo(),
                                "target": "_blank"
                            })
                        )
                        .click(onButtonClick)
                )
                .appendTo($(ul));
        }
    );

    $(ul).animate({scrollTop: 0}, 'slow');

    function onButtonClick(event) {
        $(ul).children("li").removeClass("active");
        $(this).parent().addClass("active");
        $(self).trigger("itemActivate", [$(event.target).data("storymaps-id")]);
        $(ul).animate(
            {scrollTop: $(this).parent().offset().top - $(ul).offset().top + $(ul).scrollTop()}, 
            'slow'
        );
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
    $(selected).addClass("active");
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