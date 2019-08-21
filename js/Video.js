function Video(json)
{
	this._json = json;
}

Video.prototype.getTitle = function()
{
	return this._json.Title;
};
