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

			this.x = function() {
				return this._x;
			};

			this.y = function() {
				return this._y;
			};

			this.tileMap = function() {
				return this._tileMap;
			};

			this.toString = function() {
				return this._x + ", " + this._y;
			};

			this.draw = function(elapsed, context) {
				this._renderer.draw(elapsed, context, this._x, this._y, this._z, this._w, this._h);

				if (edges) {
					for (var i = 0; i < edges.length; i++) {

					}
				}
			};

			this.update = function(elapsed) {};

			this.zBuffIndex = function() {
				return Iso.pY(this._x + this._w, this._y, this._z);
			}
		};

		this.resize = function(width, height) {
			this._width = width;
			this._height = height;

			this._tiles = [];

			for (var x = 0; x < this._width; x++) {
				this._tiles[x] = [];

				for (var y = 0; y < this._height; y++) {
					this._tiles[x][y] = new this.Tile(x * this._tileWidth, y * this._tileHeight, this._tileWidth, this._tileHeight, Math.random() * 10, this, Grass);
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
		}

		this.draw = function(elapsed, context) {
			var zBuff = [];

			for (var x = 0; x < this._width; x++) {
				for (var y = 0; y < this._height; y++) {
					zBuff.push({
						tile: this._tiles[x][y],
						z: this._tiles[x][y].zBuffIndex()
					});
				}
			}

			zBuff.sort(function(a, b) {
				return a.z - b.z
			});

			for (var i = 0; i < zBuff.length; i++) {
				zBuff[i].tile.draw(elapsed, context);
			}
		};

		this.update = function(elapsed) {

		};

		if (width && height) {
			this.resize(width, height);
		}
	};
});