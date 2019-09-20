function LocationFilterBadge(div)
{
    this._div = div;
    var self = this;
    $(this._div)
        .hide()
        .append($("<span>"))
        .append(
            $("<div>")
            .append($("<span>"))
            .append(
                $("<button>")
                    .attr("type","button")
                    .click(
                        function() {
                            $(self).trigger("cancelLocationFilter");
                            self.hide();
                        }
                    )
            )
        );   
}

LocationFilterBadge.prototype.show = function(name)
{
    $(this._div).show();
    $($(this._div).children("div"))
        .css("display", "flex")
        .children("span").text(name);
};

LocationFilterBadge.prototype.hide = function()
{
    $(this._div).hide();
};