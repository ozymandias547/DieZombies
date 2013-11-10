define(["isometric"], function(Iso) {
	return function Grass(tileMap) {
		this._tileMap = tileMap;

		this.tileMap = function() {
			return this._tileMap;
		};

		this.prepVerts = function(x, y, z, w, h) {
			var ul = {
				x: Iso.pX(x, y),
				y: Iso.pY(x, y, z)
			};
			var ulC = {
				x: Iso.pX(x, y),
				y: Iso.pY(x, y, -30)
			};
			var lr = {
				x: Iso.pX(x + w, y + h),
				y: Iso.pY(x + w, y + h, z)
			};
			var lrC = {
				x: Iso.pX(x + w, y + h),
				y: Iso.pY(x + w, y + h, -30)
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
				y: Iso.pY(x, y + h, -30)
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
		}

		this.draw = function(elapsed, canvasContext, x, y, z, w, h) {
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
			canvasContext.beginPath();
			canvasContext.moveTo(v.ul.x, v.ul.y);
			canvasContext.lineTo(v.ll.x, v.ll.y);
			canvasContext.lineTo(v.llC.x, v.llC.y);
			canvasContext.lineTo(v.ulC.x, v.ulC.y);
			canvasContext.lineTo(v.ul.x, v.ul.y);
			canvasContext.fillStyle = "#8B5742";
			canvasContext.fill();

			// Right Dirt Cliff
			canvasContext.beginPath();
			canvasContext.moveTo(v.ll.x, v.ll.y);
			canvasContext.lineTo(v.lr.x, v.lr.y);
			canvasContext.lineTo(v.lrC.x, v.lrC.y);
			canvasContext.lineTo(v.llC.x, v.llC.y);
			canvasContext.lineTo(v.ll.x, v.ll.y);
			canvasContext.fillStyle = "#5C4033";
			canvasContext.fill();
		};
	};
});