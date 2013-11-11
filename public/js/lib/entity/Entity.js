define(["vec3", "isometric"], function(Vec3, Iso) {

	var Entity = function(name, x, y, z, color) {
		color = color || "red";

		this.position = new Vec3(x, y, z);
		this.velocity = new Vec3(0, 0, 0);
		this.speed = 0;
		this.name = name;

		this.groundFriction = 0.92;

		this.color = color;

		this.zBuffIndex = function() {
			return Iso.pY(this.position.x, this.position.y, this.position.z);
		}
	}

	Entity.prototype.build = function(id, def) {

	}

	//to make a new Entity, just call the function
	return function(x, y, color) {
		return new Entity(x, y, color);
	}


});