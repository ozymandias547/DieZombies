define(["isometric"], function (Iso) {
	return function Grass(tileMap)
	{
		this._tileMap = tileMap;

		this.tileMap = function()
		{
			return this._tileMap;
		};

		this.draw = function (elapsed, canvasContext, x, y, z, w, h)
		{
			this._g = this._g || Math.round(Math.random() * 100 + 150);

			var ulx = Iso.pX(x, y);
			var uly = Iso.pY(x, y, z);
			var ulxC = Iso.pX(x, y);
			var ulyC = Iso.pY(x, y, -30);
			var lrx = Iso.pX(x + w, y + h);
			var lry = Iso.pY(x + w, y + h, z);
			var lrxC = Iso.pX(x + w, y + h);
			var lryC = Iso.pY(x + w, y + h, -30);
			var urx = Iso.pX(x + w, y);
			var ury = Iso.pY(x + w, y, z);
			var llx = Iso.pX(x, y + h);
			var lly = Iso.pY(x, y + h, z);
			var llxC = Iso.pX(x, y + h);
			var llyC = Iso.pY(x, y + h, -30);

			// Ground
			canvasContext.beginPath();
			canvasContext.moveTo(ulx, uly);
			canvasContext.lineTo(urx, ury);
			canvasContext.lineTo(lrx, lry);
			canvasContext.lineTo(llx, lly);
			canvasContext.lineTo(ulx, uly);
			canvasContext.fillStyle = "#00" + (this._g).toString(16) + "00";
			canvasContext.fill();

			// Left Dirt Cliff
			canvasContext.beginPath();
			canvasContext.moveTo(ulx, uly);
			canvasContext.lineTo(llx, lly);
			canvasContext.lineTo(llxC, llyC);
			canvasContext.lineTo(ulxC, ulyC);
			canvasContext.lineTo(ulx, uly);
			canvasContext.fillStyle = "#8B5742";
			canvasContext.fill();

			// Right Dirt Cliff
			canvasContext.beginPath();
			canvasContext.moveTo(llx, lly);
			canvasContext.lineTo(lrx, lry);
			canvasContext.lineTo(lrxC, lryC);
			canvasContext.lineTo(llxC, llyC);
			canvasContext.lineTo(llx, lly);
			canvasContext.fillStyle = "#5C4033";
			canvasContext.fill();
		};
	};
});