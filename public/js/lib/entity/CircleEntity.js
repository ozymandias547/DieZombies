define(["Entity"], function(Entity) {


	var CircleEntity = function(x, y, color, radius) {
		Entity().constructor.call(this, x, y, color);
		this.radius = radius;
	}

	CircleEntity.prototype = Entity();
	CircleEntity.prototype.constructor = CircleEntity;

	CircleEntity.prototype = {
		draw: function(elapsedTime, context) {
			context.fillStyle = this.color;
			context.beginPath();
			context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
			context.closePath();
			context.fill();
		},
		update: function(elapsed) {

		}
	}

	return function(x, y, color, radius) {
		return new CircleEntity(x, y, color, radius)
	}

});