function Record(json)
{
	this._json = json;
}

Record.prototype.getID = function()
{
	return this._json.ID;
};

Record.prototype.getTitle = function()
{
	return this._json.Title;
};

Record.prototype.getDescription = function()
{
	return this._json.Description;
};

Record.prototype.getLatLng = function()
{
	return L.latLng(this._json.Y, this._json.X);
};