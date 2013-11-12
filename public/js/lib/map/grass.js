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
		drawLeftCliff: function() {
			var l = this.left();
			return !l || l._z < this.tile._z;
		},
		drawBottomCliff: function() {
			var b = this.bottom();
			return !b || b._z < this.tile._z;
		},
		draw: function(tile, elapsed, canvasContext, x, y, z, w, h) {
			this._g = this._g || Math.round(Math.random() * 100 + 150);

			var v = this.verts;

			// Ground
			canvasContext.beginPath();
			canvasContext.moveTo(v.ul.x, v.ul.y);
			canvasContext.lineTo(v.ur.x, v.ur.y);
			canvasContext.lineTo(v.lr.x, v.lr.y);
			canvasContext.lineTo(v.ll.x, v.ll.y);
			canvasContext.lineTo(v.ul.x, v.ul.y);
			canvasContext.fillStyle = "#00" + (this._g).toString(16) + "00";
			canvasContext.fill();

			// Left Dirt Cliff
			if (this.drawLeftCliff()) {
				canvasContext.beginPath();

				canvasContext.moveTo(v.ul.x, v.ul.y);
				canvasContext.lineTo(v.ll.x, v.ll.y);
				canvasContext.lineTo(v.llC.x, v.llC.y);
				canvasContext.lineTo(v.ulC.x, v.ulC.y);
				canvasContext.lineTo(v.ul.x, v.ul.y);
				canvasContext.fillStyle = "#8B5742";
				canvasContext.fill();
			}

			// Bottom Dirt Cliff
			if (this.drawBottomCliff()) {
				canvasContext.beginPath();
				canvasContext.moveTo(v.ll.x, v.ll.y);
				canvasContext.lineTo(v.lr.x, v.lr.y);
				canvasContext.lineTo(v.lrC.x, v.lrC.y);
				canvasContext.lineTo(v.llC.x, v.llC.y);
				canvasContext.lineTo(v.ll.x, v.ll.y);
				canvasContext.fillStyle = "#5C4033";
				canvasContext.fill();
			}
		}
	};

	return Grass;
});