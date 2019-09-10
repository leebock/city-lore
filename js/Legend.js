function Legend(ul)
{
    this._ul = ul;
    var self = this;
    $.each(
        ["Urban Folklore", "Treasured Places", "Grassroots Poetry", "Neighborhood Tours"],
        function(index, value)
        {
            $(ul)
                .append(
                    $("<li>")
                    .append(
                        $("<button>")
                            .append($("<div>").addClass("swatch"))
                            .append($("<span>").text(value))
                            .click(onItemClick)
                    )
                );            
        }
    );
    
    $(ul)
        .append(
            $("<li>")
            .append(
                $("<button>")
                    .append(
                        $("<div>")
                            .addClass("swatch")
                            .append($("<i>").addClass("fa fa-star"))
                    )
                    .append($("<span>").text("Multiple entries"))
                    .click(onItemClick)
            )
        );
        
    function onItemClick(event)
    {
        $(event.target).toggleClass("inactive");
        $(self).trigger(
            "itemClick", 
            [
                $.map(
                    $.grep(
                        $(self._ul).children(),
                        function(li) {
                            return !$(li).children("button").hasClass("inactive");
                        }
                    ),
                    function(li) {
                        return $(li).children("button").text();
                    }
                )
            ]
        );
    }            

}


Legend.prototype = {};