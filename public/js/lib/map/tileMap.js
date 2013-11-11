define(["grass", "isometric"], function(Grass, Iso) {
	return function TileMap(width, height, tileWidth, tileHeight) {
		this._tileWidth = tileWidth;
		this._tileHeight = tileHeight;

		this.Tile = function(x, y, w, h, z, tileMap, rendererType, edges) {
			this._x = x;
			this._y = y;
			this._z = z;
			this._w = w;
			this._h = h;
			this._edges = edges;
			this._tileMap = tileMap;
			this._renderer = new rendererType();
			this.children = {};

			this.x = function() {
				return this._x;
			};

			this.y = function() {
				return this._y;
			};

			this.z = function() {
				return this._z;
			};

			this.tileMap = function() {
				return this._tileMap;
			};

			this.toString = function() {
				return this._x + ", " + this._y;
			};

			this.canDraw = function()
			{
				var isOnScreen = false;
				var verts = this._renderer.prepVerts(this._x, this._y, this._z, this._w, this._h);

				for (var i = 0; i < verts.all.length; i++)
				{
					isOnScreen = isOnScreen ? isOnScreen : Iso.isPixOnScreen(verts.all[i].x, verts.all[i].y)
				}

				return isOnScreen;
			}

			this.draw = function(elapsed, context) {
				this._renderer.draw(this, elapsed, context, this._x, this._y, this._z, this._w, this._h);

				if (this.children)
				{
					for (var name in this.children)
					{
						if (this.children[name])
						{
							this.children[name].draw(elapsed, context);
						}
					}

					this.children = {};
				}
			};

			this.update = function(elapsed) {};

			this.zBuffIndex = function() {
				return Iso.pY(this._x + this._w, this._y, 0);
			}
		};

		this.resize = function(width, height) {
			this._width = width;
			this._height = height;

			this._tiles = [];

			for (var x = 0; x < this._width; x++) {
				this._tiles[x] = [];

				for (var y = 0; y < this._height; y++) {
					this._tiles[x][y] = new this.Tile(x * this._tileWidth, y * this._tileHeight, this._tileWidth, this._tileHeight, Math.random() * 60, this, Grass);
				}
			}
		};

		this.getTileAt = function(x, y) {
			if (isNaN(x) || isNaN(y))
			{
				return null;
			}
			var tx = Math.floor(x / this._tileWidth);
			var ty = Math.floor(y / this._tileHeight);

			if (tx < 0 || tx >= this._tiles.length)
				return null;

			if (ty < 0 || ty >= this._tiles[tx].length)
				return null;

			return this._tiles[tx][ty];
		};

		this.getChildrenForDraw = function()
		{
			var zBuff = [];

			for (var x = 0; x < this._width; x++) {
				for (var y = 0; y < this._height; y++) {
					if (this._tiles[x][y].canDraw())
					{
						zBuff.push({
							renderer: this._tiles[x][y],
							z: this._tiles[x][y].zBuffIndex()
						});
					}
				}
			}

			return zBuff;
		};

		this.update = function(elapsed) {

		};

		if (width && height) {
			this.resize(width, height);
		}
	};
});