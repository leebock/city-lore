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

CategorySelect.prototype.setActiveCategory = function(category)
{
    // set the select value to the incoming borough name.
    
    /* this first bit of drama is just to get the case 
        insensitive borough match */
    var match =(
        $.grep(
            $.map(
                $("option", this._select), 
                function(value) {return $(value).text();}
            ),
            function(value){return value.toLowerCase() === category.toLowerCase();}
        )
    ).shift();
    if (match) {
        $(this._select).val(match);
    }
};