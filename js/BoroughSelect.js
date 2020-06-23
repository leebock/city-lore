function BoroughSelect(select)
{
    this._select = select;
    var self = this;
    
    $(this._select).append($("<option>").text("All Boroughs"));
    
    var optGroup = $("<optgroup>")
        .attr("label", "Categories")
        .appendTo($(this._select));
    
    $.each(
        [
            "Manhattan", 
            "Brooklyn", 
            "Queens", 
            "Bronx", 
            "Staten Island"
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
            $(self).trigger("boroughChange");
        }
    );

}


BoroughSelect.prototype.getActiveBorough = function()
{
    return this._select.value.toLowerCase() === "all boroughs" ?
           null :
           this._select.value;
};

BoroughSelect.prototype.setActiveBorough = function(borough)
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
            function(value){return value.toLowerCase() === borough.toLowerCase();}
        )
    ).shift();
    if (match) {
        $(this._select).val(match);
    }
};