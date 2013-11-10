define(function() {
	function Vec3(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;

		this.vSubEq = function(s) {
			this.x -= s;
			this.y -= s;
			this.z -= s;

			return this;
		}

		this.sPlusEq = function(s) {
			this.x += s;
			this.y += s;
			this.z += s;

			return this;
		}

		this.sRestrictEq = function(s, ignoreZ) {
			if (this.x > s) this.x = s;
			if (this.y > s) this.y = s;
			if (!ignoreZ && this.z > s) this.z = s;
			if (this.x < -(s)) this.x = -(s);
			if (this.y < -(s)) this.y = -(s);
			if (!ignoreZ && this.z < -(s)) this.z = -(s);
		}

		this.vPlusEq = function(v) {
			this.x += v.x;
			this.y += v.y;
			this.z += v.z;

			return this;
		};

		this.sMultiplyEq = function(s) {
			this.x *= s;
			this.y *= s;
			this.z *= s;

			return this;
		};

		this.sMultiply = function(s) {
			return new Vec3(this.x * s, this.y * s, this.z * s);
		};

		this.reverse = function() {
			this.x = -this.x;
			this.y = -this.y;
			this.z = -this.z;

			return this;
		};

		this.vSubEq = function(v) {
			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;

			return this;
		}

		this.vDistance = function(v) {

			//Find direction vector from the vector v to the vector this
			var x = this.x - v.x;
			var y = this.y - v.y;
			var z = this.z - v.z;

			//return the length of the of the direction vector
			return Math.sqrt(x * x + y * y + z * z);
		};

		//Returns length of vector
		this.vLength = function() {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		};

		this.normalize = function() {
			var length = this.vLength();

			this.x = this.x / length;
			this.y = this.y / length;
			this.z = this.z / length;

			return this;
		}
	}

	return Vec3;
})