function SelectionMachine(){}

SelectionMachine.selectVideoByID = function(videos, id)
{
    return $.grep(
        videos, 
        function(value, index){return value.getID() === id;}
    ).shift();
};