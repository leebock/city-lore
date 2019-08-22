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
                .append($("<span>").html(item.getTitle()))
                .append(
                    $("<button>")
                        .data("storymaps-id", item.getID())
                        .append($("<span>").html("Play"))
                        .click(onButtonClick)
                )
                .appendTo($(ul));
        }
    );

    $(ul).animate({scrollTop: 0}, 'slow');

    function onButtonClick(event) {
        $(ul).children("li").removeClass("selected");
        $(this).parent().addClass("selected");
        $(self).trigger("itemSelect", [$(event.target).data("storymaps-id")]);
        $(ul).animate(
            {scrollTop: $(this).parent().offset().top - $(ul).offset().top + $(ul).scrollTop()}, 
            'slow'
        );
    }

};

Table.prototype.clearSelected = function()
{
    $(this._ul).children("li").removeClass("selected");
};

Table.prototype.selectItem = function(ingredients)
{
    this.clearSelected();
    /*
    var ul = this._ul;
    var li = $.grep(
        $(ul).children("li"),
        function(li) {
            return $.inArray(
                $(li).children("button").data("ingredient").getName(), 			
                $.map(
                    ingredients,
                    function(value){return value.getName();}
                )
            ) > -1;
        }
    ).shift();
    if (li) {
        $(li).addClass("selected");
        $(ul).animate(
            {scrollTop: $(li).offset().top - $(ul).offset().top + $(ul).scrollTop()}, 
            'slow'
        );        
    }
    */
};