function CategorySelect(select)
{
    this._select = select;
    var self = this;
    
    $(this._select).append($("<option>").text("All Categories"));
    
    var optGroup = $("<optgroup>")
        .attr("label", "Categories")
        .appendTo($(this._select));
    
    $.each(
        [
            "Urban Folklore", 
            "Treasured Places", 
            "Grassroots Poetry", 
            "Neighborhood Tours", 
            "Education",
			"Special Projects"
        ],
        function(index, value)
        {    
            $("<option>")
                .text(value)
                .appendTo(optGroup);
        }
    );
    
    $(this._select).change(
        function(event){
            $(self).trigger("categoryChange");
        }
    );

}


CategorySelect.prototype.getActiveCategories = function()
{
    var categories;
    if (this._select.value.toLowerCase() === "all categories") {
        categories = $.map(
            $(this._select).children("optgroup").children("option"),
            function(option){return $(option).text();}
        );
    } else {
        categories = this._select.value.split();
    }
    return categories;
};