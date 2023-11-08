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
        /*  had to do a bit of homegrown text processing here...the end goal
            is to check for a pattern match within the text, but because we're 
            allowing for diacritics, there's an extra step: 1) normalize the
            text, 2) search for the pattern within the normalized 
            text, 3) get the position of that pattern, 4) mark the characters
            at that position within the native text.
        
            the bit of regexp magic employed below replaces any instance 
            of a diacritic in the incoming text with its corresponding
            'normal' character.  in this way, for example, the search pattern 
            'cafe' will test positive against an occurence of 'Café' 
            
            also, note that toLowerCase() is being applied to both text and 
            pattern so that the comparison will be case insensitive (there's 
            probably a more clever way to accomplish this with regexp) */
        const position = text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/gi, "")
            .toLowerCase()
            .search(pattern.toLowerCase());
        return text.replace(
            RegExp(position > -1 && text.substring(position, position+pattern.length), "ig"),
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