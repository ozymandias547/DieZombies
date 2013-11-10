define(function () {
	return new (function Isometric()
	{
		this.view = function(cX, cY, scaleX, scaleY, scaleZ, screenW, screenH)
		{
			this._cX = cX;
			this._cY = cY;
			this._screenW = screenW;
			this._screenH = screenH;
			this._scaleX = scaleX;
			this._scaleY = scaleY;
			this._scaleZ = scaleZ;

			this._ulX = - screenW / 2;
			this._ulY = - screenH / 2;

			this._lrX = screenW / 2;
			this._lrY = screenH / 2;
		};

		this.isOnScreen = function(x, y, z)
		{
			return 	pX(x, y) > _ulX && 
					pX(x, y) < (_ulX + this._screenW) &&
					pY(x, y, z) > _ulY &&
					pY(x, y, z) < (_ulY + this._screenH);
		};

		/**
		 * World x,y coordinate into screen x coordinate.
		 */
		this.pX = function(x, y)
		{
			return ((x - this._cX) + (y - this._cY)) * this._scaleX - this._ulX;
		};

		/**
		 * World x,y,z coordinate into screen y coordinate.
		 */
		this.pY = function(x, y, z)
		{
			return (-(x - this._cX) + (y - this._cY)) * this._scaleY - (z * this._scaleZ) - this._ulY;
		};
	});
});