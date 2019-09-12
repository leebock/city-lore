function SelectionMachine(jsonLocations, jsonVideos)
{
    var self = this;

    this._videos = $.map(
        jsonVideos, 
        function(json, index) {
            return new Video(json);
        }
    );    

    this._locations = $.map(
        jsonLocations, 
        function(json, index) {
            return new Location(
                json, 
                $.grep(
                    self._videos,
                    function(video){return video.getLocation() === json.Name;}
                )                
            );
        }
    );    


}

SelectionMachine.prototype.getVideos = function()
{
    return this._videos;
};

SelectionMachine.prototype.getLocations = function()
{
    return this._locations;
};

SelectionMachine.prototype.selectVideoByID = function(id)
{
    return $.grep(
        this._videos, 
        function(video, index){return video.getID() === id;}
    ).shift();
};

SelectionMachine.prototype.selectLocationsForVideos = function(videos)
{
    return $.grep(
        this._locations,
        function(location) {
            var flag = false;
            $.each(
                videos,
                function(index, video) {
                    if (location.getName() === video.getLocation()) {
                        flag = true;
                    }
                }
            );
            return flag;
        }
    );
};

SelectionMachine.prototype.selectVideosForCategories = function(categories, videos)
{
    if (!videos) {
        videos = this._videos;
    }
    return $.grep(
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
};

SelectionMachine.prototype.selectVideosForLocation = function(location)
{
    return $.grep(
        this._videos,
        function(video){return video.getLocation() === location.getName();}
    );
};

SelectionMachine.prototype.selectVideoByTitle = function(title)
{
    return $.grep(
        this._videos,
        function(video){return video.getTitle() === title;}
    ).shift();
};