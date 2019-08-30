function Location(json, videos)
{
	this._json = json;
	this._videos = videos;
}

Location.prototype.getName = function()
{
	return this._json.Name;
};

Location.prototype.getAddress = function()
{
	return this._json.Address;
};

Location.prototype.getLatLng = function()
{
	return L.latLng(this._json.Y, this._json.X);
};

Location.prototype.getVideos = function()
{
	return $.map(this._videos, function(value){return value;});
};