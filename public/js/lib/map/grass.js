define(["isometric"], function (Iso) {
	return function Grass(tileMap)
	{
		this._tileMap = tileMap;

		this.tileMap = function()
		{
			return this._tileMap;
		};

		this.draw = function (elapsed, canvasContext, x, y, w, h)
		{
			this._g = this._g || Math.round(Math.random() * 100 + 150);

			canvasContext.beginPath();
			canvasContext.moveTo(Iso.pX(x, y), Iso.pY(x, y, 0));
			canvasContext.lineTo(Iso.pX(x + w, y), Iso.pY(x + w, y, 0));
			canvasContext.lineTo(Iso.pX(x + w, y + h), Iso.pY(x + w, y + h, 0));
			canvasContext.lineTo(Iso.pX(x, y + h), Iso.pY(x, y + h, 0));
			canvasContext.lineTo(Iso.pX(x, y), Iso.pY(x, y, 0));
			canvasContext.fillStyle = "#00" + (this._g).toString(16) + "00";
			canvasContext.fill();
		};
	};
});