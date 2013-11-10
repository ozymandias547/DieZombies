define(['vec2'], function(Vec2) {

	var Entity = function(x, y, color) {
			color = color || "red";

			this.position = new Vec2(x, y);
			this.velocity = new Vec2(0, 0);

			this.groundFriction = 0.92;

			this.color = color;
		}

	Entity.prototype.build = function(id, def) {
			
		}


	//to make a new Entity, just call the function
	return function(x, y, color) {
		return new Entity(x, y, color);
	}


});