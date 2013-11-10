define(function () {
	return function Grass(tileMap)
	{
		this._tileMap = tileMap;

		this.tileMap = function()
		{
			return this._tileMap;
		};

		this.draw = function (elapsed, canvasContext, pixX, pixY, pixW, pixH)
		{
			this._g = this._g || Math.round(Math.random() * 100 + 150);

			canvasContext.fillStyle = "#00" + (this._g).toString(16) + "00";
			canvasContext.fillRect(pixX, pixY, pixW, pixH);
		};
	};
});