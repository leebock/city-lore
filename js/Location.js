function Location(name, latLng)
{
	this._name = name;
	this._latLng = latLng;
	this._videos = [];
}

Location.prototype.getName = function()
{
	return this._name;
};
/*
Location.prototype.getAddress = function()
{
	return this._json.Address;
};
*/
Location.prototype.getLatLng = function()
{
	return this._latLng;
};

Location.prototype.addVideo = function(video)
{
	this._videos.push(video);
};

Location.prototype.getVideos = function()
{
	return $.map(this._videos, function(value){return value;});
};