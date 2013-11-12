define(function() {
	return new(function Isometric() {
		/**
		 * cx, cy, cz are the location of the CENTER of the screen in world coordinates.
		 */
		this.view = function(cX, cY, cZ, scaleX, scaleY, scaleZ, screenW, screenH) {
			this._cX = cX;
			this._cY = cY;
			this._cZ = cZ;
			this._screenW = screenW;
			this._screenH = screenH;
			this._scaleX = scaleX;
			this._scaleY = scaleY;
			this._scaleZ = scaleZ;

			this._ulX = -screenW / 2;
			this._ulY = -screenH / 2;

			this._lrX = screenW / 2;
			this._lrY = screenH / 2;
		};

		this.isOnScreen = function(x, y, z) {
			var px = this.pX(x, y);
			var py = this.pY(x, y, z);

			return px > 0 &&
				px < this._screenW &&
				py > 0 &&
				py < this._screenH;
		};

		this.isPixOnScreen = function(x, y) {
			return x > 0 &&
				x < this._screenW &&
				y > 0 &&
				y < this._screenH;
		};

		/**
		 * World x,y coordinate into screen x coordinate.
		 */
		this.pX = function(x, y) {
			return ((x - this._cX) + (y - this._cY)) * this._scaleX - this._ulX;
		};

		/**
		 * World x,y,z coordinate into screen y coordinate.
		 */
		this.pY = function(x, y, z) {
			return (-(x - this._cX) + (y - this._cY)) * this._scaleY - ((z - this._cZ) * this._scaleZ) - this._ulY;
		};
	});
});