function SelectionMachine(jsonVideos)
{
    this._categories = [];
    this._borough = null;
    this._searchText = null;
    this._videos = $.map(
        jsonVideos, 
        function(json, index) {
            return new Video(json);
        }
    );
}

SelectionMachine.prototype.setCategories = function(categories)
{
    this._categories = categories;
};

SelectionMachine.prototype.setBorough = function(borough)
{
    this._borough = borough;
};

SelectionMachine.prototype.setSearchText = function(searchText)
{
    this._searchText = searchText;
};

SelectionMachine.prototype.getVideos = function()
{
    var videos = $.map(this._videos, function(video){return video;});
    var categories = this._categories; // variable necessary because of this scope...
    if (categories.length) {
        videos = $.grep(
            videos,
            function(video) {
                var flag = false;
                $.each(
                    video.getCategories(),
                    function(index, value) {
                        if ($.inArray(value, categories) > -1) {
                            flag = true;
                        }
                    }
                );
                return flag;
            }
        );
    }
    var borough = this._borough;
    if (borough) {
        videos = $.grep(
            videos, 
            function(video) {
                return video.getBorough() === borough;
            }
        );        
    }
    var searchText = this._searchText;
    if (searchText) { /* null value or empty string will eval false */
        var exp = new RegExp(searchText, "i");
        videos = $.grep(
            videos,
            function(video) {
                return  exp.test(video.getTitle()) || exp.test(video.getLocation());
            }
        );
    }
    return videos;
};

SelectionMachine.prototype.selectVideoByID = function(id)
{
    return $.grep(
        this._videos, 
        function(video, index){return video.getID() === id;}
    ).shift();
};

SelectionMachine.prototype.selectVideoByTitle = function(title)
{
    return $.grep(
        this._videos,
        function(video){return video.getTitle() === title;}
    ).shift();
};

SelectionMachine.prototype.summarizeLocations = function(videos)
{
    return videos.reduce(
        function(accumulator, currentVideo) {
            var location = $.grep(
                accumulator, 
                function(location) 
                {
                    return location.getName() === currentVideo.getLocation();
                }
            ).shift();
            if (!location) {
                location = new Location(
                    currentVideo.getLocation(), 
                    currentVideo.getLatLng()
                );
                location.addVideo(currentVideo);
                accumulator.push(location);
            } else {
                location.addVideo(currentVideo);
            }
            return accumulator;
        },
        []
    );
};
