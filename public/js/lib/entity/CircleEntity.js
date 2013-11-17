define(["Entity", "isometric"], function(Entity, Iso) {
	var CircleEntity = function(name, x, y, color, radius) {
		Entity.call(this, name, x, y, color);
		this.radius = radius;
	}

	CircleEntity.prototype = new Entity();
	CircleEntity.prototype.constructor = CircleEntity;

	CircleEntity.prototype = {
		draw: function(elapsedTime, context) {
			context.fillStyle = this.color;
			context.beginPath();
			context.arc(Iso.pX(this.position.x, this.position.y), Iso.pY(this.position.x, this.position.y), this.radius, 0, Math.PI * 2, true);
			context.closePath();
			context.fill();
		},
		update: function(elapsed) {

		}
	}

	return CircleEntity;

});