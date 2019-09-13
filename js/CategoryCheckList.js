function CategoryCheckList(ul)
{
    this._ul = ul;
    var self = this;
    $.each(
        [
            "Urban Folklore", 
            "Treasured Places", 
            "Grassroots Poetry", 
            "Neighborhood Tours", 
            "Education"
        ],
        function(index, value)
        {
            $(ul)
                .append(
                    $("<li>")
                    .append(
                        $("<button>")
                            .text(value)
                            .click(onItemClick)
                    )
                );            
        }
    );
        
    function onItemClick(event)
    {
        event.stopPropagation();        
        $(event.target).toggleClass("active");
        $(self).trigger("itemClick");
    }            

}


CategoryCheckList.prototype.getActiveCategories = function()
{
    return $.map(
        $.grep(
            $(this._ul).children(),
            function(li) {
                return $(li).children("button").hasClass("active");
            }
        ),
        function(li) {
            return $(li).children("button").text();
        }
    );
};