
define(["Entity", "vec3", "Sprite", "isometric"], function(Entity, Vec3, Sprite, Iso) {

	var Humanoid = function(name, x, y, z, color, radius, engine) {
		Entity.call(this, name, x, y, z, color);
		this.engine = engine;
		this.radius = radius;
		this.moveStep = 500;
		this.maxSpeed = 1000;
		this.isReady = false;
		this.elapsedTime = 0;
		this.lastTime = new Date();
	}

	Humanoid.prototype = new Entity();
	Humanoid.prototype.constructor = Humanoid;

	Humanoid.prototype.draw = function(elapsed, context) {
		
		var x = Iso.pX(this.position.x, this.position.y);
		var y = Iso.pY(this.position.x, this.position.y, this.position.z);

		//draw specific sprite for specific humanoid.  create this function in child classes.
		if (this.drawSprite) {
			this.drawSprite(elapsed, context, x, y)
		} else {
			console.log("please implement method drawSprite(elapsed, context, viewX, viewY) to handle entities rendering.")
			//draw default entity

			context.beginPath();
		    context.arc(x+this.radius, y+this.radius, this.radius, 0, 2 * Math.PI, false);
		    context.fillStyle = 'green';
		    context.fill();
		    context.lineWidth = 5;
		    context.strokeStyle = '#003300';
		    context.stroke();
		}
	}

	Humanoid.prototype.isMoving = function(threshhold) {
		return this.velocity.x > threshhold ||
			this.velocity.x < -threshhold ||
			this.velocity.y > threshhold ||
			this.velocity.y < -threshhold ||
			this.velocity.z > threshhold ||
			this.velocity.z < -threshhold;
	}

	Humanoid.prototype.update = function(elapsed, worldObjects) {
		var prevTile = this.tile;

		if (!this.tile) {
			this.tile = this.engine.tileMap.getTileAt(this.position.x, this.position.y);
		}

		if (isNaN(this.position.z)) {
			this.position.z = this.tile.z();
		}
		if (this.handleControls) this.handleControls(elapsed);
			
		this.velocity.sMultiplyEq(this.groundFriction)
		this.velocity.sRestrictEq(this.maxSpeed, true);
		this.position.vPlusEq(this.velocity.sMultiply(elapsed));

		this.tile = this.engine.tileMap.getTileAt(this.position.x, this.position.y);

		// If we are falling onto our current tile and the movement pushed us
		// below then reset our vertical velocity and set our height to the tile height.
		if (this.tile && this.velocity.z < 0 && this.position.z < this.tile.z()) {
			this.velocity.z = 0;
			this.position.z = this.tile.z();
		}

		if (prevTile)
		{
			delete prevTile.children[this.name];
		}

		if (this.tile) {
			this.tile.children[this.name] = this;


			var delta = this.tile.z() - this.position.z;

			if (delta < 0) {
				this.clearEffectiveTile();
				// Falling!
				this.velocity.z -= 500 * elapsed;
			} else if (delta == 0) {
				this.clearEffectiveTile();
				// On the ground, can't fall through it!
				if (this.velocity.z < 0) {
					this.velocity.z = 0;
				}
			} else if (delta > 0) {
				// Climbing!
				// If this is our first time we bumped into this tile that has a cliff,
				// We want to stop horizontal velocity and if the user
				// was already falling, we obviously need to stop that too.
				if (this.tile != prevTile) {
					this.effectiveTile = prevTile;
					this.velocity.x = this.velocity.y = 0;
				}

				if (this.velocity.z < 0) {
					this.velocity.z = 0;
				}
			}
		}

		if (this.effectiveTile)
		{
			this.effectiveTile.children[this.name] = this;
			delete this.tile.children[this.name];
		}



	}

	Humanoid.prototype.clearEffectiveTile = function() {
		if (this.effectiveTile)
		{
			delete this.effectiveTile.children[this.name];
		}

		this.effectiveTile = null;
	}

	return Humanoid;	
})