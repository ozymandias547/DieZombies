define(function() {
	function Sprite(img, speed, width, height, positions) {
		this.img = img;
		this.width = width;
		this.height = height;
		this.positions = positions;
		this.speed = speed;
		this.currentSprite = 0;

		this.elapsedTime = 0;
	}

	Sprite.prototype = {
		//userSprite is optional, to set the draw as something static.
		draw: function(context, elapsed, x, y, userSprite) {
			

			if (userSprite && userSprite < this.positions.length) {
				this.currentSprite = userSprite;
			} else {
				this.elapsedTime += elapsed;

				if (this.elapsedTime > this.speed) {
					this.currentSprite++;
					this.elapsedTime = 0;
					if (this.currentSprite > 2) this.currentSprite = 0;
				}
			}

			var pos = this.positions[this.currentSprite];
			
			context.drawImage(
				this.img,
				pos[0],
				pos[1],
				this.width,
				this.height,
				x - this.width / 2,
				y - this.height,
				this.width,
				this.height
			);
		},
		setSpeed: function(speed) {
			this.speed = speed;	
		},

	};
	return Sprite;
});