define(["grass", "isometric", "Tile"], function(Grass, Iso, Tile) {
	return function TileMap(width, height, tileWidth, tileHeight) {
		this._tileWidth = tileWidth;
		this._tileHeight = tileHeight;

		this.resize = function(width, height) {
			this._width = width;
			this._height = height;

			this._tiles = [];

			for (var x = 0; x < this._width; x++) {
				this._tiles[x] = [];

				for (var y = 0; y < this._height; y++) {
					this._tiles[x][y] = new Tile(x * this._tileWidth, y * this._tileHeight, this._tileWidth, this._tileHeight, Math.random() * 60, this, Grass);
				}
			}

			// Now that all tiles are built, we assign siblings.
			for (var x = 0; x < this._width; x++) {
				for (var y = 0; y < this._height; y++) {
					// 0 == positive x
					if (x < this._width - 1) {
						this._tiles[x][y].siblings[0] = this._tiles[x + 1][y];
					}
					// 1 == positive y
					if (y < this._height - 1) {
						this._tiles[x][y].siblings[1] = this._tiles[x][y + 1];
					}
					// 2 == negative x
					if (x > 0) {
						this._tiles[x][y].siblings[2] = this._tiles[x - 1][y];
					}
					// 3 == negative y
					if (y > 0) {
						this._tiles[x][y].siblings[3] = this._tiles[x][y - 1];
					}
				}
			}
		};

		this.getTileAt = function(x, y) {
			if (isNaN(x) || isNaN(y)) {
				return null;
			}

			var tx = Math.floor(x / this._tileWidth);
			var ty = Math.floor(y / this._tileHeight);

			if (tx < 0 || tx >= this._tiles.length ||
				ty < 0 || ty >= this._tiles[tx].length) {
				return null;
			}

			return this._tiles[tx][ty];
		};

		this.getRenderableTilesFrom = function(centerTile) {
			var renderables = {
				all: [],
				map: {}
			};
			centerTile.getRenderablesRecursively(renderables);
			return renderables;
		};

		this.update = function(elapsed) {

		};

		this.resize(width, height);
	};
});