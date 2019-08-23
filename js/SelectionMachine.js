function SelectionMachine(){}

SelectionMachine.selectVideoByID = function(videos, id)
{
    return $.grep(
        videos, 
        function(video, index){return video.getID() === id;}
    ).shift();
};

SelectionMachine.selectLocationForVideo = function(locations, video)
{
    return $.grep(
        locations,
        function(location, index){return location.getName() === video.getLocation();}
    ).shift();
};