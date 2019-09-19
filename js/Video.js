function Video(json)
{
	this._json = json;
}

Video.prototype.getID = function()
{
	return this._json.ID;
};

Video.prototype.getTitle = function()
{
	return this._json.Title;
};

Video.prototype.getLocation = function()
{
	return this._json.Location;
};

Video.prototype.getLatLng = function()
{
	return L.latLng(this._json.Y, this._json.X);
};

Video.prototype.getVideo = function()
{
	return this._json.Video;
};

Video.prototype.getYouTubeID = function()
{
	return this._json.Video
			.split("?").pop()
			.split("&").shift()
			.split("=").pop();
};

Video.prototype.getCategories = function()
{
	return this._json.Category.split(",");
};

Video.prototype.getBorough = function()
{
	return this._json.Borough;
};