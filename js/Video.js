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

Video.prototype.getLatLng = function()
{
	return L.latLng(this._json.Y, this._json.X);	
};
