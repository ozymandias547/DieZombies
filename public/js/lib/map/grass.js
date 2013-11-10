define("green", function (tileMap) {
	this._tileMap = tileMap;

	this.render = function (canvasContext, pixX, pixY, pixW, pixH)
	{
		canvasContext.fillRect(pixX, pixY, pixW, pixH);
	}
});