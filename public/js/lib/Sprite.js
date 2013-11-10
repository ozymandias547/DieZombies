define(function() {
	function Sprite(img, width, height, positions) {
		this.img = img;
		this.width = width;
		this.height = height;
		this.positions = positions;
	}

	Sprite.prototype = {
		draw: function(context, position, x, y) {
			var pos = this.positions[position];
			context.drawImage(
				this.img,
				pos[0],
				pos[1],
				this.width,
				this.height,
				x,
				y,
				this.width,
				this.height
			);
		}
	};
	return Sprite;
});