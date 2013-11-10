define(function() {
	function Vec2(x, y) {
		this.x = x;
		this.y = y;

		this.vSubEq = function(s) {
			this.x -= s;
			this.y -= s;

			return this;
		}

		this.sPlusEq = function(s) {
			this.x += s;
			this.y += s;

			return this;
		}

		this.vPlusEq = function(v) {
			this.x += v.x;
			this.y += v.y;

			return this;
		};

		this.sMultiplyEq = function(s) {
			this.x *= s;
			this.y *= s;

			return this;
		};

		this.reverse = function() {
			this.x = -this.x;
			this.y = -this.y;

			return this;
		};

		this.vSubEq = function(v) {
			this.x -= v.x;
			this.y -= v.y;

			return this;
		}

		this.vDistance = function(v) {

			//Find direction vector from the vector v to the vector this
			var x = this.x - v.x;
			var y = this.y - v.y;

			//return the length of the of the direction vector
			return Math.sqrt(x * x + y * y);
		};

		//Returns length of vector
		this.vLength = function() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		};

		this.normalise = function() {
			var length = this.vLength();

			this.x = this.x / length;
			this.y = this.y / length;

			return this;
		}
	}

	return Vec2;
})