
define(["Entity", "vec3", "Sprite", "isometric"], function(Entity, Vec3, Sprite, Iso) {

	var Humanoid = function(name, x, y, z, color, radius, engine) {
		Entity.call(this, name, x, y, z, color);
		this.engine = engine;
		this.radius = radius;
		this.moveStep = 500;
		this.maxSpeed = 1000;
		this.isReady = false;
		this.currentSprite = 0;
		this.spriteFrequency = 200; //in milliseconds
		this.elapsedTime = 0;
		this.lastTime = new Date();

		this.image = new Image();
		this.image.src = "assets/GirlDarkExample.png";

		this.image.onload = function() {
			this.isReady = true;
			this.runningDown = new Sprite(this.image, 40, 40, [
				[0, 0],
				[40, 0],
				[80, 0]
			]);
			this.runningRight = new Sprite(this.image, 40, 40, [
				[0, 40],
				[40, 40],
				[80, 40]
			]);
			this.runningUp = new Sprite(this.image, 40, 40, [
				[0, 80],
				[40, 80],
				[80, 80]
			]);
			this.runningLeft = new Sprite(this.image, 40, 40, [
				[0, 120],
				[40, 120],
				[80, 120]
			]);
		}.bind(this);
	}

	Humanoid.prototype = new Entity();
	Humanoid.prototype.constructor = Humanoid;

	Humanoid.prototype.draw = function(elapsed, context) {
		if (this.isMoving(.2)) {
			var currentTime = new Date();
			this.elapsedTime = currentTime - this.lastTime + this.elapsedTime;

			if (this.elapsedTime > this.spriteFrequency) {
				this.elapsedTime = this.elapsedTime - this.spriteFrequency;
				this.currentSprite++
				if (this.currentSprite > 2) this.currentSprite = 0;
			}

			this.lastTime = new Date();
		} else {
			this.currentSprite = 1;
		}

		var x = Iso.pX(this.position.x, this.position.y);
		var y = Iso.pY(this.position.x, this.position.y, this.position.z);

		if (this.isReady) {
			switch (this.previousPressed) {
				case "up":
					this.runningUp.draw(context, this.currentSprite, x, y);
					break;
				case "right":
					this.runningRight.draw(context, this.currentSprite, x, y);
					break;
				case "down":
					this.runningDown.draw(context, this.currentSprite, x, y);
					break;
				case "left":
					this.runningLeft.draw(context, this.currentSprite, x, y);
					break;
			}
		}
	}

	Humanoid.prototype.isMoving = function() {
		return this.velocity.x > this.threshold ||
			this.velocity.x < -this.threshold ||
			this.velocity.y > this.threshold ||
			this.velocity.y < -this.threshold ||
			this.velocity.z > this.threshold ||
			this.velocity.z < -this.threshold;
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