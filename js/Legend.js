function Legend(ul)
{
    
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
                        $("<div>").addClass("swatch").append($("<i>").addClass("fa fa-star"))
                    )
                    .append($("<span>").text("Multiple entries"))
            )
        );            

}

Legend.prototype = {};