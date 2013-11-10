define(['vec3'], function(Vec3) {

	var Entity = function(x, y, z, color) {
			color = color || "red";

			this.position = new Vec3(x, y, z);
			this.velocity = new Vec3(0, 0, 0);
			this.speed = 0;

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