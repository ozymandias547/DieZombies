define(["isometric"], function(Iso) {
	var Grass = function(tileMap, tile) {
		this.tileMap = tileMap;
		this.tile = tile;
	};

	Grass.prototype = {
		tileMap: function() {
			return this.tileMap;
		},
		left: function() {
			return this.tile.siblings[2];
		},
		bottom: function() {
			return this.tile.siblings[1];
		},
		prepVerts: function(x, y, z, w, h) {
			var ul = {
				x: Iso.pX(x, y),
				y: Iso.pY(x, y, z)
			};

			var leftTileHeight = this.left() ? this.left()._z : -30;
			var bottomTileHeight = this.bottom() ? this.bottom()._z : -30;

			var ulC = {
				x: Iso.pX(x, y),
				y: Iso.pY(x, y, leftTileHeight)
			};

			var lr = {
				x: Iso.pX(x + w, y + h),
				y: Iso.pY(x + w, y + h, z)
			};
			var lrC = {
				x: Iso.pX(x + w, y + h),
				y: Iso.pY(x + w, y + h, bottomTileHeight)
			};

			var ur = {
				x: Iso.pX(x + w, y),
				y: Iso.pY(x + w, y, z)
			};
			var ll = {
				x: Iso.pX(x, y + h),
				y: Iso.pY(x, y + h, z)
			};
			var llC = {
				x: Iso.pX(x, y + h),
				y: Iso.pY(x, y + h, leftTileHeight < bottomTileHeight ? leftTileHeight : bottomTileHeight)
			};

			return this.verts = {
				ul: ul,
				ulC: ulC,
				lr: lr,
				lrC: lrC,
				ur: ur,
				ll: ll,
				llC: llC,
				all: [ul, ulC, lr, lrC, ur, ll, llC]
			};
		},
		canDrawLeftCliff: function() {
			var l = this.left();
			return !l || l._z < this.tile._z;
		},
		canDrawBottomCliff: function() {
			var b = this.bottom();
			return !b || b._z < this.tile._z;
		},
		drawGround: function(v, context, fill) {
			context.beginPath();
			context.moveTo(v.ul.x, v.ul.y);
			context.lineTo(v.ur.x, v.ur.y);
			context.lineTo(v.lr.x, v.lr.y);
			context.lineTo(v.ll.x, v.ll.y);
			context.lineTo(v.ul.x, v.ul.y);
			context.fillStyle = fill;
			context.fill();
		},
		drawLeftCliff: function(v, context, fill) {
			context.beginPath();

			context.moveTo(v.ul.x, v.ul.y);
			context.lineTo(v.ll.x, v.ll.y);
			context.lineTo(v.llC.x, v.llC.y);
			context.lineTo(v.ulC.x, v.ulC.y);
			context.lineTo(v.ul.x, v.ul.y);
			context.fillStyle = fill;
			context.fill();
		},
		drawBottomCliff: function(v, context, fill) {
			context.beginPath();

			context.moveTo(v.ll.x, v.ll.y);
			context.lineTo(v.lr.x, v.lr.y);
			context.lineTo(v.lrC.x, v.lrC.y);
			context.lineTo(v.llC.x, v.llC.y);
			context.lineTo(v.ll.x, v.ll.y);
			context.fillStyle = fill;
			context.fill();
		},
		getGrassColor: function()
		{
			return this.tile.highlighted ? "#FF0000" : "#00" + (this._g).toString(16) + "00";
		},
		draw: function(tile, elapsed, context, contextHit, x, y, z, w, h) {
			this._g = this._g || Math.round(Math.random() * 100 + 150);

			var v = this.verts;

			// Ground
			this.drawGround(v, context, this.getGrassColor());
			this.drawGround(v, contextHit, this.tile.idColor);

			// Left Dirt Cliff
			if (this.canDrawLeftCliff()) {
				this.drawLeftCliff(v, context, "#8B5742");
				this.drawLeftCliff(v, contextHit, this.tile.idColor);
			}

			// Bottom Dirt Cliff
			if (this.canDrawBottomCliff()) {
				this.drawBottomCliff(v, context, "#5C4033");
				this.drawBottomCliff(v, contextHit, this.tile.idColor);
			}
		}
	};

	return Grass;
});