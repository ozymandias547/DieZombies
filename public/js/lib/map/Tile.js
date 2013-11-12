define(["isometric", "Screen"], function(Iso, Screen) {
	var Tile = function(x, y, w, h, z, tileMap, rendererType) {
		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;
		this._h = h;
		this.highlighted = false;
		this.tileMap = tileMap;
		this._renderer = new rendererType(tileMap, this);
		this.children = {};
		this.id = "t" + this._x.toString(16) + ":" + this._y.toString(16);
		this.idColor = this.genIDColor();
		var idName = "c" + this.getIDColorNum().toString(10);
		Screen.idColorToObjectMap[idName] = this;

		// Siblings are:
		// 0 == +x
		// 1 == +y
		// 2 == -x
		// 3 == -y
		// So siblings at [0] is always the sibling in the positive x direction.
		this.siblings = [];
	};

	Tile.prototype = {
		getIDColorNum: function() {
			return (this._x + 1) * this.tileMap._height + this._y;
		},
		genIDColor: function() {
			function pad(number, length) {
				var str = '' + number;
				while (str.length < length) str = '0' + str;
				return str;
			}

			function toRGBHex(val) {
				return pad(val.toString(16), 6);
			}

			// Returns a UNIQUE color for each tile, starting at 0 (black)
			return "#" + toRGBHex(this.getIDColorNum() + 0x666666);
		},

		x: function() {
			return this._x;
		},

		y: function() {
			return this._y;
		},

		z: function() {
			return this._z;
		},

		toString: function() {
			return this._x + ", " + this._y;
		},

		/**
		 * Recursively evaluates which tiles can be rendered starting from this
		 * and moving outward in all directions.
		 *
		 * Renderables = {all: [], map: {}}
		 */
		getRenderablesRecursively: function(renderables) {
			renderables.map[this.id] = this;

			if (!this.renderable()) {
				return;
			}

			renderables.all.push({
				renderer: this,
				z: this.zBuffIndex()
			});

			renderables.map[this.id] = this;

			for (var i = 0; i < 4; i++) {
				if (this.siblings[i] && !renderables.map[this.siblings[i].id]) {
					this.siblings[i].getRenderablesRecursively(renderables);
				}
			}
		},

		renderable: function() {
			var isOnScreen = false;
			var verts = this._renderer.prepVerts(this._x, this._y, this._z, this._w, this._h);

			for (var i = 0; i < verts.all.length; i++) {
				isOnScreen = isOnScreen ? isOnScreen : Iso.isPixOnScreen(verts.all[i].x, verts.all[i].y)
			}

			return isOnScreen;
		},

		draw: function(elapsed, context, contextHit) {
			this._renderer.draw(this, elapsed, context, contextHit, this._x, this._y, this._z, this._w, this._h);

			if (this.children) {
				for (var name in this.children) {
					if (this.children[name]) {
						this.children[name].draw(elapsed, context);
					}
				}

				this.children = {};
			}
		},

		update: function(elapsed) {},

		zBuffIndex: function() {
			return Iso.pY(this._x + this._w, this._y, 0);
		}
	};

	return Tile;
});