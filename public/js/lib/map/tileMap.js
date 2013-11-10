define(["grass"], function (Grass) {
	return function TileMap(width = 15, height = 15, tileWidth = 50, tileHeight = 50)
	{
		this._tileWidth = tileWidth;
		this._tileHeight = tileHeight;

		this.Tile = function (x, y, tileMap, rendererType)
		{
			this._x = x;
			this._y = y;
			this._tileMap = tileMap;
			this._renderer = new rendererType();

			this.x = function ()
			{
				return this._x;
			};

			this.y = function ()
			{
				return this._y;
			};

			this.tileMap = function ()
			{
				return this._tileMap;
			};

			this.toString = function ()
			{
				return this._x + ", " + this._y;
			};

			this.draw = function(elapsed, context, pixX, pixY, pixW, pixH)
			{
				this._renderer.draw(elapsed, context, pixX, pixY, pixW, pixH);
			};

			this.update = function(elapsed)
			{
			};
		};

		this.resize = function (width, height)
		{
			this._width = width;
			this._height = height;

			this._tiles = [];

			for (var x = 0; x < this._width; x++)
			{
				this._tiles[x] = [];

				for (var y = 0; y < this._height; y++)
				{
					this._tiles[x][y] = new this.Tile(x, y, this, Grass);
				}
			}
		};

		this.draw = function(elapsed, context)
		{
			for (var x = 0; x < this._width; x++)
			{
				for (var y = 0; y < this._height; y++)
				{
					this._tiles[x][y].draw(elapsed, context, x * this._tileWidth, y * this._tileHeight, this._tileWidth, this._tileHeight);
				}
			}
		};

		this.update = function(elapsed)
		{

		};

		if (width && height)
		{
			this.resize(width, height);
		}
	};
});