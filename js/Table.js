function Table(ul)
{
    this._ul = ul;
}

Table.prototype.load = function(items, highlightText) {
    var ul = this._ul;
    var self = this;
    $(ul).empty();
    $.each(
        items,
        function(index, item) {
            
            var title = item.getTitle();
            var address = item.getLocation();
            
            if (highlightText) { /* either null or EMPTY STRING will eval false */
                title = markup(title, highlightText);
                address = markup(address, highlightText);
            }
            
            $("<li>")
                .append(
                    $("<button>")
                        .data("storymaps-id", item.getID())
                        .append(
                            $("<div>")
                                .css(
                                    "background-image", 
                                    "url('"+
                                    "https://img.youtube.com/vi/"+
                                    item.getYouTubeID()+"/0.jpg"+
                                    "')"
                                )                            
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
                            )
                        )
                        .append($("<h3>").html(title))
                        .append($("<h4>").html(address))
                        .append($("<p>").html(item.getDescription()))
                        .click(onItemButtonClick)
                )
                .appendTo($(ul));
        }
    );

    $(ul).animate({scrollTop: 0}, 'slow');

    function onItemButtonClick(event) {
        $(ul).children("li").removeClass("active");
        $(this).parent().addClass("active");
        $(self).trigger("itemActivate", [$(event.target).data("storymaps-id")]);
        $(ul).animate(
            {scrollTop: $(this).parent().offset().top - $(ul).offset().top + $(ul).scrollTop()}, 
            'slow'
        );
    }
    
    function markup(text, pattern)
    {
        return text.replace(
            RegExp(pattern, "ig"),
            function(str) {return "<mark>"+str+"</mark>";}
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