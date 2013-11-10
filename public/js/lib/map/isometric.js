define(function () {
	return new (function Isometric()
	{
		this.view = function(xToYRatio, ulX, ulY, w, h)
		{
			this._ulX = ulX;
			this._ulY = ulY;
			this._w = w;
			this._h = h;
			this._xToYRatio = xToYRatio;
		};

		this.isOnScreen = function(x, y, z)
		{
			return 	pX(x, y) > _ulX && 
					pX(x, y) < (_ulX + w) &&
					pY(x, y, z) > _ulY &&
					pY(x, y, z) < (_ulY + h);
		};

		/**
		 * World x,y coordinate into screen x coordinate.
		 */
		this.pX = function(x, y)
		{
			return (0.5 * x) + (0.5 * y) + this._ulX;
		};

		/**
		 * World x,y,z coordinate into screen y coordinate.
		 */
		this.pY = function(x, y, z)
		{
			return -(0.5 * x) + (0.5 * y) - z + this._ulY;
		};
	});
});