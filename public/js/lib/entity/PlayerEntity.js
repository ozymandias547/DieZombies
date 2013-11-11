define(["Entity", "vec3", "Sprite", "isometric"], function(Entity, Vec3, Sprite, Iso) {
	var PlayerEntity = function(name, x, y, z, color, radius, engine) {
		Entity().constructor.call(this, name, x, y, z, color);
		this.engine = engine;
		this.radius = radius;
		this.moveStep = 500;
		this.maxSpeed = 1000;
		this.isReady = false;
		this.currentSprite = 0;
		this.spriteFrequency = 200; //in milliseconds
		this.elapsedTime = 0;
		this.lastTime = new Date();

		this.upPressed = false,
		this.downPressed = false,
		this.rightPressed = false,
		this.leftPressed = false;
		this.previousPressed = "right";

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

		document.addEventListener("keydown", this.handleKeyDown.bind(this))
		document.addEventListener("keyup", this.handleKeyUp.bind(this))
	}

	PlayerEntity.prototype = Entity();
	PlayerEntity.prototype.constructor = PlayerEntity;

	PlayerEntity.prototype = {
		draw: function(elapsed, context) {
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
		},

		isMoving: function() {
			return this.velocity.x > this.threshold ||
				this.velocity.x < -this.threshold ||
				this.velocity.y > this.threshold ||
				this.velocity.y < -this.threshold ||
				this.velocity.z > this.threshold ||
				this.velocity.z < -this.threshold;
		},

		update: function(elapsed, worldObjects) {
			var prevTile = this.tile;

			if (!this.tile) {
				this.tile = this.engine.tileMap.getTileAt(this.position.x, this.position.y);
			}

			if (isNaN(this.position.z)) {
				this.position.z = this.tile.z();
			}

			this.handleControls(elapsed);
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
		},

		clearEffectiveTile: function()
		{
			if (this.effectiveTile)
			{
				delete this.effectiveTile.children[this.name];
			}

			this.effectiveTile = null;
		},

		handleControls: function(elapsed) {
			var deltaX = 0,
				deltaY = 0;

			if (this.upPressed) {
				deltaX = this.moveStep * elapsed;
				deltaY -= this.moveStep * elapsed;
			} else if (this.downPressed) {
				deltaX -= this.moveStep * elapsed;
				deltaY += this.moveStep * elapsed;
			}

			if (this.rightPressed) {
				deltaX += this.moveStep * elapsed;
				deltaY += this.moveStep * elapsed;
			} else if (this.leftPressed) {
				deltaX -= this.moveStep * elapsed;
				deltaY -= this.moveStep * elapsed;
			}

			var allowHorizontal = true;

			if (this.tile) {
				allowHorizontal = false;
				var deltaZ = this.tile.z() - this.position.z;

				// Normalize (-1, 0, or 1) from float
				var dx = deltaX ? (deltaX > 0 ? 10 : -10) : 0;
				var dy = deltaY ? (deltaY > 0 ? 10 : -10) : 0;

				// Here we find the destination tile IF we allow the user to continue pressing the key
				// that they are pressing.
				var destTile = this.engine.tileMap.getTileAt(this.position.x + dx, this.position.y + dy);
				var destZ = destTile.z();

				// Do we need to climb?
				if (deltaZ > 0) {
					// Is the user requesting to move toward the tile we are on that is
					// higher than we are? Then climb.
					if ((dx || dy) && destTile == this.tile) {
						this.velocity.z += 500 * elapsed;
					} else {
						// In this case, we just allow the user to continue moving OFF the tile
						// that they are climbing onto and this will automatically put them in fall
						// state.
						allowHorizontal = true;
					}
				} else if (deltaZ < 0) {
					// Falling!
					this.velocity.z -= 1000 * elapsed;
				} else {
					allowHorizontal = true;
				}
			}

			if (allowHorizontal) {
				this.velocity.vPlusEq(new Vec3(deltaX, deltaY, 0));
			}
		},

		handleKeyDown: function(e) {
			switch (e.which) {
				case 87:
					this.upPressed = true;
					this.previousPressed = "up";
					break;
				case 83:
					this.downPressed = true;
					this.previousPressed = "down";
					break;
				case 68:
					this.rightPressed = true;
					this.previousPressed = "right";
					break;
				case 65:
					this.leftPressed = true;
					this.previousPressed = "left";
					break;
			}
		},

		handleKeyUp: function(e) {
			switch (e.which) {
				case 87:
					this.upPressed = false;
					break;
				case 83:
					this.downPressed = false;
					break;
				case 68:
					this.rightPressed = false;
					break;
				case 65:
					this.leftPressed = false;
					break;
			}
		}
	};

	return PlayerEntity;
});