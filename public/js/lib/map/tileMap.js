define("tileMap", function () {
	return function TileMap(width = 50, height = 50)
	{
		this.Tile = function (x, y, tileMap, renderer)
		{
			this._x = x;
			this._y = y;
			this._tileMap = tileMap;
			this._renderer = renderer;

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
		};

		this.resize = function (width, height)
		{
			this._width = width;
			this._height = height;

			this._tiles = [];

			for (var x = 0; x < this._width; x++)
			{
				this._tiles[x] ||= [];

				for (var y = 0; y < this.height; y++)
				{
					this._tiles[x][y] = new Tile(x, y, this);
				}
			}
		};

		this.draw = function(elapsed, context)
		{

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