function SelectionMachine(jsonVideos)
{
    this._videos = $.map(
        jsonVideos, 
        function(json, index) {
            return new Video(json);
        }
    );
}

SelectionMachine.prototype.getVideos = function()
{
    return this._videos;
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