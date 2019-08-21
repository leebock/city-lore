function Location(json)
{
	this._json = json;
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

Location.getVideoTitles = function()
{
	return this._json["Video-Titles"].split("|");
}