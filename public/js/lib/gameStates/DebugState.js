define(["jquery", "dieZombieEngine", "AbstractState", "Screen"], function($, engine, AbstractState, Screen) {
	var DebugState = function() {
		new AbstractState().constructor.call(this, "Debug State");

		this.curHighlightTile = null;
	};

	DebugState.prototype = {
		findPos: function(obj) {
			var curleft = 0,
				curtop = 0;
			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
				} while (obj = obj.offsetParent);
				return {
					x: curleft,
					y: curtop
				};
			}
			return undefined;
		},
		rgbToNum: function(r, g, b) {
			return (r << 16) | (g << 8) | b;
		},
		enter: function() {
			var self = this;
			$('#canvas0').mousemove(function(e) {

				if (this.curHighlightTile)
				{
					this.curHighlightTile.highlighted = false;
					this.curHighlightTile = null;
				}
				
				var pos = self.findPos(this);
				var x = e.pageX - pos.x;
				var y = e.pageY - pos.y;
				var coord = "x=" + x + ", y=" + y;
				var c = this.getContext('2d');
				var p = c.getImageData(x, y, 1, 1).data;
				var colorNum = self.rgbToNum(p[0], p[1], p[2]);
				this.curHighlightTile = Screen.idColorToObjectMap["c" + colorNum];

				if (this.curHighlightTile)
				{
					tile.highlighted = true;
				}

				console.log(coord + " | " + colorNum);
			});
		}
	};
	return new DebugState();
});